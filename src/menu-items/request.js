// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  // title: 'Pages',
  // caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Request',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'tef',
          title: 'TEF Athlete',
          type: 'item',
          url: '/pages/login/login3',
          target: true
        },
        {
          id: 'fei',
          title: 'FEI Athlete',
          type: 'item',
          url: '/pages/register/register3',
          target: true
        },
        {
            id: 'veterinarian',
            title: 'Veterinarian',
            type: 'item',
            url: '/pages/register/register3',
            target: true
          }
      ]
    }
  ]
};

export default pages;
