'use client';

import { Box, Button, Container, Typography, Paper, CircularProgress, TextField, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance } from '@/services/firebase';

const auth = getAuthInstance();

export default function LoginPage() {
  const { user, loading, isGuest, signInWithGoogle, continueAsGuest } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && (user || isGuest)) {
      router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isGuest]);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoggingIn(true);
      await signInWithGoogle();
      // Router push happens in useEffect
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(msg);
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoggingIn(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password. Or account does not exist.');
      setIsLoggingIn(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.push('/');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
        <HowToVoteIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          CivicOS
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Your Smart Election Assistant 🇮🇳
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleEmailLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            size="large" 
            sx={{ mt: 2, mb: 3 }}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button 
          fullWidth 
          variant="outlined" 
          size="large" 
          startIcon={<GoogleIcon />} 
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)', color: 'text.primary' }}
        >
          Sign in with Google
        </Button>

        <Button 
          fullWidth 
          variant="text" 
          color="secondary" 
          onClick={handleGuest}
          disabled={isLoggingIn}
        >
          Continue as Guest
        </Button>
      </Paper>
    </Container>
  );
}
