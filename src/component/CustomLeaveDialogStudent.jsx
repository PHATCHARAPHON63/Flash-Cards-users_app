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
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CheckBox, CloudUpload } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PiFilePngBold } from 'react-icons/pi';
import { IoEyeOutline, IoTrashOutline } from 'react-icons/io5';

import CustomButton from 'component/CustomButton';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import CustomInput from './CustomInput';
import { useEffect } from 'react';
import { parseISO } from 'date-fns';
import FileIcon from './FileIcon';
import { baseUrlWithToken } from './function/register';
import ImageDialog from './ImageDialog';
import ThaiDatePicker from './ThaiDatePicker';
import moment from 'moment';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get_leave_admim_by_id } from './function/leav';
import ThaiDateTimePicker from './ThaiDateTimePicker';
import { useDebounce } from 'use-debounce';
import { filterOutSpecialCharactersAndAllowNumericSlashDashSpace } from '../utils/validate';
const CustomLeaveDialogStudent = ({
  open = false,
  onClose = () => {},
  title = 'แบบฟอร์มการลา',
  initialData = {},
  onSubmit = () => {},
  leaveTypeOptions = [],
  submitButtonText = '',
  closeButtonText = '',
  sizeDialog = 'md',
  role = 'user',
  disStudentID = false,
  disName = false,
  disType = false,
  disperiodType = false,
  disStartDate = false,
  disEndDate = false,
  disDescription = false,
  disInputImage = false,
  disClose = false,
  maxBackDays = null,
  maxDate,
  requireType = false,
  requireStartDate = false
}) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    id: initialData?._id || '',
    leaveType: initialData?.leaveType || '',
    startDate: initialData?.startDate || null,
    endDate: initialData?.endDate || null,
    days: initialData?.days || '',
    period_type: initialData?.period_type || '',
    description: initialData?.description || '',
    attachments: initialData?.attachments || null,
    name: initialData?.name || '',
    student_id: initialData?.student_id || '',
    name_image: initialData?.name_image || '',
    path_image: initialData?.path_image || '',
    status: false,
    remark: '',
    role: initialData.role || role || '',
    level: initialData.level || '',
    room: initialData.room || ''
  });

  const [errors, setErrors] = useState({
    remark: '',
    startDate: '',
    leaveType: '',
    period_type: ''
  });

  const [openImage, setOpenImage] = useState(false);
  const queryClient = useQueryClient();

  //!drag
  const [dragActive, setDragActive] = useState(false);

  const debouncedStudentId = useDebounce(formData?.student_id, 500);
  const { data, isError: isGetStudentError } = useQuery({
    queryKey: ['get_student_by_id', formData?.level, formData?.room, debouncedStudentId],
    queryFn: async () => await get_leave_admim_by_id(formData?.student_id, formData?.level, formData?.room),
    // enabled: !!formData?.student_id && !!formData?.level && !!formData?.room
    // enabled: false
    enabled: !!debouncedStudentId && !!formData?.level && !!formData?.room,
    retry: false,
    onError: (err) => {
      alert('TEST');
    }
  });

  useEffect(() => {
    if (isGetStudentError) {
      // alert('refresh');
      setFormData({
        ...formData,
        name: ''
      });
    }
  }, [isGetStudentError]);

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        name: data
      });
    }
  }, [data]);
  // console.log(data);

  useEffect(() => {
    // console.log('initialData.startDate:', initialData.date_time_start); // 👈 ต้องมีค่า
    // console.log('moment:', moment(initialData.date_time_start)); // 👈 ต้องไม่เป็น Invalid date

    const parsedStart = initialData?.date_time_start ? parseISO(initialData.date_time_start) : null;
    const parsedEnd = parseISO(initialData.date_time_end);

    if (open) {
      setFormData({
        id: initialData._id || '',
        leaveType: initialData.type || '',
        startDate: parsedStart,
        endDate: parsedEnd,
        days: initialData.days || '',
        period_type: initialData.period_type || '',
        description: initialData.description || '',
        attachments: initialData.attachments || null,
        name: initialData.name || '',
        student_id: initialData.student_id || '',
        name_image: initialData.name_image || '',
        path_image: initialData.path_image || '',
        role: initialData.role || role || '',
        level: initialData.level || '',
        room: initialData.room || ''
      });
      setErrors({
        remark: '',
        startDate: '',
        leaveType: '',
        period_type: ''
      });
    }
  }, [open]);

  console.log('formData', formData, initialData);

  const handleClose = () => {
    setFormData({ status: false });
    setErrors({});
    onClose();
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[a-zA-Z0-9ก-ฮ]*$/;
    console.log('name', name, value);

    if (name === 'remark' || name === 'description') {
      const checkedValue = filterOutSpecialCharactersAndAllowNumericSlashDashSpace(value);

      if (checkedValue) {
        setErrors((prev) => ({
          ...prev,
          [name]: ''
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: checkedValue
      }));

      return;
    }

    if (name === 'student_id' && name === 'description' && name === 'remark') {
      if (regex.test(value)) {
        console.log('if');
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
        setErrors((prev) => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
      console.log('else');
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  useEffect(() => {
    if (formData?.period_type === 'ลาครึ่งวันเช้า' || formData?.period_type === 'ลาครึ่งวันบ่าย') {
      setFormData((prev) => ({
        ...prev,
        days: 0.5,
        endDate: formData?.startDate
      }));
    }
    const start = moment(formData.startDate, 'YYYY-MM-DD', true);
    const end = moment(formData.endDate, 'YYYY-MM-DD', true);

    if (start.isValid() && end.isValid()) {
      let count = 0;
      const current = moment(start);

      while (current.isSameOrBefore(end)) {
        const day = current.day(); // 0 = อาทิตย์, 6 = เสาร์
        if (day !== 0 && day !== 6) {
          count += 1;
        }
        current.add(1, 'day');
      }

      setFormData((prev) => ({ ...prev, days: count }));
    } else {
      setFormData((prev) => ({ ...prev, days: '' }));
    }
  }, [formData?.period_type, formData?.startDate, formData.endDate]);
  const handleDateChange = (name) => (newValue) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: newValue };
      setErrors((prev) => ({ ...prev, [name]: '' }));
      return updatedData;
    });
  };

  // console.log(formData.startDate);

  // Handle file upload
  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   setFormData((prev) => ({
  //     ...prev,
  //     attachments: file
  //   }));
  // };
  const handleFileUpload = (file) => {
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      attachments: file
    }));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle file view
  const handleFileView = () => {
    if (formData.attachments) {
      // console.log('test', URL.createObjectURL(formData.attachments));
      // window.open(URL.createObjectURL(formData.attachments), '_blank');
      setOpenImage(true);

      // console.log('formData.attachments', formData.attachments);
    }
    if (formData.name_image) {
      setOpenImage(true);
    }
  };

  // Handle file delete
  const handleFileDelete = () => {
    setFormData((prev) => ({
      ...prev,
      attachments: null,
      path_image: null,
      name_image: null
    }));
  };

  // Handle form submission
  const validate = () => {
    setErrors({});
    const tempError = {};

    if (formData.status && !formData.remark) {
      // alert('ไม่สามารถแก้ไขได้');
      tempError.remark = 'กรุณากรอกข้อมูล';
    }

    // if (formData.status) {
    //   alert('ไม่สามารถแก้ไขได้');
    //   if (!formData.remark) {
    //     tempError.remark = 'กรุณากรอกข้อมูล';
    //   }
    // }
    // if (formData.role === 'admin') {
    //   alert('!role admin ไม่สามารถแก้ไขได้');
    //   if (!formData.student_id) {
    //     tempError.student_id = 'กรุณากรอกข้อมูล';
    //   }
    // }
    console.log('formData', formData.startDate);
    console.log(typeof formData.startDate);
    if (!formData?.startDate) {
      tempError.startDate = 'กรุณาเลือกข้อมูล';
    }
    if (!formData.leaveType) {
      tempError.leaveType = 'กรุณาเลือกข้อมูล';
    }
    if (!formData.period_type) {
      tempError.period_type = 'กรุณาเลือกข้อมูล';
    }

    if (Object.keys(tempError).length > 0) {
      setErrors(tempError);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    setErrors({});
    if (validate()) {
      // const formatDate = (date) => {
      //   if (!date) return null;
      //   const d = new Date(date);
      //   d.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00
      //   return d; // ส่งกลับเป็น Date
      // };

      const submissionData = {
        ...formData,
        status: !formData.status
        // startDate: formatDate(formData.startDate),
        // endDate: formatDate(formData.endDate)
      };

      console.log('submissionData', submissionData);

      onSubmit(submissionData);
    } else {
      console.log('Errors:', errors);
    }
  };

  const disableList = ['ลาครึ่งวันเช้า', 'ลาครึ่งวันบ่าย'];
  const disabledEndDate = disableList.includes(formData?.period_type);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={sizeDialog}>
        <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: '16px', paddingBlock: '8px' }}>
            {/* Leave Type Dropdown */}
            {role === 'admin' && (
              <>
                <CustomInput
                  label="รหัสนักเรียน"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  disabled={disStudentID}
                  error={errors.student_id}
                />
                <CustomInput label="ชื่อ-นามสกุล" name="name" value={formData.name} onChange={handleInputChange} disabled={disName} />
              </>
            )}
            <FormControl fullWidth>
              <InputLabel id="leave-type-label" shrink={true}>
                ประเภทการลา {requireType && <span style={{ color: 'red' }}>*</span>}
              </InputLabel>
              <Select
                labelId="leave-type-label"
                id="leave-type-select"
                name="leaveType"
                value={formData?.leaveType || ''}
                label="ประเภทการลา"
                onChange={handleInputChange}
                IconComponent={KeyboardArrowDownIcon}
                disabled={disType}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em style={{ color: '#DEE0E4' }}>เลือกประเภทการลา</em>;
                  }
                  const selectedOption = leaveTypeOptions.find((option) => option.value === selected);
                  return selectedOption ? selectedOption.label : selected;
                }}
                error={!!errors.leaveType}
              >
                {leaveTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.leaveType && <span style={{ color: 'red', fontSize: '12px' }}>{errors.leaveType}</span>}
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBlock: '8px', maxWidth: { xs: '100%', md: '65%' } }}>
            {/* Leave Period Type */}
            <RadioGroup
              name="period_type"
              value={formData?.period_type || ''}
              onChange={handleInputChange}
              row
              sx={{ display: { xs: 'block', md: 'flex' }, justifyContent: { sx: 'none', md: 'space-between' } }}
            >
              <FormControlLabel value="ลาทั้งวัน" control={<Radio />} label="ลาทั้งวัน" disabled={disperiodType} />
              <FormControlLabel value="ลาครึ่งวันเช้า" control={<Radio />} label="ลาครึ่งวันเช้า" disabled={disperiodType} />
              <FormControlLabel value="ลาครึ่งวันบ่าย" control={<Radio />} label="ลาครึ่งวันบ่าย" disabled={disperiodType} />
            </RadioGroup>
            {errors.period_type && <span style={{ color: 'red', fontSize: '12px' }}>{errors.period_type}</span>}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: '16px', paddingBlock: '8px' }}>
            {/* Start Date */}
            <ThaiDateTimePicker
              // label="วันที่เริ่มต้นการลา"
              label={<>วันที่เริ่มต้นการลา {requireStartDate && <span style={{ color: 'red' }}>*</span>}</>}
              value={moment(formData.startDate, 'YYYY-MM-DD', true).isValid() ? new Date(formData.startDate).toISOString() : ''}
              // onDateSelect={handleDateChange('startDate')}
              onDateSelect={handleDateChange('startDate')}
              disabled={disStartDate}
              disableFuture={false}
              error={errors?.startDate}
              maxBackDays={maxBackDays}
              maxDate={maxDate}
            />

            {/* End Date */}
            <ThaiDateTimePicker
              // label="วันที่สิ้นสุดการลา"
              label={<>วันที่สิ้นสุดการลา {requireStartDate && <span style={{ color: 'red' }}>*</span>}</>}
              value={moment(formData.endDate, 'YYYY-MM-DD', true).isValid() ? new Date(formData.endDate).toISOString() : ''}
              // onDateSelect={handleDateChange('endDate')}
              onDateSelect={handleDateChange('endDate')}
              disabled={disabledEndDate || disEndDate || formData.startDate === null}
              disableFuture={false}
              maxBackDays={maxBackDays}
              minDate={moment(formData.startDate, 'YYYY-MM-DD', true).isValid() ? new Date(formData.startDate).toISOString() : ''}
            />
            <CustomInput name="days" value={formData.days} label="จำนวนวัน" disabled />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBlock: '8px' }}>
            {/* Leave Description */}
            <CustomInput
              label="รายละเอียด"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={disDescription}
              multiline
              rows={3}
            />

            {/* File Upload */}
            {!disInputImage && (
              <Button
                component="label"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  paddingBlock: '8px',
                  // backgroundColor: '#EEF2F6'
                  backgroundColor: dragActive ? '#D6E4F0' : '#EEF2F6',
                  border: dragActive ? '2px dashed #007BFF' : 'none'
                }}
              >
                <CloudUpload sx={{ color: '#495057' }} />
                <input
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.pdf"
                  // onChange={handleFileUpload}
                  onChange={onInputChange}
                />
                <Typography sx={{ fontSize: '8px', fontWeight: 500, color: '#495057', lineHeight: 0.5 }}>
                  Drag file here or click to upload
                </Typography>
                <Typography sx={{ fontSize: '8px', fontWeight: 500, color: '#495057' }}>รองรับไฟล์ jpg, jpeg, png, pdf</Typography>
              </Button>
            )}
            {/* Uploaded File Display */}
            {(formData.attachments || (formData.name_image && formData.path_image)) && (
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'space-between',
                  backgroundColor: '#F5F4F3',
                  paddingBlock: '8px',
                  paddingInline: '16px',
                  borderRadius: '5px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* <PiFilePngBold size={24} /> */}
                  <FileIcon fileName={formData.attachments?.name || formData?.name_image} size={24} />
                  <Typography sx={{ fontSize: '12px', fontWeight: 400 }}>{formData.attachments?.name || formData?.name_image}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IoEyeOutline size={18} onClick={handleFileView} style={{ cursor: 'pointer' }} />
                  {!disInputImage && <IoTrashOutline size={18} onClick={handleFileDelete} style={{ cursor: 'pointer' }} />}
                </Box>
              </Box>
            )}
            {disClose && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'space-between',
                    // backgroundColor: '#F5F4F3',
                    paddingBlock: '8px',
                    paddingInline: '16px',
                    borderRadius: '5px'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.status}
                        onChange={(e) => {
                          if (formData.status) {
                            setErrors((prev) => ({ ...prev, remark: '' }));
                          }
                          setFormData({
                            ...formData,
                            status: !formData.status,
                            remark: ''
                            // status: e.target.checked ? false : true
                          });
                        }}
                      />
                    }
                    label="ยกเลิกการลา"
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBlock: '8px' }}>
                  <CustomInput
                    label="ระบุเหตุผลยกเลิกการลา"
                    name="remark"
                    required={formData.status}
                    value={formData.remark}
                    onChange={handleInputChange}
                    error={errors?.remark}
                    disabled={!formData.status}
                  />
                </Box>
              </>
            )}

            {/* Submit and Close Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
              <CustomButton
                variant="outlined"
                text={closeButtonText}
                onClick={handleClose}
                shadow={false}
                sx={{
                  color: '#3C3C3A',
                  '&:hover': { borderColor: '#47c4b1', color: 'black' },
                  width: '80px'
                }}
              />
              {submitButtonText && (
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
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <ImageDialog
        open={openImage}
        onClose={() => setOpenImage(false)}
        url={formData.attachments instanceof File ? formData.attachments : formData.path_image}
        fileName={formData.attachments instanceof File ? formData.attachments.name : formData.name_image}
        title_view={'เอกสารประกอบการลา'}
      />
    </LocalizationProvider>
  );
};

export default CustomLeaveDialogStudent;
