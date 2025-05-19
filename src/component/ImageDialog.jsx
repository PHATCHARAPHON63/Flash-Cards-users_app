import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { baseUrlWithTokenImg } from './function/global';

const isImageFile = (fileName) => {
  const ext = fileName?.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext);
};

const isPdfFile = (fileName) => {
  const ext = fileName?.split('.').pop().toLowerCase();
  return ext === 'pdf';
};

// ตรวจว่าเป็น File object หรือไม่
const isFileObject = (file) => {
  // console.log(file);
  return file instanceof File;
};

const ImageDialog = ({ open, onClose, url, fileName, title_view }) => {
  //   console.log(url, fileName);
  // ถ้า url เป็น File (Blob) ให้สร้าง object URL
  // console.log('url', url);

  const isFile = isFileObject(url);
  const previewUrl = isFile ? URL.createObjectURL(url) : `${baseUrlWithTokenImg.defaults.baseURL}/${url}`;

  console.log('previewUrl', previewUrl);

  // console.log('previe                                wUrl', previewUrl);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableEnforceFocus>
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
        {title_view}
        <IconX stroke={2} onClick={onClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center' }}>
        {isImageFile(fileName) && <img src={previewUrl} alt={fileName} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />}

        {isPdfFile(fileName) && <iframe src={previewUrl} title={fileName} width="100%" height="600px" style={{ border: 'none' }} />}

        {!isImageFile(fileName) && !isPdfFile(fileName) && <p>ไม่สามารถแสดงตัวอย่างไฟล์นี้ได้</p>}
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
