import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase } from '@mui/material';
import UTIF from 'utif';
// project imports
import config from 'config';
import Logo from 'ui-component/Logo.jsx';
import { MENU_OPEN } from 'store/actions';
import React, { useState, useEffect } from 'react';
// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  const [backgroundImage, setBackgroundImage] = useState('');
  return (
    // <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
    //   <Logo />
    // </ButtonBase>
    <ButtonBase
      disableRipple
      //onClick={handleLogoClick}
      sx={{ cursor: 'pointer' }}
    >
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
