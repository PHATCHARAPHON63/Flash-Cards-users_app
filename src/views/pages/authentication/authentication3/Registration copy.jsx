import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../../../component/function/register';
// material-ui
import {
  Grid,
  Typography,
  AppBar,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  InputLabel,
  LinearProgress,
  FormHelperText,
  Dialog,
  DialogContent,
  Popover,
  IconButton,
  InputAdornment
} from '@mui/material';
// project imports
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AuthWrapper1 from '../AuthWrapper1';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// ฟังก์ชันตรวจสอบความถูกต้องของรหัสผ่าน
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  return {
    isValid: Object.values(requirements).every((req) => req),
    requirements
  };
};

const Registration = () => {
  return (
    <AuthWrapper1 style={{ backgroundColor: '#FFFFFF' }}>
      <Grid container sx={{ width: '100vw', minHeight: '100vh', position: 'relative', paddingBottom: '80px' }}>
        <Grid container spacing={0} justifyContent="center">
          <Grid item xs={12} sm={12} md={7} lg={12} sx={{ background: '#FFFFFF' }}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" sx={{ alignItems: 'center', p: 2, background: '#05255B' }} color="secondary">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                  <Typography variant="h5" component="div" sx={{ color: '#FFFFFF' }}>
                    Safety Center Registration
                  </Typography>
                  <Typography variant="h5" component="div" sx={{ color: '#FFFFFF' }}>
                    แบบฟอร์มสมัครสมาชิกระบบการศึกษารูปแบบการบริหารความสุขและความปลอดภัย
                  </Typography>
                </Box>
              </AppBar>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Registration;
