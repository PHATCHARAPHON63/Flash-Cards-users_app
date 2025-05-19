import moment from 'moment';

const show_date_thai = (date) => {
  // Convert the date to a Date object if it is a string
  if (typeof date === 'string') {
    date = new Date(date);
  }

  // Check if the date is a valid Date object
  if (date instanceof Date && !isNaN(date)) {
    const thaiYear = moment(date).year() + 543;
    return moment(date).year(thaiYear).format('DD/MM/YYYY');
  } else {
    // Return a fallback or error message for invalid date
    console.log('Invalid date provided:', date);
    return ''; // Or return a default value like 'Invalid Date'
  }
};

const date_delta = (date1, date2) => {
  // Convert the date to a Date object if it is a string
  if (typeof date1 === 'string') {
    date1 = new Date(date1);
  }
  if (typeof date2 === 'string') {
    date2 = new Date(date2);
  }

  // Check if the date is a valid Date object
  if (date1 instanceof Date && !isNaN(date1) && date2 instanceof Date && !isNaN(date2)) {
    const delta = date2 - date1;
    const days = Math.floor(delta / (1000 * 60 * 60 * 24));
    return days;
  } else {
    // Return a fallback or error message for invalid date
    console.error('Invalid date provided:', date1, date2);
    return ''; // Or return a default value like 'Invalid Date'
  }
};

const getDateYmdCe = (date=new Date(), separator = '-') => {
  const dateInput = new Date(date);

  const year = dateInput.getFullYear();
  const month = String(dateInput.getMonth() + 1).padStart(2, '0');
  const day = String(dateInput.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
};

export { show_date_thai, date_delta, getDateYmdCe };
