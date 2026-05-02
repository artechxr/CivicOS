'use client';

import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  useTheme,
  Tooltip,
  CircularProgress,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { detectIntent, getGeneralGuide } from '@/utils/intentEngine';
import { translateStructuredResponse, translateText } from '@/utils/translator';
import { getDbInstance } from '@/services/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import { sanitizeInput, validateInput } from '@/utils/security';

import { KnowledgeResponse } from '@/data/knowledgeBase';

type StructuredData = Record<string, unknown>;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: KnowledgeResponse | null;
}

interface UserProfile {
  isFirstTime: boolean | null;
  state: string;
}

export default function ChatPanel() {
  const theme = useTheme();
  const { language, t } = useLanguage();
  const { user, isGuest } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickActionsTranslated, setQuickActionsTranslated] = useState<{ label: string, query: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Context & Personalization State
  const [contextHistory, setContextHistory] = useState<string[]>([]);
  const [isDetailedMode, setIsDetailedMode] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ isFirstTime: null, state: '' });

  // Scenario Flow State
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Initial Welcome Message
  useEffect(() => {
    const initWelcome = async () => {
      const welcomeEn = 'Namaste! I am your CivicOS Assistant. I can help you with registration, documents, and understanding the voting process.';
      const translated = await translateText(welcomeEn, language, 'en');
      setMessages([{ role: 'assistant', content: translated }]);

      // Trigger profile setup on first load if not set
      if (profile.isFirstTime === null) {
        setShowProfileSetup(true);
      }
    };
    initWelcome();
  }, [language, profile.isFirstTime]);

  // Translate Quick Actions
  useEffect(() => {
    const actions = [
      { labelEn: 'Voting Process', queryEn: 'how to vote' },
      { labelEn: 'Documents Required', queryEn: 'documents required' },
      { labelEn: 'First-Time Guide', queryEn: 'registration' },
      { labelEn: 'Compare Candidates', queryEn: 'compare' },
      { labelEn: 'Lost ID Card', queryEn: 'scenario_lost_id' }
    ];

    const translateActions = async () => {
      const translated = await Promise.all(actions.map(async (a) => ({
        label: await translateText(a.labelEn, language, 'en'),
        query: a.queryEn
      })));
      setQuickActionsTranslated(translated);
    };
    translateActions();
  }, [language]);


  // Load chat history from Firestore
  useEffect(() => {
    if (user && !isGuest && messages.length <= 1) {
      const loadHistory = async () => {
        try {
          const db = getDbInstance();
          if (!db) return;
          const q = query(collection(db, 'chats'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(10));
          const querySnapshot = await getDocs(q);
          const history: Message[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as StructuredData;
            history.push({ role: 'user', content: data.prompt as string });
            if (data.structuredData) {
              history.push({ role: 'assistant', content: '', data: JSON.parse(data.structuredData as string) as KnowledgeResponse });
            } else {
              history.push({ role: 'assistant', content: data.response as string });
            }
          });
          if (history.length > 0) {
            setMessages(prev => [...prev, ...history.reverse()]);
          }
        } catch (err) {
          console.error("Error loading chat history:", err);
        }
      };
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isGuest]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const clearChat = async () => {
    const welcomeEn = 'Namaste! I am your CivicOS Assistant. How can I help you navigate the Indian Elections today?';
    const translated = await translateText(welcomeEn, language, 'en');
    setMessages([{ role: 'assistant', content: translated }]);
    setContextHistory([]);
    setActiveScenario(null);
  };

  const saveToFirestore = async (prompt: string, responseText: string, structuredData?: KnowledgeResponse | null) => {
    if (!user?.uid) return;
    if (user && !isGuest) {
      try {
        const db = getDbInstance();
        if (!db) return;
        await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          prompt,
          response: responseText,
          structuredData: structuredData ? JSON.stringify(structuredData) : null,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving to Firestore:", err);
      }
    }
  };

  // Scenario Handlers
  const handleScenarioInput = async (text: string) => {
    let reply = '';
    let isComplete = false;

    if (activeScenario === 'lost_id') {
      if (text.toLowerCase().includes('yes')) {
        reply = "Great! You can use your Aadhaar Card as a valid ID at the polling booth.";
        isComplete = true;
      } else if (text.toLowerCase().includes('no')) {
        reply = "No problem. You can also use a PAN card, Driving License, or a Bank Passbook with a photo.";
        isComplete = true;
      } else {
        reply = "Please answer Yes or No. Do you have an Aadhaar Card?";
      }
    }

    const translatedReply = await translateText(reply, language, 'en');
    setMessages(prev => [...prev, { role: 'assistant', content: translatedReply }]);

    if (isComplete) {
      setActiveScenario(null);
    }
    setIsLoading(false);
  };

  const handleSend = async (text: string) => {
    const sanitizedText = sanitizeInput(text);
    const trimmedText = sanitizedText.trim();
    if (!trimmedText || isLoading) return;

    if (!validateInput(trimmedText)) {
      const errorMsg = await translateText("Input is invalid or too long. Please keep it under 500 characters.", language, 'en');
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      setIsLoading(false);
      return;
    }

    const userMessage: Message = { role: 'user', content: trimmedText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 1. Check if we are in a guided scenario
    if (activeScenario) {
      await handleScenarioInput(trimmedText);
      return;
    }

    // Trigger Scenario Initiation
    if (trimmedText === 'scenario_lost_id' || trimmedText.toLowerCase().includes('lost my voter id')) {
      setActiveScenario('lost_id');
      const intro = await translateText("I can help you with that. First, do you have an Aadhaar Card? (Yes/No)", language, 'en');
      setMessages(prev => [...prev, { role: 'assistant', content: intro }]);
      setIsLoading(false);
      return;
    }

    try {
      const lastContext = contextHistory.length > 0 ? contextHistory[contextHistory.length - 1] : undefined;

      // 2. Detect Intent with context
      const resultData = await detectIntent(trimmedText, language, lastContext);

      const currentResultData = resultData || getGeneralGuide();

      if (currentResultData) {
        setContextHistory(prev => [...prev.slice(-2), currentResultData.intent]);
      }

      // 3. Personalize Response (e.g., if first time voter, emphasize registration)
      let finalResultData = currentResultData;
      if (profile.isFirstTime && currentResultData.intent === 'voting_process') {
        finalResultData = {
          ...currentResultData,
          tips: ['Welcome, First-Time Voter! Don\'t be nervous, the officials are there to help you.', ...currentResultData.tips]
        };
      }

      const finalData = await translateStructuredResponse(finalResultData, language);

      setMessages(prev => [...prev, { role: 'assistant', content: '', data: finalData as any }]);
      saveToFirestore(trimmedText, finalData.explanation, finalData as any);

    } catch (error) {
      console.error("Chat Error:", error);
      const fallbackMsg = await translateText("I encountered an error processing that request. Please try again.", language, 'en');
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmartSuggestion = (intentKey: string) => {
    // Map intent keys to readable queries for the UI
    const intentToQuery: Record<string, string> = {
      'documents': 'What documents are required?',
      'voting_process': 'How do I vote?',
      'registration': 'How do I register?',
      'political_parties': 'Tell me about political parties',
      'types_of_elections': 'What types of elections are there?',
      'election_day': 'What happens on election day?'
    };
    handleSend(intentToQuery[intentKey] || intentKey);
  };

  const renderStructuredData = (data: KnowledgeResponse) => {
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>{data.explanation}</Typography>

        {isDetailedMode && data.steps && data.steps.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{language === 'en' ? 'Steps to Follow:' : 'कदम:'}</Typography>
            {data.steps.map((step: string, i: number) => (
              <Typography key={i} variant="body2" sx={{ mb: 0.5, pl: 1 }}>{i + 1}. {step}</Typography>
            ))}
          </Box>
        )}

        {isDetailedMode && data.table && (
          <TableContainer component={Paper} elevation={0} sx={{ mb: 2, border: '1px solid rgba(0,0,0,0.1)', bgcolor: 'rgba(255,255,255,0.5)' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {data.table.headers.map((h: string, i: number) => (
                    <TableCell key={i} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.table.rows.map((row: string[], i: number) => (
                  <TableRow key={i}>
                    {row.map((cell: string, j: number) => (
                      <TableCell key={j}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {isDetailedMode && data.tips && data.tips.length > 0 && (
          <Box sx={{ bgcolor: 'rgba(0,0,0,0.03)', p: 1.5, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
              {language === 'en' ? 'Important Notes:' : 'महत्वपूर्ण सूचना:'}
            </Typography>
            {data.tips.map((tip: string, i: number) => (
              <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>• {tip}</Typography>
            ))}
          </Box>
        )}

        {/* Smart Suggestions */}
        {data.relatedIntents && data.relatedIntents.length > 0 && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              {language === 'en' ? 'You may also want to know:' : 'आप यह भी जानना चाह सकते हैं:'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.relatedIntents.slice(0, 3).map((intent: string, idx: number) => (
                <Chip
                  key={idx}
                  label={intent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  size="small"
                  onClick={() => handleSmartSuggestion(intent)}
                  sx={{ bgcolor: 'rgba(126, 231, 135, 0.1)', color: 'primary.dark', '&:hover': { bgcolor: 'rgba(126, 231, 135, 0.2)' } }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#FFFFFF',
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
        }}
      >
        {/* Chat Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F7F9FC' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>CivicOS AI Guide</Typography>
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                {activeScenario ? '● Guided Scenario Active' : '● Context Aware Engine'}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <FormControlLabel
              control={<Switch size="small" checked={isDetailedMode} onChange={(e) => setIsDetailedMode(e.target.checked)} />}
              label={<Typography variant="caption">{isDetailedMode ? 'Detailed' : 'Simple'}</Typography>}
            />
            <Tooltip title={t('Clear Chat', 'चैट साफ़ करें')}>
              <IconButton size="small" onClick={clearChat} sx={{ color: 'text.secondary' }}>
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Chat Messages */}
        <Box role="main" sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 1, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: msg.role === 'user' ? 'secondary.main' : '#F7F9FC',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      borderBottomRightRadius: msg.role === 'user' ? 2 : 12,
                      borderBottomLeftRadius: msg.role === 'user' ? 12 : 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.data ? renderStructuredData(msg.data) : (
                      <Typography variant="body2" sx={{ lineHeight: 1.7, fontSize: '0.875rem' }}>{msg.content}</Typography>
                    )}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <Box sx={{ alignSelf: 'flex-start', ml: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.5, p: 1.5, bgcolor: '#F7F9FC', borderRadius: 3 }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.palette.text.secondary }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.palette.text.secondary }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.palette.text.secondary }} />
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Persistent Quick Actions */}
        {!activeScenario && (
          <Box sx={{ px: 2, pb: 1, pt: 1, bgcolor: '#F7F9FC', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)' } }}>
              {quickActionsTranslated.map((action, idx) => (
                <Chip
                  key={idx}
                  label={action.label}
                  onClick={() => handleSend(action.query)}
                  variant="outlined"
                  clickable
                  sx={{ borderRadius: 2, borderColor: 'primary.light', color: 'primary.main', bgcolor: 'white' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Chat Input */}
        <Box sx={{ p: 2, bgcolor: '#F7F9FC' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              bgcolor: 'white',
              borderRadius: 10,
              p: 0.5,
              pl: 2,
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder={activeScenario ? 'Reply Yes or No...' : t('Ask your Civic Guide...', 'मतदान के बारे में पूछें...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              disabled={isLoading}
              slotProps={{ htmlInput: { 'aria-label': 'Chat input' }, input: { disableUnderline: true } }}
              sx={{ mt: 0.5 }}
            />
            <IconButton
              color="primary"
              aria-label="Send message"
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'rgba(255,255,255,0.3)' }
              }}
            >
              {isLoading ? <CircularProgress size={18} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Onboarding Profile Modal */}
      <Dialog open={showProfileSetup}>
        <DialogTitle sx={{ fontWeight: 700 }}>Personalize Your Assistant</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>Help us tailor our guidance to your needs.</Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Are you a first-time voter?</FormLabel>
            <RadioGroup row value={profile.isFirstTime ? 'yes' : 'no'} onChange={(e) => setProfile({ ...profile, isFirstTime: e.target.value === 'yes' })}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProfileSetup(false)} variant="contained" color="primary">Start Chatting</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
