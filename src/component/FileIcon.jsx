import { IconFileTypeDoc, IconFileTypeDocx, IconFileTypeJpg, IconFileTypePdf, IconFileTypePng, IconFileTypeXls, IconFileTypeZip, IconFileZip } from '@tabler/icons-react';
import React from 'react';
import { PiFilePngBold, PiFilePdfBold, PiFileDocBold, PiFileZipBold, PiFileXlsBold } from 'react-icons/pi';

const getFileExtension = (filename) => {
  return filename?.split('.').pop().toLowerCase();
};

const getFileIcon = (ext) => {
  switch (ext) {
    case 'png':
      return <IconFileTypePng stroke={2} />;
    case 'jpg':
      return <IconFileTypeJpg stroke={2} />;
    case 'jpeg':
      return <IconFileTypeJpg stroke={2} />;
    case 'pdf':
      return <IconFileTypePdf stroke={2} />;
    case 'doc':
      return <IconFileTypeDoc stroke={2} />;
    case 'docx':
      return <IconFileTypeDocx stroke={2} />;
    case 'xls':
      return <IconFileTypeXls stroke={2} />;
    case 'xlsx':
      return <IconFileTypeXls stroke={2} />;
    case 'zip':
      return <IconFileTypeZip stroke={2} />;
    case 'rar':
      return <IconFileZip stroke={2} />
    default:
      return <PiFileDocBold size={24} />;
  }
};

const FileIcon = ({ fileName, size = 24 }) => {
  if (!fileName) return null;

  const ext = getFileExtension(fileName);
  const IconComponent = getFileIcon(ext);

  // Clone element to pass size if needed
  return React.cloneElement(IconComponent, { size });
};

export default FileIcon;
