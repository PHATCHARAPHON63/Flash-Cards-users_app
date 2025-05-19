import { Box, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import { IoCloseOutline } from 'react-icons/io5';
import CustomSelectOptions from './CustomSelectOptions';
import { width } from '@mui/system';
import { get_buddies_era_this_year_and_next_year_select_options, getBePreviousYearUtilNextYearOptions } from '../utils/date_time';
import {
  get_room_by_level,
  getAllClassRoomOptions,
  getClassRoomYearSemesterLevelRoom,
  levelUpAllStudentInRoom,
  levelUpSingleStudent
} from './function/register';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import { levels } from '../utils/levels';
import { sliceText } from '../utils/format_text';

const CustomConfirmDialog = ({
  title,
  text = '',
  open = false,
  onClose = () => {},
  onConfirm = () => {},
  loading = false,
  confirmText = 'บันทึก'
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>{text}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '30px' }}>
          <CustomButton
            variant="outlined"
            text="ยกเลิก"
            onClick={onClose}
            shadow={false}
            sx={{ color: '#3C3C3A', fontWeight: 300, '&:hover': { borderColor: '#47c4b1', color: 'black' } }}
          />
          <CustomButton text={confirmText} onClick={onConfirm} shadow={false} disabled={loading} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const CustomAlertDialog = ({ title, text = '', buttonText = 'ตกลง', open = false, onClose = () => {} }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: '20px', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>{text}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px' }}>
          <CustomButton text={buttonText} onClick={onClose} shadow={false} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const CustomOneInputDialog = ({
  open,
  onClose = () => {},
  title = '',
  lable = '',
  topText = '',
  onConfirm = () => {},
  onChange = () => {},
  value = '',
  error = ''
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', textAlign: 'center' }}>
          {topText && <Typography sx={{ fontSize: '16px', fontWeight: 400 }}>{topText}</Typography>}
          <CustomInput label={lable} rows={2} onChange={onChange} value={value} error={error} required />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '30px' }}>
          <CustomButton
            variant="outlined"
            text="ยกเลิก"
            onClick={onClose}
            shadow={false}
            sx={{ color: '#3C3C3A', fontWeight: 300, '&:hover': { borderColor: '#47c4b1', color: 'black' }, width: '107px' }}
          />
          <CustomButton text="บันทึก" onClick={onConfirm} shadow={false} sx={{ width: '107px' }} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const UploadImageZipDialog = ({ open = false, onClose = () => {}, data = {} }) => {
  if (data) console.log('data', data);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }}>
        <IconButton onClick={onClose}>
          <IoCloseOutline />
        </IconButton>
      </Box>
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700, marginTop: '-35px' }}>รายละเอียด</DialogTitle>
      <DialogContent sx={{ minHeight: '200px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography>จำนวนที่อัปโหลด {data?.totalFiles || 0} รายการ</Typography>
          <Typography>สำเร็จ {data?.successCount || 0} รายการ</Typography>
          {data?.failCount > 0 && <Typography sx={{ color: 'red' }}>ไม่สำเร็จ {data?.failCount} รายการ</Typography>}
        </Box>

        {/* Fail file */}
        {data?.failedFiles && data?.failedFiles.length > 0 && (
          <Box sx={{ paddingBlock: '24px' }}>
            {/* Header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: '1px solid #B0B0B080',
                paddingBottom: '3px'
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>ลำดับ</Typography>
              <Typography sx={{ fontWeight: 700 }}>ชื่อไฟล์</Typography>
            </Box>

            {data?.failedFiles?.map((fileName, index) => {
              return (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    borderBottom: '1px solid #B0B0B080',
                    padding: '8px'
                  }}
                >
                  <Typography>{index + 1}</Typography>
                  <Typography sx={{ color: 'red' }}>{fileName}</Typography>
                </Box>
              );
            })}

            {/* List of fail */}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ManageClassRoomDialog = ({
  open = false,
  data = {},
  studentData = null,
  onChange = () => {},
  value = {},
  onClose = () => {},
  onSubmit = () => {},
  errors = {},
  loading = false
}) => {
  const { data: roomOptions } = useQuery({
    queryKey: ['get_room_by_level', value?.level],
    queryFn: async () => await get_room_by_level(value?.level),
    enabled: !!value?.level
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>จัดการชั้นเรียน</DialogTitle>
      <DialogContent>
        {studentData && (
          <Box sx={{ display: 'flex', gap: '42px', rowGap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>ชื่อนักเรียน : </Typography>
              <Typography sx={{ fontSize: '14px' }}>{studentData?.name || ''}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>รหัสนักเรียน : </Typography>
              <Typography sx={{ fontSize: '14px' }}>{studentData?.studentId || ''}</Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', columnGap: { md: '40px' } }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>ข้อมูลเดิม</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>ข้อมูลใหม่</Typography>

          <CustomInput label="ปีการศึกษา" value={data?.year || ''} disabled />
          <CustomInput label="ปีการศึกษา" value={value?.year || ''} disabled />

          <CustomInput label="ภาคการศึกษา" value={data?.semester || ''} disabled />
          <CustomInput label="ภาคการศึกษา" value={value?.semester} disabled />

          <CustomInput label="ระดับชั้น" value={data?.level || ''} disabled />
          <CustomInput label="ระดับชั้น" value={value?.level} disabled />

          <CustomInput label="ห้อง" value={data?.room || ''} disabled />
          <CustomSelectOptions
            label="ห้อง"
            name="room"
            redLabel="*"
            options={roomOptions || []}
            onChange={onChange}
            value={value?.room || ''}
            error={errors?.room}
            disabled={!value?.level}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '30px' }}>
          <CustomButton
            variant="outlined"
            text="ยกเลิก"
            onClick={onClose}
            shadow={false}
            sx={{ color: '#3C3C3A', fontWeight: 300, '&:hover': { borderColor: '#47c4b1', color: 'black' }, width: '107px' }}
          />
          <CustomButton text="บันทึก" onClick={onSubmit} shadow={false} sx={{ width: '107px' }} disabled={loading} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const ManageClassRoomDialogForStudent = ({
  open = false,
  onClose = () => {},
  roomId = '',
  data = {},
  studentData = null,
  value = {},
  onChange = () => {},
  errors = {},
  onSubmit = () => {},
  loading = false
}) => {
  const { data: roomOptions } = useQuery({
    queryKey: ['get_room_by_level', value?.level],
    queryFn: async () => await get_room_by_level(value?.level),
    enabled: !!value?.level
  });

  const { data: classRoomOptions } = useQuery({
    queryKey: ['getAllClassRoomOptions'],
    queryFn: async () => await getAllClassRoomOptions()
  });

  if (data) console.log('data', data);

  const notThingChanged =
    data.year === +value?.year && data.semester === +value?.semester && data.level === value?.level && data.room === value?.room;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>จัดการชั้นเรียน</DialogTitle>
      <DialogContent>
        {studentData && (
          <Box sx={{ display: 'flex', gap: '42px', rowGap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>ชื่อนักเรียน : </Typography>
              <Typography sx={{ fontSize: '14px' }}>{studentData?.name || ''}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>รหัสนักเรียน : </Typography>
              <Typography sx={{ fontSize: '14px' }}>{studentData?.studentId || ''}</Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', columnGap: { md: '40px' } }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>ข้อมูลเดิม</Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>ข้อมูลใหม่</Typography>

          <CustomInput label="ปีการศึกษา" value={data?.year || ''} disabled />
          <CustomSelectOptions
            label="ปีการศึกษา"
            name="year"
            redLabel="*"
            options={getBePreviousYearUtilNextYearOptions(data?.year)}
            onChange={onChange}
            value={value?.year || ''}
            error={errors?.year}
          />

          <CustomInput label="ภาคการศึกษา" value={data?.semester || ''} disabled />
          <CustomSelectOptions
            label={'ภาคการศึกษา'}
            name="semester"
            redLabel="*"
            options={[
              { name: 1, value: 1 },
              { name: 2, value: 2 }
            ]}
            onChange={onChange}
            value={value?.semester || ''}
            error={errors?.semester}
          />

          <CustomInput label="ระดับชั้น" value={data?.level || ''} disabled />
          <CustomSelectOptions
            label="ระดับชั้น"
            name="level"
            redLabel="*"
            options={classRoomOptions || []}
            onChange={onChange}
            value={value?.level || ''}
            error={errors?.level}
          />

          <CustomInput label="ห้อง" value={data?.room || ''} disabled />
          <CustomSelectOptions
            label="ห้อง"
            name="room"
            redLabel="*"
            options={roomOptions || []}
            onChange={onChange}
            value={value?.room || ''}
            error={errors?.room}
            disabled={!value?.level}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '30px' }}>
          <CustomButton
            variant="outlined"
            text="ยกเลิก"
            onClick={onClose}
            shadow={false}
            sx={{ color: '#3C3C3A', fontWeight: 300, '&:hover': { borderColor: '#47c4b1', color: 'black' }, width: '107px' }}
          />
          <CustomButton text="บันทึก" onClick={onSubmit} shadow={false} sx={{ width: '107px' }} disabled={loading || notThingChanged} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const UploadStudentExcelResponseDialog = ({ open = false, onClose = () => {}, data = {} }) => {
  if (data) console.log('data', data);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }}>
        <IconButton onClick={onClose}>
          <IoCloseOutline />
        </IconButton>
      </Box>
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700, marginTop: '-35px' }}>รายละเอียด</DialogTitle>
      <DialogContent sx={{ minHeight: '200px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography>จำนวนที่อัปโหลด {data?.total_count || 0} รายการ</Typography>
          <Typography>สำเร็จ {data?.success_count || 0} รายการ</Typography>
          {data?.failed_count > 0 && <Typography sx={{ color: 'red' }}>ไม่สำเร็จ {data?.failed_count} รายการ</Typography>}
        </Box>

        {/* Fail  */}
        {!!data?.failed_count && data?.failed_count > 0 && (
          <Box sx={{ paddingBlock: '24px' }}>
            {/* Header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto auto auto auto 1fr 1.5fr',
                borderBottom: '1px solid #B0B0B080',
                paddingBottom: '3px',
                gap: '10px'
              }}
            >
              <Typography sx={{ fontWeight: 700, width: '80px', textAlign: 'center' }}>ลำดับ</Typography>
              <Typography sx={{ fontWeight: 700, width: '80px', textAlign: 'center' }}>ระดับชั้น</Typography>
              <Typography sx={{ fontWeight: 700, width: '80px', textAlign: 'center' }}>ห้อง</Typography>
              <Typography sx={{ fontWeight: 700, width: '80px', textAlign: 'center' }}>รหัสนักเรียน</Typography>
              <Typography sx={{ fontWeight: 700, textAlign: 'center', textWrap: 'nowrap' }}>ชื่อ-สกุล</Typography>
              <Typography sx={{ fontWeight: 700, textAlign: 'center', textWrap: 'nowrap' }}>หมายเหตุ</Typography>
            </Box>

            {data?.failed_students?.map((item, index) => {
              const description = Array.isArray(item?.reason) ? item.reason.join('\n') : item?.reason || '';

              const shortDescription = typeof sliceText === 'function' ? sliceText(description, 30) : description.slice(0, 30);

              return (
                <Box
                  key={item.student_id || index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto auto auto auto 1fr 1.5fr',
                    borderBottom: '1px solid #B0B0B080',
                    paddingBlock: '8px',
                    gap: '10px'
                  }}
                >
                  <Typography sx={{ color: 'red', width: '80px', textAlign: 'center' }}>{index + 1}</Typography>
                  <Typography sx={{ color: 'red', width: '80px', textAlign: 'center' }}>{item?.level || ''}</Typography>
                  <Typography sx={{ color: 'red', width: '80px', textAlign: 'center' }}>{item?.room || ''}</Typography>
                  <Typography sx={{ color: 'red', width: '80px', textAlign: 'center' }}>{item?.student_id || ''}</Typography>
                  <Typography sx={{ color: 'red', textWrap: 'nowrap' }}>
                    {`${item.prefix || ''}${item.first_name || ''} ${item.last_name || ''}`}
                  </Typography>
                  <Tooltip
                    placement="top"
                    arrow
                    title={
                      <div>
                        {item?.reason?.map((desc, i) => {
                          return (
                            <Typography key={desc} sx={{ fontSize: '12px' }}>
                              {`${i + 1}.`} {desc}
                            </Typography>
                          );
                        })}
                      </div>
                    }
                  >
                    <Typography style={{ cursor: 'pointer', color: 'red', textWrap: 'nowrap' }}>{shortDescription}</Typography>
                  </Tooltip>
                </Box>
              );
            })}

            {/* List of fail */}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export {
  CustomConfirmDialog,
  CustomAlertDialog,
  CustomOneInputDialog,
  UploadImageZipDialog,
  ManageClassRoomDialog,
  ManageClassRoomDialogForStudent,
  UploadStudentExcelResponseDialog
};
