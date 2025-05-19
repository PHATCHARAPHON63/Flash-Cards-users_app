import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { useRef, useState } from 'react';

const UploadDialog = ({
  open = false,
  title = '',
  label = '',
  description = '',
  onClose = () => {},
  onSave = () => {},
  disabled = false,
  allowedTypes,
  accept
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');

  const handleImportClick = () => {
    fileInputRef.current.click(); // trigger hidden input
    setError('');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (!allowedTypes.includes(file.type)) {
      alert('กรุณาเลือกไฟล์ Excel เท่านั้น (.xlsx หรือ .xls)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setFormData(formData);
  };

  const handleSave = () => {
    if (!formData) {
      setError('กรุณาเลือกไฟล์');
      return;
    }
    onSave(formData);
    setFileName('');
    setFormData(null);
  };

  const handleCancel = () => {
    setError('');
    setFileName('');
    setFormData(null);
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={handleCancel}>
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: '10px', paddingBlock: '20px' }}>
            <CustomInput label={label} placeholder="กรุณาเลือกไฟล์" value={fileName} disabled redLabel="*" error={error} />
            <input ref={fileInputRef} type="file" name="file" style={{ display: 'none' }} accept={accept} onChange={handleFileChange} />
            <CustomButton
              text="อัปโหลด"
              shadow={false}
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                '&:hover': { borderColor: '#64C4B6' },
                borderColor: '#64C4B6',
                height: '56px',
                width: 'auto',
                minWidth: '100px',
                fontSize: '14px',
                fontWeight: 300
              }}
              onClick={handleImportClick}
            />
          </Box>
          {!error && <Typography sx={{ fontSize: '12px', fontWeight: 300, marginTop: '-16px' }}>{description}</Typography>}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '20px' }}>
            <CustomButton
              variant="outlined"
              text="ยกเลิก"
              onClick={handleCancel}
              shadow={false}
              sx={{ color: '#3C3C3A', fontWeight: 300, '&:hover': { borderColor: '#47c4b1', color: 'black' }, width: '71.4px' }}
            />
            <CustomButton
              text={disabled ? <CircularProgress sx={{ color: '#dee2e6' }} size={24} /> : 'บันทึก'}
              onClick={handleSave}
              shadow={false}
              disabled={disabled}
              sx={{ width: '71.4px' }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default UploadDialog;
