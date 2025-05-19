import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { IconExclamationCircle } from '@tabler/icons-react';
import React from 'react';

const CustomDialog_Errors = ({ data, open = false, onClose = false }) => {
  // console.log(data);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ textAlign: 'center' }}>{data.Icon}</DialogTitle>
        <DialogContent style={{ textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary" fontSize="22px">
            {data.text}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomDialog_Errors;
