import { Autocomplete, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { fontWeight } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import CustomButton from 'component/CustomButton';
import CustomInput from 'component/CustomInput';
import CustomSelectOptions from 'component/CustomSelectOptions';
import { get_class_options } from 'component/function/register';

const AddClassRoomDialog = ({
  title = '',
  open,
  onClose = () => {},
  onSave = () => {},
  value,
  onChange = () => {},
  errors = {},
  disabled = false
}) => {
  const { data: options } = useQuery({
    queryKey: ['get_class_options'],
    queryFn: async () => await get_class_options()
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: '16px', fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
          <Autocomplete
            options={options || []}
            getOptionLabel={(option) => option}
            value={value?.level || ''}
            fullWidth
            onChange={(event, newValue) => {
              onChange({
                target: {
                  name: 'level',
                  value: newValue || ''
                }
              });
            }}
            renderInput={(params) => (
              <CustomInput label="ระดับชั้น" placeholder="กรุณาเลือกข้อมูล" required {...params} error={errors?.level} />
            )}
            required
          />
          {/* <CustomInput
            label="ห้องเรียน"
            placeholder="กรุณากรอกข้อมูล"
            required
            name="room"
            value={value?.room || ''}
            onChange={onChange}
            error={errors?.room}
          /> */}
          <CustomSelectOptions
            label="ห้องเรียน"
            placeholder="กรุณาเลือกข้อมูล"
            redLabel="*"
            name="room"
            options={Array.from({ length: 20 }, (_, index) => {
              return { name: index + 1, value: index + 1 };
            })}
            value={value?.room || ''}
            onChange={onChange}
            error={errors?.room}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', marginTop: '30px' }}>
          <CustomButton
            variant="outlined"
            text="ยกเลิก"
            onClick={onClose}
            shadow={false}
            sx={{ color: '#3C3C3A', fontWeight: 300, '&:hover': { borderColor: '#47c4b1', color: 'black' } }}
          />
          <CustomButton text="บันทึก" onClick={onSave} shadow={false} disabled={disabled} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default AddClassRoomDialog;
