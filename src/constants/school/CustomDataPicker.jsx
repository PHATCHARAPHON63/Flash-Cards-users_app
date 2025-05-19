import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

const CustomDatePicker = ({ label, value, onChange, name, error, fullWidth = false, required = false, sx = {}, ...props }) => {
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        format="dd/MM/yyyy"
        name={name}
        label={
          required ? (
            <span>
              {label} <span style={{ color: 'red' }}>*</span>
            </span>
          ) : (
            label
          )
        }
        value={hasValue ? new Date(value) : null}
        onChange={(v) => onChange(v)}
        {...props}
        slotProps={{
          textField: {
            error: !!error,
            helperText: error,
            fullWidth: fullWidth,
            InputLabelProps: {
              shrink: true,
              sx: {
                padding: '0 4px',
                color: '#000000',
                '&.Mui-focused': { color: 'inherit' },
                fontSize: 16
              }
            },

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
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
