import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const CustomSelectOptions = ({
  label,
  redLabel,
  name,
  onChange,
  width,
  value,
  error = false,
  options = [],
  placeholder = 'กรุณาเลือกข้อมูล', // Default placeholder
  disabled = false
}) => {
  const generateLabelColor = () => {
    let color = 'inherit';

    if (disabled) {
      color = '#C1C6CD';
    }

    if (error) {
      color = 'red';
    }
    return color;
  };
  return (
    <FormControl fullWidth sx={{ width: width }} error={!!error} disabled={disabled}>
      <InputLabel
        id={`${name}-select-label`}
        shrink={!!value || value === ''} // Shrink the label when there’s a value
        sx={{
          padding: '0 4px',
          backgroundColor: 'white',
          color: error ? 'red' : '#000000',
          '&.Mui-focused': { color: error ? 'red' : 'inherit' },
          fontSize: 16,
          transform: 'translate(14px, -9px) scale(0.75)' // Adjust label position
        }}
      >
        <span style={{ color: generateLabelColor() }}>{label}</span>{' '}
        {redLabel && <span style={{ color: disabled ? '#C1C6CD' : 'red' }}>{redLabel}</span>}
      </InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        name={name}
        value={value}
        onChange={onChange}
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty
        disabled={disabled}
        renderValue={(selected) => {
          if (!selected) {
            return (
              <span
                style={{
                  color: '#DEE0E4' // Gray placeholder color
                }}
              >
                {placeholder}
              </span>
            );
          }
          return selected;
        }}
        sx={{
          backgroundColor: 'white',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: error ? 'red' : ''
            },
            '&:hover fieldset': {
              borderColor: error ? 'red' : ''
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? 'red' : ''
            },
            '&.Mui-disabled fieldset': {
              borderColor: error ? 'red' : '#C1C6CD'
            }
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>}
    </FormControl>
  );
};

export const CustomInput = ({ label, redLabel, value, onChange, name, width, type = 'text', rows = 1, required = false, ...props }) => {
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
