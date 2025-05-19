import { lazy } from 'react';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import ProtectedRoute from '../component/function/ProtectedRoute';


// Flashcards
const FlashcardDashboard = Loadable(lazy(() => import('../views/flashcards/FlashcardDashboard')));
const FlashcardCategories = Loadable(lazy(() => import('../views/flashcards/FlashcardCategories')));
const FlashcardDeck = Loadable(lazy(() => import('../views/flashcards/FlashcardDeck')));
const FlashcardReview = Loadable(lazy(() => import('../views/flashcards/FlashcardReview')));
const FlashcardQuiz = Loadable(lazy(() => import('../views/flashcards/FlashcardQuiz')));
const FlashcardCreate = Loadable(lazy(() => import('../views/flashcards/FlashcardCreate')));
const LearningStats = Loadable(lazy(() => import('../views/flashcards/LearningStats')));

// Dictionary
const Dictionary = Loadable(lazy(() => import('../views/dictionary/Dictionary')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute element={MainLayout} />,
  children: [
    {
      path: 'student',
      children: [
        {
          // ระบบท่องคำศัพท์
          path: 'flashcards',
          children: [
            {
              path: '',
              element: <FlashcardDashboard />
            },
            {
              path: 'categories',
              element: <FlashcardCategories />
            },
            {
              path: 'deck/:categoryId',
              element: <FlashcardDeck />
            },
            {
              path: 'review',
              element: <FlashcardReview />
            },
            {
              path: 'quiz',
              element: <FlashcardQuiz />
            },
            {
              path: 'create',
              element: <FlashcardCreate />
            }
          ]
        },
        {
          // พจนานุกรม
          path: 'dictionary',
          element: <Dictionary />
        },
        {
          // สถิติการเรียนรู้
          path: 'learning-stats',
          element: <LearningStats />
        }
      ]
    }
  ]
};

export default MainRoutes;