'use client';

import { Box, Typography, Paper, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function ElectionReadiness() {
  const [readiness, setReadiness] = useState({
    registered: false,
    hasId: false,
    knowsBooth: false,
  });

  const handleToggle = (key: keyof typeof readiness) => {
    setReadiness(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const score = Object.values(readiness).filter(Boolean).length;

  return (
    <Paper sx={{ p: 3, borderRadius: 4, mt: 4, border: '1px solid rgba(0,0,0,0.05)', bgcolor: '#F7F9FC' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <VerifiedUserIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Election Readiness Score: {score}/3</Typography>
      </Box>
      <FormGroup>
        <FormControlLabel 
          control={<Checkbox checked={readiness.registered} onChange={() => handleToggle('registered')} />} 
          label={<Typography variant="body2">Registered to vote?</Typography>} 
        />
        <FormControlLabel 
          control={<Checkbox checked={readiness.hasId} onChange={() => handleToggle('hasId')} />} 
          label={<Typography variant="body2">Have valid ID ready?</Typography>} 
        />
        <FormControlLabel 
          control={<Checkbox checked={readiness.knowsBooth} onChange={() => handleToggle('knowsBooth')} />} 
          label={<Typography variant="body2">Know your polling booth?</Typography>} 
        />
      </FormGroup>
    </Paper>
  );
}
