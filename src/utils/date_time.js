const get_buddies_era_select_options = (minYear) => {
  if (!minYear) {
    const currentYear = new Date().getFullYear() + 543;
    return [
      {
        name: currentYear,
        value: currentYear
      }
    ];
  }

  const currentYear = new Date().getFullYear() + 543;
  const yearOptions = [];
  for (let i = minYear; i <= currentYear + 1; i++) {
    const year_option = {
      name: i,
      value: i
    };
    yearOptions.push(year_option);
  }
  return yearOptions;
};

const get_buddies_era_this_year_and_next_year_select_options = () => {
  const currentYear = new Date().getFullYear() + 543;
  const nextYear = currentYear + 1;
  return [
    {
      name: currentYear.toString(),
      value: currentYear.toString()
    },
    {
      name: nextYear.toString(),
      value: nextYear.toString()
    }
  ];
};

const getBePreviousYearUtilNextYearOptions = () => {
  const currentYear = new Date().getFullYear() + 543;
  const previousYear = currentYear - 1;
  const nextYear = currentYear + 1;
  return [
    {
      name: previousYear.toString(),
      value: previousYear.toString()
    },
    {
      name: currentYear.toString(),
      value: currentYear.toString()
    },
    {
      name: nextYear.toString(),
      value: nextYear.toString()
    }
  ];
};

const getOnlyTime = (dateTime, separator = ':') => {
  const date = new Date(dateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}${separator}${minutes}`;
};

const getOnlyPreviousYearAndThisYearOptions = () => {
  const currentYear = new Date().getFullYear() + 543;
  const previousYear = currentYear - 1;
  return [
    {
      name: previousYear.toString(),
      value: previousYear.toString()
    },
    {
      name: currentYear.toString(),
      value: currentYear.toString()
    }
  ];
};

export {
  get_buddies_era_select_options,
  get_buddies_era_this_year_and_next_year_select_options,
  getBePreviousYearUtilNextYearOptions,
  getOnlyTime,
  getOnlyPreviousYearAndThisYearOptions
};
