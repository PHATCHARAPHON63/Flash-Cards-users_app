export const createDangerHandlers = (setErrors, setFormData) => {
  const handleDangerType = (type, value) => {
    if (type.trim().length) {
      setErrors((errors) => ({
        ...errors,
        [type]: ''
      }));
    }
    console.log('type', type, value);

    if (type === 'details_disaster_type') {
      // Reset errors
      // setErrors({
      //   affected_person: '',
      //   attachments: '',
      //   crime_scene: '',
      //   date_of_event: '',
      //   details_danger: '',
      //   office_edu_area: '',
      //   parties_type1: '',
      //   parties_type2: '',
      //   report_to: '',
      //   safety_management_center: '',
      //   title_danger: ''
      // });

      if (value === 'โรค Covid-19') {
        setFormData((prevData) => ({
          ...prevData,
          deaths_num: '',
          male_num: '',
          total_victims: '',
          injured_num: '',
          female_num: '',
          affected_person: '',
          attachments: '',
          crime_scene: '',
          date_of_event: '',
          details_danger: '',
          office_edu_area: '',
          parties_type1: '',
          parties_type2: '',
          report_to: '',
          safety_management_center: '',
          title_danger: '',
          expectations: '',
          level: ''
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          symptoms: [],
          grade_level: ''
        }));
      }
    }
    if (type !== 'office_edu_area') {
      // setErrors((errors) => ({
      //   ...errors,
      //   [type]: ''
      // }));
    } else {
      if (value === 'ไม่ทราบเขตพื้นที่การศึกษา') {
        // setErrors((errors) => ({
        //   ...errors,
        //   safety_management_center: '',
        //   office_edu_area: ''
        // }));
      } else {
        // setErrors((errors) => ({
        //   ...errors,
        //   office_edu_area: ''
        // }));
      }
    }
  };

  return handleDangerType;
};
