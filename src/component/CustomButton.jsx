import { Button } from '@mui/material';
import React from 'react';

const CustomButton = ({ text, onClick, startIcon, shadow = true, variant = 'contained', sx = {}, ...props }) => {
  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      sx={{
        backgroundColor: variant === 'contained' ? '#64C4B6' : 'transparent',
        '&:hover': { backgroundColor: '#42B3A2FF' },
        padding: '8px 16px',
        boxShadow: shadow ? 1 : 'none', // Removes the box shadow
        borderColor: '#64C4B6',
        ...sx
      }}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
