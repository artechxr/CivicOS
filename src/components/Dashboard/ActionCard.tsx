'use client';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  delay?: number;
  href?: string;
  onClick?: () => void;
}

export default function ActionCard({ title, subtitle, icon, delay = 0, href, onClick }: ActionCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card sx={{ height: 'auto', borderRadius: 3 }}>
        <CardActionArea 
          sx={{ height: '100%', p: 0.5 }}
          onClick={handleClick}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left', gap: 2, p: '12px !important' }}>
            <Box sx={{ 
              display: 'flex',
              p: 1.2,
              borderRadius: '10px',
              backgroundColor: 'rgba(0,0,0,0.03)',
            }}>
              {icon}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}
