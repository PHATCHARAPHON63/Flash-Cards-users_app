// material-ui
import { Link, Typography, Stack } from '@mui/material';
import Logo from '../../../../../assets/images/Tlogical_Logo_Navy.png';
// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="center">
    {/* <Typography
      sx={{
        fontSize: { xs: '10px', sm: '12px', md: '16px' },
        pt: 5
      }}
    >
      © 2024 Office of the Basic Education Commission.
      <span
        sx={{
          fontSize: '0.8rem'
        }}
      >
        Design & Develop by T.logical Resolution
        <a
          href="https://tlogical.com/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: '5px'
          }}
        >
          <img src={Logo} width={80} height={15} alt="logo" style={{ verticalAlign: 'middle' }} />
        </a>
      </span>
    </Typography> */}
  </Stack>
);

export default AuthFooter;
