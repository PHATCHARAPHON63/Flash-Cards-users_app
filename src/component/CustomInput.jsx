import { TextField } from '@mui/material';

const CustomInput = ({ label, redLabel, value, onChange, name, width, type = 'text', rows = 1, required = false, ...props }) => {
  return (
    <TextField
      type={type}
      label={
        <>
          {label} {redLabel && <span style={{ color: 'red' }}>{redLabel}</span>}
        </>
      }
      name={name}
      variant="outlined"
      autoComplete="off"
      required={required}
      value={value}
      onChange={onChange}
      helperText={props.error || ''}
      {...props}
      InputLabelProps={{
        shrink: true,
        sx: {
          padding: '0 4px',
          color: '#000000',
          '&.Mui-focused': { color: 'inherit' },
          fontSize: 16,
          '& .MuiFormLabel-asterisk': {
            // Styles the asterisk
            color: 'red' // Set the asterisk color to red
          }
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: props.error ? 'red' : ''
          },
          '&:hover fieldset': {
            borderColor: props.error ? 'red' : ''
          },
          '&.Mui-focused fieldset': {
            borderColor: props.error ? 'red' : ''
          },
          '&.Mui-disabled fieldset': {
            borderColor: props.error ? 'red' : '#C1C6CD'
          },
          width,
          backgroundColor: 'white'
        }
      }}
      fullWidth={!width || width === '100%'}
      multiline={rows > 1} // Enable multi-line input
      rows={rows} // Set the number of visible rows
    />
  );
};

export default CustomInput;
