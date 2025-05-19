import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  TextField,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CloudUpload } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PiFilePngBold } from 'react-icons/pi';
import { IoEyeOutline, IoTrashOutline } from 'react-icons/io5';

import CustomButton from 'component/CustomButton';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import CustomInput from './CustomInput';
import { useEffect } from 'react';
import { time_date } from '../utils/time_date';
import { TimePicker } from '@mui/x-date-pickers';

const generateHours = () => {
  return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
};

const generateMinutes = () => {
  return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
};

const CustomAttendDialog = ({
  open = false,
  onClose = () => {},
  title = 'แก้ไขข้อมูลมาเรียน',
  initialData = {},
  onSubmit = () => {},
  disabled = false,
  leaveTypeOptions = [],
  submitButtonText = '',
  closeButtonText = '',
  sizeDialog = 'md'
}) => {
  // Leave type options
  //   const leaveTypeOptions = [
  //     { value: 'sick', label: 'ลาป่วย' },
  //     { value: 'personal', label: 'ลากิจ' },
  //     { value: 'vacation', label: 'ลาพักร้อน' }
  //   ];

  // State to manage form data
  const [formData, setFormData] = useState({
    student_id: initialData.student_id || '',
    student_name: initialData.name || '',
    class_room: initialData.class_room || '',
    class_level: initialData.class_level || '',
    date_time: initialData.date || null,
    date_time_in: initialData.date || null,
    date_time_out: initialData.date_time || null,
    time_in: initialData.time_HHMM || null,
    time_out: initialData.time_out || null
  });

  const [errors, setErrors] = useState({
    time_in: ''
  });
  // console.log('initialData', initialData);

  const formatDateWithOffset = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return null;
    return date.toISOString().replace('Z', '+00:00'); // เปลี่ยน Z เป็น +00:00
  };

  useEffect(() => {
    console.log('initialData', initialData);

    const timeIn = initialData.time_HHMM || null;
    const timeOut = initialData.time_out_HHMM || null;

    const parseTime = (dateString, timeString) => {
      if (!dateString || !timeString) return null;
      const [hours, minutes] = timeString.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return null;
      const date = new Date(dateString);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    setFormData({
      student_id: initialData.student_id || '',
      student_name: initialData.name || '',
      class_room: initialData.class_room_info?.room || '',
      class_level: initialData.class_room_info?.level || '',
      date_time: new Date(initialData.date || null),
      time_in: initialData.time_HHMM ? timeIn : null,
      time_out: initialData.time_out ? timeOut : null,
      date_time_in: formatDateWithOffset(parseTime(initialData.date, timeIn)), // แปลงเป็น ISO +00:00
      date_time_out: formatDateWithOffset(parseTime(initialData.date, timeOut)) // แปลงเป็น ISO +00:00
    });
  }, [initialData, open]);

  const resetform = () => {
    setFormData({
      student_id: '',
      student_name: '',
      class_room: '',
      class_level: '',
      date_time: null,
      date_time_in: null,
      date_time_out: null,
      time_in: null,
      time_out: null
    });
  };

  // Handle input changes
  const handleDateChange = (name) => (newValue) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: newValue };

      // ตรวจสอบว่า newValue เป็น Date หรือ String และแปลงให้เป็น Date ถ้าเป็น String
      const startDate = new Date(updatedData.startDate);
      const endDate = new Date(updatedData.endDate);

      // คำนวณจำนวนวันใหม่ ถ้าทั้ง startDate และ endDate ถูกเลือก
      if (updatedData.startDate && updatedData.endDate) {
        // ตรวจสอบว่า startDate และ endDate ไม่เป็น Invalid Date
        if (startDate.getTime() && endDate.getTime()) {
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          // คำนวณระยะห่างระหว่างวัน
          const calculatedDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24) + 1);

          return { ...updatedData, days: calculatedDays };
        }
      }

      return updatedData;
    });
  };

  const handleTimeChange = (field, newTime) => {
    console.log('newTime', newTime);

    if (newTime instanceof Date && !isNaN(newTime.getTime())) {
      const hours = newTime.getHours(); // เวลาที่เลือกใน TimePicker
      const minutes = newTime.getMinutes();
      console.log('Local Time -> hours:', hours, 'minutes:', minutes);

      // ใช้วันที่จาก `formData.date_time_in` หรือ `initialData.date`
      let currentDate = formData[field === 'time_in' ? 'date_time_in' : 'date_time_out']
        ? new Date(formData[field === 'time_in' ? 'date_time_in' : 'date_time_out'])
        : new Date(initialData.date || new Date()); // ถ้าไม่มีค่าใช้วันที่จาก initialData หรือวันที่ปัจจุบัน

      console.log('currentDate (before update)', currentDate);

      if (!isNaN(currentDate.getTime())) {
        // ตั้งเวลาใหม่ในรูปแบบ Local Time โดยตรง (ไม่ต้องเพิ่มหรือลบเวลา)
        currentDate.setHours(hours, minutes, 0, 0); // ตั้งเวลาใหม่ที่เลือกในเวลาท้องถิ่น

        console.log('updated currentDate (Local Time)', currentDate);

        // บันทึกเวลาในรูปแบบ ISO ตามเวลาท้องถิ่น
        setFormData((prev) => ({
          ...prev,
          [field]: format(newTime, 'HH:mm'), // เช่น "03:15"
          [field === 'time_in' ? 'date_time_in' : 'date_time_out']: currentDate.toISOString() // เวลาในรูปแบบ ISO จะถูกบันทึกตรงกับเวลาท้องถิ่น
        }));
        setErrors((prev) => ({
          ...prev,
          [field]: ''
        }));
      } else {
        console.error('Invalid date_time in formData');
      }
    } else {
      console.error('Invalid time value:', newTime);
    }
  };

  // Handle file delete
  const handleFileDelete = () => {
    setFormData((prev) => ({
      ...prev,
      attachments: null
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Format dates before submission
    console.log('formData', formData);
    if (formData.time_in === null || formData.time_in === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        time_in: 'กรุณาเลือกข้อมูล'
      }));
      return;
    }

    // if (formData.time_in) {
    //   const [hours, minutes] = formData.time_in.split(':').map(Number);
    //   const dateTimeIn = new Date(formData.date_time_in); // นำค่า date_time_in ที่มีอยู่ใน formData
    //   dateTimeIn.setHours(hours + 7, minutes, 0, 0); // ปรับเวลาให้ตรงกับ UTC+7

    //   // แปลงเป็นรูปแบบที่ไม่แสดง Z แต่ให้เป็นเวลาไทย +07:00
    //   let isoString = dateTimeIn.toISOString();
    //   isoString = isoString.replace('Z', '+00:00'); // แก้ไขให้เป็น +07:00 แทน Z

    //   formData.date_time_in = isoString; // บันทึกเวลาในรูปแบบ ISO ที่มี +07:00
    // }

    onSubmit(formData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={sizeDialog}>
        <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: '16px', paddingBlock: '8px' }}>
            {/* Leave Type Dropdown */}
            <CustomInput label="รหัสนักเรียน" name="student_id" value={formData.student_id} disabled />
            <CustomInput label="ชื่อ-นามสกุล" name="student_name" value={formData.student_name} disabled />
            <CustomInput label="ชั้นเรียน" name="class_level" value={formData.class_level} disabled />
            <CustomInput label="ห้องเรียน" name="class_room" value={formData.class_room} disabled />
            <DatePicker label="วันที่" value={formData.date_time} onChange={handleDateChange('date_time')} disabled format="dd/MM/yyyy" />

            {/* Number of Days */}
            {/* <FormControl fullWidth>
              <InputLabel>จำนวนวัน</InputLabel>
              <Select name="days" value={formData.days} label="จำนวนวัน" onChange={handleInputChange} disabled={disabled}>
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1} วัน
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            {/* <CustomInput name="time_in" value={formData.time_in} label="เวลาเข้า" disabled /> */}
            <Box>
              <TimePicker
                label={
                  <>
                    เวลาเข้า <span style={{ color: 'red' }}>*</span>
                  </>
                }
                slotProps={{
                  textField: {
                    InputLabelProps: { shrink: true }
                  }
                }}
                name="time_in"
                sx={{ width: '100%' }}
                value={formData.date_time_in ? new Date(formData.date_time_in) : null}
                onChange={(newTime) => handleTimeChange('time_in', newTime)} // ส่ง 'time_in' เป็น name
                disabled={disabled}
              />
              {errors.time_in && <Typography style={{ color: 'red' }}>{errors.time_in}</Typography>}
            </Box>

            <Box>
              <TimePicker
                label="เวลาออก"
                name="time_out"
                slotProps={{
                  textField: {
                    InputLabelProps: { shrink: true }
                  }
                }}
                sx={{ width: '100%' }}
                value={formData.date_time_out ? new Date(formData.date_time_out) : null}
                onChange={(newTime) => handleTimeChange('time_out', newTime)} // ส่ง 'time_out' เป็น name
                disabled={disabled}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBlock: '8px' }}>
            {/* Submit and Close Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
              <CustomButton
                variant="outlined"
                text={closeButtonText}
                onClick={() => {
                  onClose(), resetform();
                }}
                shadow={false}
                sx={{
                  color: '#3C3C3A',
                  '&:hover': { borderColor: '#47c4b1', color: 'black' },
                  width: '80px'
                }}
              />
              <CustomButton
                variant="contained"
                text={submitButtonText}
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#47c4b1',
                  '&:hover': { backgroundColor: '#3aa397' },
                  width: '80px'
                }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CustomAttendDialog;
