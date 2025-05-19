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
  // ประกาศ state ทั้งหมด
  const navigate = useNavigate();
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPasswordPopover, setShowPasswordPopover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFieldRef, setPasswordFieldRef] = useState(null);

  // Dialog states
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isEmailErrorDialogOpen, setIsEmailErrorDialogOpen] = useState(false);
  const [isPhoneErrorDialogOpen, setIsPhoneErrorDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // ข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: '',
    first_name: '',
    last_name: '',
    id_card: '',
    birth_date: null,
    gender: '',
    phone_number: '',
    email: '',
    user_type: '',
    password: '',
    confirmPassword: '',
    gen_id: generateRandomId()
  });

  // สร้าง gen_id เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (!formData.gen_id) {
      setFormData((prev) => ({
        ...prev,
        gen_id: generateRandomId()
      }));
    }
  }, []);

  // สร้าง gen_id แบบสุ่ม
  function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 20;
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  // ฟังก์ชันตรวจสอบภาษาไทย
  const isValidThai = (text) => {
    const thaiRegex = /^[\u0E00-\u0E7F\s]*$/;
    return thaiRegex.test(text);
  };

  // ฟังก์ชันตรวจสอบเลขบัตรประชาชน
  const validateThaiID = (id) => {
    // ลบเครื่องหมาย - ออกก่อนตรวจสอบ
    const cleanId = id.replace(/-/g, '');

    if (!cleanId) return false;
    if (cleanId.length !== 13 || !/^\d{13}$/.test(cleanId)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanId.charAt(i)) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(cleanId.charAt(12));
  };

  // ฟังก์ชันตรวจสอบความแข็งแรงของรหัสผ่าน
  const checkPasswordStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return criteria;
  };

  // คำนวณความแข็งแรงของรหัสผ่าน
  const calculatePasswordStrength = (password) => {
    let score = 0;
    let level = '';
    let color = '';

    if (password.length >= 8) score += 25;
    if (/(?=.*[a-z])/.test(password)) score += 15;
    if (/(?=.*[A-Z])/.test(password)) score += 15;
    if (/(?=.*[0-9])/.test(password)) score += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

    if (score >= 100) {
      level = 'ความปลอดภัยสูงมาก';
      color = '#2E7D32';
    } else if (score >= 80) {
      level = 'ความปลอดภัยสูง';
      color = '#4CAF50';
    } else if (score >= 60) {
      level = 'ความปลอดภัยปานกลาง';
      color = '#FFA726';
    } else if (score >= 30) {
      level = 'ความปลอดภัยต่ำ';
      color = '#F57C00';
    } else {
      level = 'ความปลอดภัยต่ำมาก';
      color = '#D32F2F';
    }

    return { score, level, color };
  };

  // จัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (name, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // จัดการการเปลี่ยนแปลงรหัสผ่าน
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({
      ...prev,
      password: null
    }));
    setPasswordFieldRef(event.currentTarget);
  };

  // จัดการการเปลี่ยนแปลงข้อมูลทั่วไป
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setFormData({
      title: '',
      first_name: '',
      last_name: '',
      id_card: '',
      birth_date: null,
      gender: '',
      phone_number: '',
      email: '',
      user_type: '',
      password: '',
      confirmPassword: '',
      gen_id: generateRandomId()
    });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
  };

  // นำทางกลับหน้าหลัก
  const handleBackToHome = () => {
    navigate('/Login');
  };

  // ปิด dialog แสดงผลสำเร็จ
  const handleDialogClose = () => {
    setIsSuccessDialogOpen(false);
    setIsEmailErrorDialogOpen(false);
    setIsPhoneErrorDialogOpen(false);
    navigate('/Login');
  };

  const calculateExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = {};
    let isValid = true;
    setIsSubmitted(true);
    setSubmissionAttempted(true);

    console.log('เริ่มการตรวจสอบแบบฟอร์ม...');

    // ตรวจสอบฟิลด์ที่จำเป็น
    const requiredFields = ['title', 'first_name', 'last_name', 'phone_number', 'email', 'user_type', 'password', 'confirmPassword'];

    console.log('กำลังตรวจสอบฟิลด์ที่จำเป็น...');
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'กรุณากรอกข้อมูลในช่องนี้';
        isValid = false;
        console.log(`🔴 ฟิลด์ ${field} ไม่ได้กรอกข้อมูล`);
      } else {
        console.log(`✅ ฟิลด์ ${field} ผ่านการตรวจสอบข้อมูลที่จำเป็น`);
      }
    });

    // ตรวจสอบความถูกต้องของข้อมูล
    console.log('\nกำลังตรวจสอบความถูกต้องของข้อมูล...');

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      isValid = false;
      console.log('🔴 รูปแบบอีเมลไม่ถูกต้อง');
    } else {
      console.log('✅ รูปแบบอีเมลถูกต้อง');
    }

    // เพิ่มการตรวจสอบเบอร์โทร
    const phoneRegex = /^([0-9]{3})-([0-9]{3})-([0-9]{4})$/;
    const cleanedPhoneNumber = formData.phone_number.replace(/\D/g, '');

    if (formData.phone_number && !phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = 'รูปแบบเบอร์โทรไม่ถูกต้อง (xxx-xxx-xxxx)';
      isValid = false;
      console.log('🔴 รูปแบบเบอร์โทรไม่ถูกต้อง');
    } else if (cleanedPhoneNumber && cleanedPhoneNumber.length !== 10) {
      newErrors.phone_number = 'เบอร์โทรต้องมี 10 หลัก';
      isValid = false;
      console.log('🔴 เบอร์โทรไม่ครบ 10 หลัก');
    } else if (cleanedPhoneNumber && !['06', '08', '09'].includes(cleanedPhoneNumber.substring(0, 2))) {
      newErrors.phone_number = 'เบอร์โทรต้องขึ้นต้นด้วย 06, 08 หรือ 09';
      isValid = false;
      console.log('🔴 เบอร์โทรไม่ได้ขึ้นต้นด้วย 06, 08 หรือ 09');
    } else {
      console.log('✅ เบอร์โทรถูกต้อง');
    }

    // ตรวจสอบรหัสผ่าน
    if (formData.password) {
      const { isValid: isPasswordValid, requirements: passwordErrors } = validatePassword(formData.password);
      if (!isPasswordValid) {
        newErrors.password = 'รหัสผ่านไม่ตรงตามข้อกำหนด';
        isValid = false;
        console.log('🔴 รหัสผ่านไม่ตรงตามข้อกำหนด:', passwordErrors);
      } else {
        console.log('✅ รหัสผ่านถูกต้องตามข้อกำหนด');
      }
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
      isValid = false;
      console.log('🔴 รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
    } else {
      console.log('✅ รหัสผ่านและการยืนยันรหัสผ่านตรงกัน');
    }

    setErrors(newErrors);

    if (!isValid) {
      console.log('\n❌ พบข้อผิดพลาดในการตรวจสอบ:', newErrors);
      return;
    }

    console.log('\n✅ การตรวจสอบทั้งหมดผ่าน กำลังดำเนินการส่งข้อมูล...');

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // เตรียมข้อมูลสำหรับส่งไป API
      const dataToSend = {
        prefix: formData.title,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number.replace(/-/g, ''), // ลบเครื่องหมาย - ออก
        role: mapUserTypeToRole(formData.user_type), // แปลงประเภทผู้ใช้งานเป็น role ที่ถูกต้อง
        status_user: 'active', // กำหนดค่าเริ่มต้น
        gen_id: formData.gen_id, // ใช้ gen_id ที่สร้างไว้แล้ว
        google_id: '', // ค่าเริ่มต้นเป็นสตริงว่าง
        reset_password_token: '',
        reset_password_auth_tag: '',
        reset_password_expires: '',
        time_stamps_mail: Date.now().toString(),
        count_mail: '0',
        profile_image: '',
        login_attempts: 0
      };

      // เรียกใช้ API register
      const response = await register(dataToSend);

      console.log('ตอบกลับจาก API:', response);

      if (response && response.message === 'ลงทะเบียนสำเร็จ') {
        setIsSuccessDialogOpen(true);
        resetForm();
      } else {
        // จัดการกรณี response ที่ไม่ได้คาดหวัง
        setSubmitError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('ข้อผิดพลาดจาก API:', error);

      // จัดการข้อผิดพลาดที่เกิดจาก API
      if (error.message && error.message.includes('อีเมลนี้มีผู้ใช้งานในระบบแล้ว')) {
        setIsEmailErrorDialogOpen(true);
      } else if (error.message && error.message.includes('เบอร์โทรศัพท์นี้มีผู้ใช้งานในระบบแล้ว')) {
        setIsPhoneErrorDialogOpen(true);
      } else {
        setSubmitError(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันช่วยแปลงประเภทผู้ใช้งานเป็น role ที่ใช้ใน API
  const mapUserTypeToRole = (userType) => {
    switch (userType) {
      case 'คุณครู/บุคลากรทางการศึกษา':
        return 'teacher';
      case 'นักเรียน':
        return 'student';
      case 'บุคคลทั่วไป':
        return 'user';
      default:
        return 'user'; // ค่าเริ่มต้น
    }
  };

  // คุณสมบัติทั่วไปสำหรับ TextField
  const commonTextFieldProps = {
    fullWidth: true,
    onChange: handleChange,
    variant: 'outlined',
    InputLabelProps: {
      shrink: true,
      sx: {
        backgroundColor: 'white',
        padding: '0 6px',
        marginLeft: '1px',
        color: '#000000',
        '&.Mui-focused': { color: 'inherit' },
        fontSize: 16,
        '& .required-star': {
          color: '#FF0000',
          marginLeft: '2px',
          fontSize: 16,
          fontWeight: 700
        }
      }
    }
  };

  return (
    <AuthWrapper1 style={{ backgroundColor: '#FFFFFF' }}>
      <Grid container sx={{ width: '100vw', minHeight: '100vh', position: 'relative', paddingBottom: '80px' }}>
        <Grid container spacing={0} justifyContent="center">
          <Grid item xs={12} sm={12} md={7} lg={12} sx={{ background: '#FFFFFF' }}>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" sx={{ alignItems: 'center', p: 2, background: '#05255B' }} color="secondary">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                  <Typography variant="h5" component="div" sx={{ color: '#FFFFFF' }}>
                    Flash Cards Registration
                  </Typography>
                </Box>
              </AppBar>
            </Box>

            <Grid container mt={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Grid item xs={10}>
                {/* แสดงข้อผิดพลาดรวม */}
                {submitError && (
                  <Box sx={{ backgroundColor: '#FFEBEE', padding: 2, marginBottom: 2, borderRadius: 1 }}>
                    <Typography color="error">{submitError}</Typography>
                  </Box>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1 // spacing ระหว่าง icon กับข้อความ
                        }}
                      >
                        <PersonIcon />
                        <span
                          style={{
                            color: 'black',
                            fontSize: 16,
                            fontWeight: 700
                          }}
                        >
                          ข้อมูลส่วนตัว
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%', height: '2px', backgroundColor: '#000000' }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth variant="outlined" error={!!errors.title}>
                        <InputLabel
                          id="title"
                          shrink={true}
                          sx={{
                            color: errors.title ? 'red' : '#000000',
                            fontSize: 16,
                            '&.Mui-focused': { color: 'inherit' },
                            backgroundColor: 'white',
                            padding: '0 6px',
                            marginLeft: '1px'
                          }}
                        >
                          <span style={{ display: 'flex', fontSize: 18 }}>
                            คำนำหน้าชื่อ <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700, wordWrap: 'break-word' }}> *</span>
                          </span>
                        </InputLabel>
                        <Select
                          labelId="title"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={(e) => {
                            handleChange(e);
                            if (errors.title) {
                              setErrors((prev) => ({ ...prev, title: null }));
                            }
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#757575', fontSize: 14 }}>กรุณาเลือกคำนำหน้า</span>;
                            }
                            return selected;
                          }}
                          sx={{
                            '& .MuiSelect-icon': {
                              color: '#B9B7B7'
                            }
                          }}
                        >
                          <MenuItem value="นาย">นาย</MenuItem>
                          <MenuItem value="นาง">นาง</MenuItem>
                          <MenuItem value="นางสาว">นางสาว</MenuItem>
                          <MenuItem value="เด็กชาย">เด็กชาย</MenuItem>
                          <MenuItem value="เด็กหญิง">เด็กหญิง</MenuItem>
                        </Select>
                        {errors.title && <FormHelperText error>{errors.title}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        {...commonTextFieldProps}
                        name="first_name"
                        value={formData.first_name}
                        label={
                          <span style={{ display: 'flex' }}>
                            <span style={{ color: '#000000' }}>ระบุชื่อ</span>
                            <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700 }}>*</span>
                          </span>
                        }
                        placeholder="กรุณาระบุชื่อ"
                        error={!!errors.first_name}
                        helperText={errors.first_name}
                        onKeyPress={(event) => {
                          const thaiRegex = /^[\u0E00-\u0E7Fa-zA-Z\s]*$/;
                          if (!thaiRegex.test(event.key) || event.key === ' ') {
                            event.preventDefault();
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: errors.first_name ? 'red' : '#B9B7B7'
                            },
                            '&:hover fieldset': {
                              borderColor: errors.first_name ? 'red' : '#B9B7B7'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.first_name ? 'red' : '#B9B7B7'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#757575'
                          },
                          '& input::placeholder': {
                            color: '#757575',
                            fontSize: '14px',
                            opacity: 1
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        {...commonTextFieldProps}
                        name="last_name"
                        value={formData.last_name}
                        label={
                          <span style={{ display: 'flex' }}>
                            <span style={{ color: '#000000' }}>ระบุนามสกุล</span>
                            <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700 }}> *</span>
                          </span>
                        }
                        placeholder="กรุณาระบุนามสกุล"
                        error={!!errors.last_name}
                        helperText={errors.last_name}
                        onKeyPress={(event) => {
                          const thaiRegex = /^[\u0E00-\u0E7Fa-zA-Z\s]*$/;
                          if (!thaiRegex.test(event.key) || event.key === ' ') {
                            event.preventDefault();
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: errors.last_name ? 'red' : '#B9B7B7'
                            },
                            '&:hover fieldset': {
                              borderColor: errors.last_name ? 'red' : '#B9B7B7'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.last_name ? 'red' : '#B9B7B7'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#757575'
                          },
                          '& input::placeholder': {
                            color: '#757575',
                            fontSize: '14px',
                            opacity: 1
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        {...commonTextFieldProps}
                        name="email"
                        value={formData.email}
                        label={
                          <span style={{ display: 'flex' }}>
                            <span style={{ color: '#000000' }}>อีเมล</span>
                            <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700 }}> *</span>
                          </span>
                        }
                        placeholder="กรุณากรอกอีเมล"
                        error={!!errors.email}
                        helperText={errors.email}
                        inputProps={{
                          onKeyDown: (event) => {
                            if (event.key === ' ') {
                              event.preventDefault();
                            }
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: errors.email ? 'red' : '#B9B7B7'
                            },
                            '&:hover fieldset': {
                              borderColor: errors.email ? 'red' : '#B9B7B7'
                            },
                            '&.Mui-focused fieldset': { borderColor: errors.email ? 'red' : '#B9B7B7' },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.email ? 'red' : '#B9B7B7'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#757575'
                          },
                          '& input::placeholder': {
                            color: '#757575',
                            fontSize: '14px',
                            opacity: 1
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        {...commonTextFieldProps}
                        name="phone_number"
                        value={formData.phone_number}
                        label={
                          <span style={{ display: 'flex' }}>
                            <span style={{ color: '#000000' }}>เบอร์โทรศัพท์</span>
                            <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700 }}> *</span>
                          </span>
                        }
                        placeholder="xxx-xxx-xxxx"
                        error={!!errors.phone_number}
                        helperText={errors.phone_number}
                        inputProps={{
                          maxLength: 12
                        }}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key) || event.key === ' ') {
                            event.preventDefault();
                          }
                        }}
                        // แก้ไขส่วน handleChange สำหรับ phone_number
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const numericValue = value.replace(/[^0-9]/g, '');

                          let formattedValue = '';
                          if (numericValue.length > 0) {
                            // จัดรูปแบบ xxx-xxx-xxxx
                            const parts = [];
                            if (numericValue.length > 0) parts.push(numericValue.slice(0, 3));
                            if (numericValue.length > 3) parts.push(numericValue.slice(3, 6));
                            if (numericValue.length > 6) parts.push(numericValue.slice(6, 10));

                            formattedValue = parts.join('-');
                          }
                          setErrors((prev) => ({
                            ...prev,
                            phone_number: null
                          }));
                          setFormData((prev) => ({
                            ...prev,
                            [name]: formattedValue
                          }));
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: errors.phone_number ? 'red' : '#B9B7B7'
                            },
                            '&:hover fieldset': {
                              borderColor: errors.phone_number ? 'red' : '#B9B7B7'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.phone_number ? 'red' : '#B9B7B7'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#757575'
                          },
                          '& input::placeholder': {
                            color: '#757575',
                            fontSize: '14px',
                            opacity: 1
                          }
                        }}
                      />
                    </Grid>

                    {/* User Type Select */}
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth variant="outlined" error={!!errors.user_type}>
                        <InputLabel
                          id="user_type"
                          shrink={true}
                          sx={{
                            color: errors.user_type ? 'red' : '#000000',
                            fontSize: 16,
                            '&.Mui-focused': { color: 'inherit' },
                            backgroundColor: 'white',
                            padding: '0 6px',
                            marginLeft: '1px'
                          }}
                        >
                          <span style={{ display: 'flex' }}>
                            ประเภทผู้ใช้งาน{' '}
                            <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700, wordWrap: 'break-word' }}> *</span>
                          </span>
                        </InputLabel>
                        <Select
                          labelId="user_type"
                          id="user_type"
                          name="user_type"
                          value={formData.user_type}
                          onChange={(e) => {
                            handleChange(e);
                            if (errors.user_type) {
                              setErrors((prev) => ({ ...prev, user_type: null }));
                            }
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#757575', fontSize: 14 }}>กรุณาเลือกประเภทผู้ใช้งาน</span>;
                            }
                            return selected;
                          }}
                          sx={{
                            '& .MuiSelect-icon': {
                              color: '#B9B7B7'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: errors.user_type ? 'red' : '#B9B7B7'
                            }
                          }}
                        >
                          <MenuItem value="คุณครู/บุคลากรทางการศึกษา">คุณครู/บุคลากรทางการศึกษา</MenuItem>
                          <MenuItem value="นักเรียน">นักเรียน</MenuItem>
                          <MenuItem value="บุคคลทั่วไป">บุคคลทั่วไป</MenuItem>
                        </Select>
                        {errors.user_type && <FormHelperText error>{errors.user_type}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1 // spacing ระหว่าง icon กับข้อความ
                        }}
                      >
                        <LockPersonIcon />
                        <span
                          style={{
                            color: 'black',
                            fontSize: 16,
                            fontWeight: 700
                          }}
                        >
                          ข้อมูลการเข้าสู่ระบบ
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%', height: '2px', backgroundColor: '#000000' }} />
                    </Grid>

                    <Grid item xs={12} sm={12} mt={1}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          label={
                            <span style={{ display: 'flex' }}>
                              <span style={{ color: '#000000', fontSize: 16 }}>รหัสผ่าน</span>
                              <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700 }}> *</span>
                            </span>
                          }
                          placeholder="กรุณากรอกรหัสผ่าน"
                          value={formData.password}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            setFormData((prev) => ({
                              ...prev,
                              [name]: value
                            }));
                            setErrors((prev) => ({
                              ...prev,
                              password: null
                            }));
                            if (!passwordFieldRef) {
                              setPasswordFieldRef(e.currentTarget);
                            }
                          }}
                          onFocus={() => setShowPasswordPopover(true)}
                          onBlur={() => setShowPasswordPopover(false)}
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  onMouseDown={(e) => e.preventDefault()}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: errors.password ? 'red' : '#B9B7B7'
                              },
                              '&:hover fieldset': {
                                borderColor: errors.password ? 'red' : '#B9B7B7'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: errors.password ? 'red' : '#B9B7B7'
                              }
                            },
                            '& input::placeholder': {
                              color: '#757575',
                              fontSize: '14px',
                              opacity: 1
                            }
                          }}
                        />

                        <Popover
                          open={showPasswordPopover && !!passwordFieldRef && formData.password.length > 0}
                          anchorEl={passwordFieldRef}
                          onClose={() => setShowPasswordPopover(false)}
                          disableRestoreFocus
                          disableAutoFocus
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                          }}
                          sx={{
                            '& .MuiPopover-paper': {
                              padding: 2,
                              maxWidth: 300,
                              pointerEvents: 'none'
                            }
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ความปลอดภัยของรหัสผ่าน
                          </Typography>
                          {formData.password && (
                            <>
                              <Box sx={{ width: '100%', mb: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculatePasswordStrength(formData.password).score}
                                  sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: calculatePasswordStrength(formData.password).color,
                                      borderRadius: 5
                                    }
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 0.5,
                                    color: calculatePasswordStrength(formData.password).color,
                                    textAlign: 'right',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {calculatePasswordStrength(formData.password).level}
                                </Typography>
                              </Box>

                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                รหัสผ่านที่ต้องมี:
                              </Typography>
                            </>
                          )}
                          {Object.entries(checkPasswordStrength(formData.password)).map(([criterion, isPassed]) => (
                            <Box key={criterion} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              {isPassed ? (
                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                              ) : (
                                <CancelOutlinedIcon color="error" fontSize="small" />
                              )}
                              <Typography>
                                {criterion === 'length' && '8 ตัวอักษรหรือมากกว่า'}
                                {criterion === 'upperLower' && 'ตัวอักษรภาษาอังกฤษพิมพ์เล็กและพิมพ์ใหญ่'}
                                {criterion === 'number' && 'ตัวเลขอย่างน้อย 1 หมายเลข'}
                                {criterion === 'special' && 'อักขระพิเศษอย่างน้อย 1 ตัว'}
                              </Typography>
                            </Box>
                          ))}
                        </Popover>
                      </Grid>

                      <Grid item xs={12} sm={12} mt={3}>
                        <TextField
                          fullWidth
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          label={
                            <span style={{ display: 'flex' }}>
                              <span style={{ color: '#000000' }}>ยืนยันรหัสผ่าน</span>
                              <span style={{ color: '#FF0000', fontSize: 16, fontWeight: 700 }}> *</span>
                            </span>
                          }
                          placeholder="กรุณายืนยันรหัสผ่าน"
                          value={formData.confirmPassword}
                          onChange={handlePasswordChange}
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle confirm password visibility"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  onMouseDown={(e) => e.preventDefault()}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: errors.confirmPassword ? 'red' : '#B9B7B7'
                              },
                              '&:hover fieldset': {
                                borderColor: errors.confirmPassword ? 'red' : '#B9B7B7'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: errors.confirmPassword ? 'red' : '#B9B7B7'
                              }
                            },
                            '& input::placeholder': {
                              color: '#757575',
                              fontSize: '14px',
                              opacity: 1
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 12 }}>
                      {/* เพิ่ม mb: 12 เพื่อให้ห่างจาก footer */}
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          onClick={handleBackToHome}
                          sx={{
                            padding: '6px 12px',
                            width: 'auto',
                            height: 'auto',
                            minWidth: 'min-content',
                            color: '#05255B',
                            borderColor: '#05255B',
                            '&:hover': {
                              borderColor: '#05255B'
                            }
                          }}
                        >
                          กลับหน้าหลัก
                        </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          type="submit"
                          disabled={isSubmitting}
                          sx={{
                            padding: '6px 12px',
                            width: 'auto',
                            height: 'auto',
                            minWidth: 'min-content',
                            backgroundColor: '#05255B',
                            '&.Mui-disabled': {
                              backgroundColor: '#7B93B8',
                              color: '#FFFFFF'
                            }
                          }}
                        >
                          {isSubmitting ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>

            {/* Dialog สำเร็จ */}
            <Dialog
              open={isSuccessDialogOpen}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent sx={{ textAlign: 'center', p: 3 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 70, color: 'green', mb: 2 }} />
                <Typography id="alert-dialog-title" sx={{ fontSize: 16, color: '#05255B', mb: 2 }}>
                  ขอบคุณที่ให้ความสนใจในการสมัครเพื่อใช้บริการ
                </Typography>
                <Typography id="alert-dialog-description" sx={{ fontSize: 16, color: '#05255B', mb: 2 }}>
                  การลงทะเบียนเสร็จสมบูรณ์ คุณสามารถเข้าสู่ระบบได้ทันที
                </Typography>
                <Button
                  onClick={handleDialogClose}
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 4,
                    backgroundColor: '#FFFFFF',
                    color: '#05255B',
                    border: '1px solid #05255B',
                    boxShadow: 'none',
                    width: '80px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: 'none'
                    },
                    '&:focus': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  ตกลง
                </Button>
              </DialogContent>
            </Dialog>

            {/* Dialog อีเมลซ้ำ */}
            <Dialog
              open={isEmailErrorDialogOpen}
              onClick={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="sm"
              PaperProps={{
                sx: {
                  width: '500px',
                  maxHeight: '230px',
                  margin: '20px',
                  borderRadius: '8px'
                }
              }}
            >
              <DialogContent sx={{ textAlign: 'center', p: 3 }}>
                <HighlightOffIcon sx={{ fontSize: 70, color: 'red', mb: 2 }} />
                <Typography id="alert-dialog-description" sx={{ fontSize: 16, color: '#05255B', mb: 2 }}>
                  ไม่สามารถสมัครสมาชิกได้ เนื่องจากมีอีเมลนี้ในระบบแล้ว
                </Typography>

                <Button
                  onClick={handleDialogClose}
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 4,
                    backgroundColor: '#FFFFFF',
                    color: '#05255B',
                    border: '1px solid #05255B',
                    boxShadow: 'none',
                    width: '80px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: 'none'
                    },
                    '&:focus': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  ตกลง
                </Button>
              </DialogContent>
            </Dialog>

            {/* Dialog เบอร์โทรซ้ำ */}
            <Dialog
              open={isPhoneErrorDialogOpen}
              onClick={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="sm"
              PaperProps={{
                sx: {
                  width: '500px',
                  maxHeight: '230px',
                  margin: '20px',
                  borderRadius: '8px'
                }
              }}
            >
              <DialogContent sx={{ textAlign: 'center', p: 3 }}>
                <HighlightOffIcon sx={{ fontSize: 70, color: 'red', mb: 2 }} />
                <Typography id="alert-dialog-description" sx={{ fontSize: 16, color: '#05255B', mb: 2 }}>
                  ไม่สามารถสมัครสมาชิกได้ เนื่องจากมีเบอร์โทรศัพท์นี้ในระบบแล้ว
                </Typography>

                <Button
                  onClick={handleDialogClose}
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 4,
                    backgroundColor: '#FFFFFF',
                    color: '#05255B',
                    border: '1px solid #05255B',
                    boxShadow: 'none',
                    width: '80px',
                    height: '40px',
                    '&:hover': {
                      backgroundColor: '#FFFFFF',
                      boxShadow: 'none'
                    },
                    '&:focus': {
                      boxShadow: 'none'
                    }
                  }}
                >
                  ตกลง
                </Button>
              </DialogContent>
            </Dialog>

            {/* <Box
              component="footer"
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: '20px 0',
                backgroundColor: '#FFFFFF',
                boxShadow: 'none',
                border: 'none',
                borderTop: 'none',
                borderTop: '1px solid #e0e0e0',
                '&::before': {
                  display: 'none' // ป้องกันหากมี pseudo-element ที่สร้างเส้นแบ่ง
                },
                '&::after': {
                  display: 'none' // ป้องกันหากมี pseudo-element ที่สร้างเส้นแบ่ง
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                &copy; 2025 COPYRIGHT{' '}
                <a
                  href="https://www.tlogical.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none'
                  }}
                >
                  THANATHAM EDUCATION CO.,LTD.
                </a>
              </Typography>
            </Box> */}
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Registration;
