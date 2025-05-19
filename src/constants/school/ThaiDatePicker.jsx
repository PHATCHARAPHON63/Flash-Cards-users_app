import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/th'; // Import Thai locale
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import { CustomInput } from './CustomInput';

const ThaiDatePicker = ({
  value,
  era = 'BE',
  format = 'DD/MM/YYYY',
  onDateSelect,
  placeholder = '',
  minDate = null,
  maxDate = null,
  disableFuture = true,
  containerStyle = {},
  label = null,
  redLabel = '',
  error = '',
  name = '',
  yearLength = 50
}) => {
  const today = moment();
  const minMoment = minDate ? moment(minDate, 'YYYY-MM-DD') : null;
  const maxMoment = maxDate ? moment(maxDate, 'YYYY-MM-DD') : disableFuture ? today.endOf('day') : null;

  // Ensure calendar starts at maxDate if it exists, else today
  const [currentMonth, setCurrentMonth] = useState(maxMoment ? maxMoment.clone() : moment());
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef(null);

  const years = Array.from({ length: yearLength }, (_, i) => {
    const baseYear = maxMoment ? maxMoment.year() - yearLength + 1 + i : moment().year() - 25 + i;
    return era === 'BE' ? baseYear + 543 : baseYear;
  });

  const daysInMonth = () => {
    const start = moment(currentMonth).startOf('month').startOf('week');
    const end = moment(currentMonth).endOf('month').endOf('week');
    const days = [];
    let day = start.clone();

    while (day.isBefore(end, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const selectDate = (day) => {
    if (isDateDisabled(day)) return;
    setShowCalendar(false);
    if (onDateSelect) {
      onDateSelect(day.format('YYYY-MM-DD'));
    }
  };

  const isDateDisabled = (date) => {
    return (minMoment && date.isBefore(minMoment, 'day')) || (maxMoment && date.isAfter(maxMoment, 'day'));
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateMoment = moment(date);
    let formattedDate = dateMoment.format(format);
    if (era === 'BE') {
      const beYear = dateMoment.year() + 543;
      formattedDate = formattedDate.replace(/\d{4}/, beYear);
    }
    return formattedDate;
  };

  const handleYearChange = (event) => {
    const selectedYear = parseInt(event.target.value, 10);
    const adYear = era === 'BE' ? selectedYear - 543 : selectedYear;
    setCurrentMonth(moment(currentMonth).year(adYear));
  };

  // Prevent navigating to months beyond maxDate
  const prevMonth = () => setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  const nextMonth = () => {
    const next = moment(currentMonth).add(1, 'month');
    if (!maxMoment || next.isSameOrBefore(maxMoment, 'month')) {
      setCurrentMonth(next);
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', ...containerStyle }} ref={inputRef}>
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowCalendar(!showCalendar)}>
        {label ? (
          <CustomInput
            name={name}
            label={label}
            redLabel={redLabel}
            value={value ? formatDate(value) : ''}
            error={error}
            InputProps={{
              endAdornment: <FaRegCalendarAlt color="#868e96" fontSize="20px" />
            }}
          />
        ) : (
          <TextField
            name={name}
            variant="outlined"
            placeholder={placeholder}
            fullWidth
            autoComplete="off"
            value={value ? formatDate(value) : ''}
            InputProps={{
              endAdornment: <FaRegCalendarAlt color="#868e96" fontSize="20px" />
            }}
          />
        )}
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div
          style={{
            position: 'absolute',
            left: '0',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '10px',
            width: '320px',
            padding: '20px',
            zIndex: 1000,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            marginTop: '5px'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={prevMonth}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5px',
                background: '#a5d8ff',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <MdOutlineArrowBackIos fontSize="18px" color="#343a40" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>{currentMonth.locale('th').format('MMMM')}</h2>
              <select
                onChange={handleYearChange}
                value={era === 'BE' ? currentMonth.year() + 543 : currentMonth.year()}
                style={{
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5px',
                background: '#a5d8ff',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer'
              }}
              disabled={maxMoment && currentMonth.isSameOrAfter(maxMoment, 'month')}
            >
              <MdOutlineArrowForwardIos fontSize="18px" color="#343a40" />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', margin: '5px 0' }}>
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {daysInMonth().map((day, i) => {
              const disabled = isDateDisabled(day);
              return (
                <div
                  key={i}
                  onClick={() => !disabled && selectDate(day)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    width: '35px',
                    height: '35px',
                    textAlign: 'center',
                    borderRadius: '50%',
                    cursor: disabled ? 'default' : 'pointer',
                    background: day.isSame(value, 'day') ? '#052253' : '',
                    color: disabled ? '#999' : day.isSame(value, 'day') ? 'white' : ''
                  }}
                >
                  {day.format('D')}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Box>
  );
};

export default ThaiDatePicker;
