'use client';

import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  CircularProgress, 
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  SelectChangeEvent,
  TextField,
  Chip,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { motion } from 'framer-motion';
import TranslateIcon from '@mui/icons-material/Translate';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import DashboardCard from '@/components/Dashboard/ActionCard';
import ChatPanel from '@/components/Dashboard/ChatPanel';
import ElectionStats from '@/components/Dashboard/ElectionStats';
import ElectionReadiness from '@/components/Dashboard/ElectionReadiness';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, languages, LanguageCode } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { user, loading, isGuest, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [boothSearch, setBoothSearch] = useState('');
  const [booths, setBooths] = useState<{name: string, address: string, distance: string}[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.push('/login');
    }
  }, [user, isGuest, loading, router]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as LanguageCode);
  };

  const handleBoothSearch = () => {
    if (!boothSearch.trim()) return;
    setBooths([
      { name: 'Government Primary School', address: 'Main Road, Block A, ' + boothSearch, distance: '0.8 km' },
      { name: 'Community Center', address: 'Near Post Office, ' + boothSearch, distance: '1.5 km' },
      { name: 'Public Library Hall', address: 'Market Square, ' + boothSearch, distance: '2.3 km' },
    ]);
  };

  if (loading || (!user && !isGuest)) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const guidedSteps = [
    { label: t('Registration', 'पंजीकरण'), description: t('Check if you are enrolled in the electoral roll.', 'जांचें कि क्या आप मतदाता सूची में नामांकित हैं।') },
    { label: t('Identity', 'पहचान'), description: t('Collect your Voter ID or prepare alternative IDs.', 'अपना वोटर आईडी लें या वैकल्पिक आईडी तैयार करें।') },
    { label: t('Location', 'स्थान'), description: t('Find your designated polling booth.', 'अपना निर्दिष्ट मतदान केंद्र खोजें।') },
    { label: t('The Vote', 'वोट'), description: t('Visit the booth and cast your vote on EVM.', 'बूथ पर जाएं और EVM पर अपना वोट डालें।') },
  ];

  const renderModalContent = () => {
    switch (modalType) {
      case 'guide':
        return (
          <Box sx={{ py: 2 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {guidedSteps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{step.label}</Typography>
                    <Typography variant="body2">{step.description}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button disabled={activeStep === 0} onClick={() => setActiveStep(prev => prev - 1)} variant="outlined">Back</Button>
              <Button disabled={activeStep === guidedSteps.length - 1} onClick={() => setActiveStep(prev => prev + 1)} variant="contained">Next</Button>
            </Box>
          </Box>
        );
      case 'docs':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom color="primary">{t('Primary Document', 'प्राथमिक दस्तावेज')}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{t('Voter ID (EPIC Card) is the preferred document for identification at the polling station.', 'मतदान केंद्र पर पहचान के लिए वोटर आईडी (EPIC कार्ड) पसंदीदा दस्तावेज है।')}</Typography>
            <Typography variant="subtitle2" gutterBottom color="primary">{t('Alternative Documents (If EPIC is not available)', 'वैकल्पिक दस्तावेज (यदि EPIC उपलब्ध नहीं है)')}</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li><Typography variant="body2">Aadhaar Card</Typography></li>
              <li><Typography variant="body2">PAN Card</Typography></li>
              <li><Typography variant="body2">MNREGA Job Card</Typography></li>
              <li><Typography variant="body2">Passbook with photo issued by Bank/Post Office</Typography></li>
              <li><Typography variant="body2">Health Insurance Smart Card issued by Ministry of Labour</Typography></li>
              <li><Typography variant="body2">Driving License</Typography></li>
              <li><Typography variant="body2">Passport</Typography></li>
            </Box>
          </Box>
        );
      case 'booth':
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>{t('Enter your area or pincode to find nearby polling stations.', 'पास के मतदान केंद्रों को खोजने के लिए अपना क्षेत्र या पिनकोड दर्ज करें।')}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder={t('Area or Pincode', 'क्षेत्र या पिनकोड')} 
                value={boothSearch}
                onChange={(e) => setBoothSearch(e.target.value)}
              />
              <Button variant="contained" onClick={handleBoothSearch}>{t('Search', 'खोजें')}</Button>
            </Box>
            
            {booths.length > 0 && (
              <Box>
                {booths.map((booth, idx) => (
                  <Paper key={idx} sx={{ mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#F7F9FC' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{booth.name}</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>{booth.address}</Typography>
                        <Chip size="small" icon={<LocationOnIcon />} label={booth.distance} color="primary" variant="outlined" sx={{ mt: 1 }} />
                      </Box>
                      <IconButton color="primary" onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(booth.name + ' ' + booth.address)}`)}>
                        <MapIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HowToVoteIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>CivicOS</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={handleLanguageChange}
                startAdornment={<TranslateIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />}
                sx={{ borderRadius: 10, bgcolor: 'white' }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>{lang.nativeName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                  {isGuest ? 'G' : user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem disabled><PersonIcon sx={{ mr: 1 }} fontSize="small" /> {isGuest ? 'Guest User' : user?.email}</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><LogoutIcon sx={{ mr: 1 }} fontSize="small" /> Logout</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Fake News Alert */}
              <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 4, borderRadius: 3, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <AlertTitle sx={{ fontWeight: 700 }}>{t('Fake News Alert', 'फेक न्यूज अलर्ट')}</AlertTitle>
                {t('Beware of WhatsApp forwards claiming you can vote online. Online voting is NOT available in India.', 'ऑनलाइन वोटिंग का दावा करने वाले व्हाट्सएप संदेशों से सावधान रहें। भारत में ऑनलाइन वोटिंग उपलब्ध नहीं है।')}
              </Alert>

              <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                  {t('Welcome to CivicOS Assistant', 'CivicOS असिस्टेंट में आपका स्वागत है')}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  {t('Your complete, reliable guide for the 2024 Indian General Elections.', '2024 के भारतीय आम चुनावों के लिए आपका पूर्ण, विश्वसनीय मार्गदर्शक।')}
                </Typography>
              </Box>

              {/* Action Cards */}
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12 }}>
                  <DashboardCard 
                    title={t('First-Time Voter', 'पहली बार मतदाता')} 
                    subtitle={t('Step-by-step guided flow', 'चरण-दर-चरण निर्देशित प्रवाह')} 
                    icon={<SchoolIcon fontSize="large" sx={{ color: 'primary.main' }} />} 
                    onClick={() => setModalType('guide')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <DashboardCard 
                    title={t('Find Booth', 'बूथ खोजें')} 
                    subtitle={t('Locate polling station', 'मतदान केंद्र का पता लगाएं')} 
                    icon={<LocationOnIcon fontSize="large" sx={{ color: 'secondary.main' }} />} 
                    onClick={() => setModalType('booth')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <DashboardCard 
                    title={t('Documents ID', 'दस्तावेज आईडी')} 
                    subtitle={t('What you need to carry', 'क्या ले जाना है')} 
                    icon={<VerifiedUserIcon fontSize="large" sx={{ color: 'info.main' }} />} 
                    onClick={() => setModalType('docs')}
                  />
                </Grid>
              </Grid>

              {/* Election Stats Section */}
              <Box sx={{ mb: 6 }}>
                <ElectionStats />
                <ElectionReadiness />
              </Box>

              {/* Did You Know Section */}
              <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'primary.main', color: 'white', mb: 6, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TipsAndUpdatesIcon />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('Did You Know?', 'क्या आप जानते हैं?')}</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                    {t('India is the world\'s largest democracy with nearly 970 million registered voters. In 2019, the election commission set up a polling booth for just ONE voter in the Gir Forest of Gujarat!', 'भारत लगभग 97 करोड़ पंजीकृत मतदाताओं के साथ दुनिया का सबसे बड़ा लोकतंत्र है। 2019 में, चुनाव आयोग ने गुजरात के गिर जंगल में सिर्फ एक मतदाता के लिए एक मतदान केंद्र स्थापित किया था!')}
                  </Typography>
                </Box>
                <HowToVoteIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 160, opacity: 0.1 }} />
              </Paper>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ height: 'calc(100vh - 40px)', position: { lg: 'sticky' }, top: '20px', mb: { xs: 4, lg: 0 } }}>
              <ChatPanel />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Feature Dialog */}
      <Dialog open={Boolean(modalType)} onClose={() => setModalType(null)} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="primary" />
          {modalType === 'guide' ? t('Guided Voter Journey', 'निर्देशित मतदाता यात्रा') : t('Details', 'विवरण')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {renderModalContent()}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(0,0,0,0.05)', p: 2 }}>
          <Button onClick={() => setModalType(null)} variant="outlined" color="primary">{t('Close', 'बंद करें')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
