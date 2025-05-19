import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box } from '@mui/material';

// project imports

const performance = () => {
  return (
    <Paper elevation={0}>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
              // width: '100vw'
            }}
          >
            <Typography variant="body1" sx={{ fontSize: 30 }}>
              Coming soon........
            </Typography>
          </div>
        </Paper>
      </Box>
    </Paper>
  );
};

export default performance;
