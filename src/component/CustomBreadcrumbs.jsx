import { Box, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

const CustomBreadcrumbs = ({ breadcrumbItems = [] }) => {
  const lastItem = breadcrumbItems.length - 1;
  const isOneItem = breadcrumbItems.length === 1;

  return (
    <Box sx={{ display: 'flex' }}>
      {breadcrumbItems.map(({ name, path }, i) => {
        const isBold = i !== lastItem || isOneItem;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }} key={i}>
            <BreadcrumbItem name={name} path={path} isBold={isBold} />
            {i !== lastItem && <Typography sx={{ color: '#3C3C3A', fontSize: '18px', marginRight: '3px' }}>&#10095;</Typography>}
          </Box>
        );
      })}
    </Box>
  );
};
export default CustomBreadcrumbs;

const BreadcrumbItem = ({ name, path, isBold }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (path === 'goBack') {
      navigate(-1); // go back to previous page
    } else if (path) {
      navigate(path);
    }
  };

  return path ? (
    <Typography sx={{ color: '#3C3C3A', fontSize: '20px', fontWeight: isBold ? 800 : 400, cursor: 'pointer' }} onClick={handleClick}>
      {name}
    </Typography>
  ) : (
    <Typography sx={{ color: '#3C3C3A', fontSize: '20px', fontWeight: isBold ? 800 : 400 }}>{name}</Typography>
  );
};
// 05255b
