import { IconDashboard, IconKey, IconHome, IconChartLine } from '@tabler/icons-react';
import TranslateIcon from '@mui/icons-material/Translate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import QuizIcon from '@mui/icons-material/Quiz';
import AddCardIcon from '@mui/icons-material/AddCard';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SchoolIcon from '@mui/icons-material/School';
import StarRateIcon from '@mui/icons-material/StarRate';
import BarChartIcon from '@mui/icons-material/BarChart';

// constant
const icons = {
  IconDashboard,
  IconKey,
  IconHome,
  IconChartLine,
  TranslateIcon,
  MenuBookIcon,
  CategoryIcon,
  QuizIcon,
  AddCardIcon,
  FlashOnIcon,
  SchoolIcon,
  StarRateIcon,
  BarChartIcon
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard/default',
  type: 'group',
  children: [
    {
      id: 'learning-stats',
      title: 'สถิติการเรียนรู้',
      type: 'item',
      url: '/student/learning-stats',
      icon: BarChartIcon,
      breadcrumbs: false
    },

    // เมนูหลักสำหรับระบบท่องคำศัพท์
    {
      id: 'flashcard',
      title: 'ระบบท่องคำศัพท์',
      type: 'collapse',
      icon: FlashOnIcon,
      children: [
        {
          id: 'flashcard-dashboard',
          title: 'ภาพรวมการเรียนรู้',
          type: 'item',
          url: '/student/flashcards',
          icon: SchoolIcon
        },
        {
          id: 'flashcard-categories',
          title: 'หมวดหมู่คำศัพท์',
          type: 'item',
          url: '/student/flashcards/categories',
          icon: CategoryIcon
        },
        {
          id: 'flashcard-review',
          title: 'ทบทวนคำศัพท์',
          type: 'item',
          url: '/student/flashcards/review',
          icon: MenuBookIcon
        },
        {
          id: 'flashcard-quiz',
          title: 'แบบทดสอบคำศัพท์',
          type: 'item',
          url: '/student/flashcards/quiz',
          icon: QuizIcon
        },
        {
          id: 'flashcard-create',
          title: 'สร้างชุดคำศัพท์',
          type: 'item',
          url: '/student/flashcards/create',
          icon: AddCardIcon
        }
      ]
    },

    {
      id: 'dictionary',
      title: 'พจนานุกรม',
      type: 'item',
      url: '/student/dictionary',
      icon: TranslateIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
