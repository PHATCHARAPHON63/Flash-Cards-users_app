// CookieConsent.js
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Button, Typography, IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check if the user has already consented to cookies
    const cookieConsent = Cookies.get('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set a First-Party cookie for consent
    Cookies.set('cookieConsent', 'true', { expires: 365 });
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Remove the cookie if the user does not consent
    Cookies.remove('cookieConsent');
    setIsVisible(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return isVisible ? (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: isCollapsed ? '60px' : '260px',
        bgcolor: 'white',
        p: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        textAlign: 'center',
        zIndex: 1300,
        opacity: 0.9, // Set transparency
      }}
    >
      {/* Icon Buttons in the Top-Right */}
      <Box sx={{ position: 'absolute', top: 4, left: 4, display: 'flex', gap: 0.5 }}>
  <IconButton
    size="small"
    onClick={toggleCollapse}
    sx={{
      padding: 0,
      border: '1px solid #ddd', // Adds a border around the icon button
      borderRadius: '4px', // Adjusts the border radius
      '&:hover': {
        borderColor: '#1976d2', // Changes border color on hover
      }
    }}
  >
    <RemoveIcon fontSize="small" />
  </IconButton>
</Box>

      {!isCollapsed && (
        <>
          <Typography variant="body2" sx={{ mt:1 ,mb: 1, fontSize: '0.8rem' }}>
            We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the cookies.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleAccept} 
            color="primary" 
            size="small" 
            sx={{ mr: 1, fontSize: '0.7rem', padding: '4px 8px' }}
          >
            Accept
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleDecline} 
            color="secondary" 
            size="small" 
            sx={{ fontSize: '0.7rem', padding: '4px 8px' }}
          >
            Deny
          </Button>
        </>
      )}
    </Box>
  ) : null;
};

export default CookieConsent;
