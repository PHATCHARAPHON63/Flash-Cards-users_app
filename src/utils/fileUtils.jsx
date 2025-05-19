import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';

// ฟังก์ชันสำหรับแสดงไอคอนตามประเภทไฟล์
export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) {
    return <ImageIcon sx={{ color: '#2196f3' }} />; // สีฟ้า
  } else if (fileType === 'application/pdf') {
    return <DescriptionIcon sx={{ color: '#f44336' }} />; // สีแดง
  } else if (fileType === 'video/mp4') {
    return <VideocamIcon sx={{ color: '#4caf50' }} />; // สีเขียว
  }
};

// ฟังก์ชันสำหรับแสดงชื่อไฟล์
export const getDisplayFileName = (file, index) => {
  const fileName = file.name || file.filename;
  const extension = fileName.split('.').pop().toLowerCase();
  let fileType = '';

  if (['jpg', 'jpeg', 'png'].includes(extension)) {
    fileType = 'รูปภาพ';
  } else if (extension === 'pdf') {
    fileType = 'เอกสาร PDF';
  } else if (extension === 'mp4') {
    fileType = 'วิดีโอ';
  }

  return `${index + 1}. ${fileType}`;
};

// ฟังก์ชันแสดงขนาดไฟล์
export const getFileSize = (size) => {
  if (size < 1024 * 1024) {
    // น้อยกว่า 1MB
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};
