import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
dayjs.locale('th');

const CustomDateTimePicker = ({ value, name, onChange, error, required = false, label, placeholder, fullWidth = false, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        name={name}
        label={
          required ? (
            <span>
              <span style={{ color: error ? 'red' : 'inherit' }}>{label}</span>{' '}
              <span style={{ color: props.disabled ? '#C1C6CD' : 'red' }}>*</span>
            </span>
          ) : (
            <span style={{ color: error ? 'red' : 'inherit' }}>{label}</span>
          )
        }
        value={value ? dayjs(value) : null}
        onChange={onChange}
        {...props}
        slotProps={{
          textField: {
            error: !!error,
            helperText: error,
            placeholder: placeholder || '',
            InputLabelProps: {
              shrink: true,
              sx: {
                padding: '0 4px',
                color: '#000000',
                '&.Mui-focused': { color: 'inherit' },
                fontSize: 16
              }
            },
            fullWidth: fullWidth,
            inputProps: { readOnly: true },
            sx: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: error ? 'red' : 'default'
                },
                '&:hover fieldset': {
                  borderColor: error ? 'red' : 'default'
                },
                '&.Mui-focused fieldset': {
                  borderColor: error ? 'red' : 'default'
                },
                backgroundColor: 'white'
              }
            }
          }
        }}
        format="DD/MM/YYYY HH:mm"
        ampm={false}
      />
    </LocalizationProvider>
  );
};
export default CustomDateTimePicker;
