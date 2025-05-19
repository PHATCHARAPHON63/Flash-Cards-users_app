import React from 'react';
import { Paper } from '@mui/material';

const CustomPaper = ({ children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '98%',
        boxSizing: 'border-box',
        paddingBlock: '24px',
        paddingInline: '30px'
      }}
    >
      {children} {/* ✅ รองรับเนื้อหาภายใน */}
    </Paper>
  );
};

export default CustomPaper;
