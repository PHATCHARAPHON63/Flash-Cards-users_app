import { Dialog, DialogContent } from '@mui/material';
import { PulseLoader } from 'react-spinners';

const ApiLoadingPage = ({ open }) => {
  return (
    <Dialog
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'transparent', // Transparent background
          boxShadow: 'none', // Remove any default shadow
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        backdropFilter: 'blur(2px)' // Optional: Add blur effect to the background
      }}
    >
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PulseLoader color="#65C4B6" />
      </DialogContent>
    </Dialog>
  );
};
export default ApiLoadingPage;

('#3E4A89');
