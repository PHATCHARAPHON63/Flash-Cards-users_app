import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment/locale/th';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { Box } from '@mui/system';
import { CustomInput } from './CustomInput';
import { TextField } from '@mui/material';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md';
const CustomThaiDateTimePicker = ({
  value,
  era = 'BE',
  format = 'DD/MM/YYYY HH:mm',
  onDateSelect,
  placeholder = 'เลือกวันที่',
  minDate = null,
  maxDate = null,
  disableFuture = true,
  inputStyle = {},
  AMPM = false,
  label = '',
  redLabel,
  required = false,
  onChange,
  width,
  yearLength = 10,
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value ? moment(value).hour() : 0);
  const [selectedMinute, setSelectedMinute] = useState(value ? moment(value).minute() : 0);
  const [selectedAMPM, setSelectedAMPM] = useState(value ? (moment(value).hour() >= 12 ? 'PM' : 'AM') : 'AM');

  const inputRef = useRef(null);
  const today = moment();

  const minMoment = minDate ? moment(minDate, 'YYYY-MM-DD') : null;
  const maxMoment = maxDate ? moment(maxDate, 'YYYY-MM-DD') : disableFuture ? today.endOf('day') : null;

  // const years = Array.from({ length: 50 }, (_, i) => {
  //   const yearAD = moment().year() - i;
  //   return era === 'BE' ? yearAD + 543 : yearAD;
  // });
  const years = Array.from({ length: yearLength }, (_, i) => {
    const baseYear = maxMoment ? maxMoment.year() - yearLength + 1 + i : moment().year() - 25 + i;
    return era === 'BE' ? baseYear + 543 : baseYear;
  });

  const handleTimeChange = (hour, minute, ampm) => {
    console.log('handleTimeChange', hour, minute, ampm);
    if (hour === undefined || minute === undefined || ampm === undefined) {
      console.error('Error: hour, minute, or ampm is undefined');
      return; // ป้องกันไม่ให้ฟังก์ชันทำงานหากมีค่าผิดพลาด
    }

    let hour24 = hour;
    if (ampm === 'PM' && hour !== 12) hour24 = hour + 12;
    if (ampm === 'AM' && hour === 12) hour24 = 0;

    console.log('hour', hour, minute, ampm);

    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedAMPM(ampm);

    const currentDate = value ? moment(value) : moment();
    const newDateTime = currentDate.clone().hour(hour24).minute(minute);

    if (onDateSelect) {
      onDateSelect(newDateTime.format('YYYY-MM-DD HH:mm'));
    }
  };

  // const handleTimeChange = (hour, minute, ampm) => {
  //   console.log('handleTimeChange', hour, minute, ampm);

  //   // ตรวจสอบค่า hour, minute, ampm ถ้าขาด
  //   if (hour === undefined || minute === undefined || ampm === undefined) {
  //     console.error('Error: hour, minute, or ampm is undefined');
  //     return;
  //   }

  //   // คำนวณเวลาในรูปแบบ 24 ชั่วโมง
  //   let hour24 = hour;
  //   if (ampm === 'PM' && hour !== 12) hour24 = hour + 12;
  //   if (ampm === 'AM' && hour === 12) hour24 = 0;

  //   // กำหนดค่า selectedHour, selectedMinute, selectedAMPM
  //   setSelectedHour(hour);
  //   setSelectedMinute(minute);
  //   setSelectedAMPM(ampm);

  //   // ใช้ value จาก props หากมีค่า (เช่น ค่าเดิมจากการเลือก) หรือใช้เวลาปัจจุบัน
  //   const currentDate = value ? moment(value) : moment(); // ค่าปัจจุบัน ถ้าไม่มี value

  //   // ตรวจสอบหาก value ไม่มี ให้ใช้เวลาที่เลือกมา
  //   const newDateTime = currentDate
  //     .hour(hour24) // ตั้งค่า hour
  //     .minute(minute); // ตั้งค่า minute

  //   // ส่งค่ากลับไปที่ onDateSelect (ถ้ามีการกำหนด)
  //   if (onDateSelect) {
  //     onDateSelect(newDateTime.format('YYYY-MM-DD HH:mm'));
  //   }
  // };

  const handleHourScroll = (hour) => {
    // const newHour = parseInt(e.target.value);
    // handleTimeChange(newHour, selectedMinute, selectedAMPM);
    if (hour !== undefined && !isNaN(hour)) {
      handleTimeChange(hour, selectedMinute, selectedAMPM);
    } else {
      console.error('Error: hour is undefined or NaN');
    }
  };

  // const handleMinuteScroll = (e) => {
  //   const newMinute = parseInt(e.target.value);
  //   handleTimeChange(selectedHour, newMinute, selectedAMPM);
  // };

  const handleMinuteScroll = (minute) => {
    // ตรวจสอบว่า minute มีค่าอยู่หรือไม่
    if (minute !== undefined && !isNaN(minute)) {
      // เมื่อคลิก เลือก minute ที่ถูกต้องและส่งไปยัง handleTimeChange
      handleTimeChange(selectedHour, minute, selectedAMPM);
    } else {
      console.error('Error: minute is undefined or NaN');
    }
  };

  const handleAMPMClick = (newAMPM) => {
    if (newAMPM !== undefined) {
      handleTimeChange(selectedHour, selectedMinute, newAMPM);
    } else {
      console.error('Error: newAMPM is undefined');
    }
  };

  const daysInMonth = () => {
    const start = moment(currentMonth).startOf('month').startOf('week');
    const end = moment(currentMonth).endOf('month').endOf('week');
    const day = start.clone();
    const days = [];

    while (day.isBefore(end, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const selectDate = (day) => {
    console.log('day', day);

    if (isDateDisabled(day)) return;

    const newDateTime = day.clone().hour(selectedHour).minute(selectedMinute);
    console.log('newDateTime', newDateTime);

    if (onDateSelect) {
      onDateSelect(newDateTime.format('YYYY-MM-DD HH:mm'));
      console.log('onDateSelect', newDateTime.format('YYYY-MM-DD HH:mm'));
    }
    //! close Date setShowCalendar(false);
  };

  const handleDone = () => {
    setShowCalendar(false);
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

  const prevMonth = () => setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth(moment(currentMonth).add(1, 'month'));

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('onclick', handleClickOutside);
    return () => {
      document.removeEventListener('onclick', handleClickOutside);
    };
  }, []);

  console.log('value', formatDate(value));

  return (
    <Box style={{ position: 'relative' }} ref={inputRef}>
      <div
        style={{ display: 'flex', alignItems: 'center', borderRadius: '5px', cursor: 'pointer' }}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {/* <input
          type="text"
          value={value ? formatDate(value) : ''}
          readOnly
          placeholder={placeholder}
          style={{
            border: 'none',
            outline: 'none',
            minWidth: '170px',
            cursor: 'pointer',
            background: 'transparent',
            ...inputStyle
          }}
        /> */}
        {/* <TextField
          placeholder={placeholder}
          fullWidth
          autoComplete="off"
          value={value ? formatDate(value) : ''}
          InputProps={{
            endAdornment: <FaRegCalendarAlt color="#868e96" fontSize="20px" />
          }}
        /> */}
        <TextField
          //   type={type}
          label={
            <>
              {label} {redLabel && <span style={{ color: 'red' }}>{redLabel}</span>}
            </>
          }
          name={name}
          variant="outlined"
          autoComplete="off"
          required={required}
          //   value={value}
          value={value ? formatDate(value) : ''}
          onChange={onChange}
          helperText={props.error || ''}
          {...props}
          InputProps={{
            endAdornment: <FaRegCalendarAlt color="#868e96" fontSize="20px" />
          }}
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
        />
        {/* <span style={{ marginLeft: '5px', marginRight: '10px', fontSize: '20px' }}>
          <FaRegCalendarAlt color="#868e96" />
        </span> */}
      </div>

      {showCalendar && (
        <>
          <div
            style={{
              position: 'absolute',
              left: '0',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '10px',
              width: '450px',
              padding: '20px',
              zIndex: 1000,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              marginTop: '5px'
            }}
          >
            <div style={{ display: 'flex' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <button
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
                  >
                    <MdOutlineArrowForwardIos fontSize="18px" color="#343a40" />
                  </button>
                </div>
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      margin: '5px 0'
                    }}
                  >
                    {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d, i) => (
                      <div key={i}>{d}</div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                    {daysInMonth().map((day, i) => {
                      const disabled = isDateDisabled(day);
                      const isToday = day.isSame(today, 'day');
                      const isSelected = value && day.isSame(value, 'day');

                      return (
                        <div
                          key={i}
                          onClick={() => !disabled && selectDate(day)}
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                            borderRadius: '50%',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            background: isSelected ? '#052253' : isToday ? '#eaf4fe' : '',
                            color: disabled ? '#999' : isSelected ? '#fff' : '#000',
                            border: isToday ? '1px solid #adb5bd' : '',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px'
                          }}
                        >
                          {day.format('D')}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', padding: '0 15px' }}>
                {/* Hours */}
                <hr style={{ margin: '10px 0', borderColor: '#ccc', opacity: '.4' }} />
                <div
                  value={selectedHour}
                  // onClick={handleHourScroll}
                  style={{
                    flexDirection: 'column',
                    overflow: 'auto',
                    height: '250px',
                    fontSize: '16px',
                    padding: '0 10px',
                    '-webkit-overflow-scrolling': 'touch',
                    position: 'relative'
                  }}
                >
                  {/* {Array.from({ length: AMPM ? 12 : 23 }, (_, i) => (
                    <option
                      key={i}
                      value={i + 1}
                      style={{ cursor: 'pointer', padding: '4px', alignItems: 'center', transition: 'background-color 0.2s ease-in-out' }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))} */}
                  {Array.from({ length: AMPM ? 12 : 24 }, (_, i) => {
                    // const hour = AMPM ? (i + 1).padStart(2, '0') : i?.padStart(2, '0');
                    const hour = AMPM ? (i + 1).toString().padStart(2, '0') : i.toString().padStart(2, '0');
                    console.log('selectedHour', selectedHour);
                    return (
                      <div
                        key={hour}
                        value={hour}
                        onClick={() => handleHourScroll(hour)}
                        style={{
                          cursor: 'pointer',
                          padding: '4px',
                          alignItems: 'center',
                          backgroundColor: parseInt(selectedHour) === parseInt(hour) ? '#052253' : 'white', // เฉพาะค่าที่เลือก
                          color: parseInt(selectedHour) === parseInt(hour) ? 'white' : 'inherit',
                          // fontWeigfht: selectedHour === parseInt(hour) ? 'bold' : 'normal',
                          borderRadius: '50%'
                        }}
                      >
                        {hour}
                      </div>
                    );
                  })}
                </div>
                <hr style={{ margin: '10px 0', borderColor: '#ccc', opacity: '.4' }} />
                {/* Minutes */}
                <div
                  value={selectedMinute}
                  // onClick={handleMinuteScroll}
                  style={{
                    flexDirection: 'column',
                    overflow: 'auto',
                    height: '250px',
                    fontSize: '16px',
                    padding: '0 10px',
                    '-webkit-overflow-scrolling': 'touch',
                    position: 'relative'
                  }}
                >
                  {/* {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i} style={{ cursor: 'pointer', padding: '4px', alignItems: 'center' }}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))} */}
                  {Array.from({ length: 60 }, (_, i) => {
                    const minute = String(i).padStart(2, '0');
                    return (
                      <div
                        key={minute}
                        onClick={() => handleMinuteScroll(minute)}
                        value={minute}
                        style={{
                          cursor: 'pointer',
                          padding: '4px',
                          alignItems: 'center',
                          backgroundColor: parseInt(selectedMinute) === parseInt(minute) ? '#052253' : 'white', // เปลี่ยนสีพื้นหลังเมื่อถูกเลือก
                          // fontWeight: selectedMinute === parseInt(minute) ? 'bold' : 'normal',
                          color: parseInt(selectedMinute) === parseInt(minute) ? 'white' : 'inherit',
                          borderRadius: '50%' // ทำให้เป็นวงกลม
                        }}
                      >
                        {minute}
                      </div>
                    );
                  })}
                </div>
                <hr style={{ margin: '10px 0', borderColor: '#ccc', opacity: '.4' }} />
                {/* AM/PM */}
                {AMPM && (
                  <>
                    <div
                      style={{
                        flexDirection: 'column',
                        overflow: 'scroll',
                        //   height: '200px',
                        scrollbarWidth: 'none',
                        fontSize: '14px',
                        padding: '0 7px'
                      }}
                    >
                      <option value="AM" onClick={() => handleAMPMClick('AM')} style={{ cursor: 'pointer' }}>
                        AM
                      </option>
                      <option value="PM" onClick={() => handleAMPMClick('PM')} style={{ cursor: 'pointer' }}>
                        PM
                      </option>
                    </div>
                    <hr style={{ margin: '10px 0', borderColor: '#ccc', opacity: '.4' }} />
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <button
                type="button"
                onClick={handleDone}
                style={{ marginTop: '10px', width: '75px', background: '#052253', color: '#fff', padding: '10px', fontWeight: '700' }}
              >
                ตกลง
              </button>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};

export default CustomThaiDateTimePicker;
