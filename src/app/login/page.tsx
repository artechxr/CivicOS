'use client';

import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Divider,
  Alert
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance } from '@/services/firebase';

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
  }, [user, isGuest, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(msg);
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuthInstance(); // ✅ inside function

    if (!auth) {
      setError('Auth not initialized. Try again.');
      return;
    }

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
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4, width: '100%', textAlign: 'center' }}>
        <HowToVoteIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />

        <Typography variant="h4" gutterBottom>
          CivicOS
        </Typography>

        <Typography variant="body2" sx={{ mb: 3 }}>
          Your Smart Election Assistant 🇮🇳
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleEmailLogin}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }} disabled={isLoggingIn}>
            {isLoggingIn ? <CircularProgress size={20} /> : 'Login'}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
        >
          Sign in with Google
        </Button>

        <Button fullWidth onClick={handleGuest} sx={{ mt: 1 }}>
          Continue as Guest
        </Button>
      </Paper>
    </Container>
  );
}
