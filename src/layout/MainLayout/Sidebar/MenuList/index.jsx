import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NavCollapse from './NavCollapse';
import NavItem from './NavItem';
import NavGroup from './NavGroup';

const MenuList = ({ menuItems }) => {
  const items = menuItems?.children || [];
  if (!items || items.length === 0) {
    return (
      <Typography variant="h6" color="error" align="center">
        No menu items
      </Typography>
    );
  }
  return items.map((item) => {
    // console.log('MenuList - Processing item:', item);
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={1} />;
      default:
        console.error('Unknown menu item type:', item.type);
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Item Error: Unknown type
          </Typography>
        );
    }
  });
};
MenuList.propTypes = {
  menuItems: PropTypes.object
};
export default MenuList;
