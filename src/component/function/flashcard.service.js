import axios from 'axios';
export const baseUrlWithToken = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

// เพิ่ม token ในทุก request
baseUrlWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    } else {
      throw new Error('ไม่พบ token โปรดเข้าสู่ระบบใหม่');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === หมวดหมู่คำศัพท์ (Categories) ===

// ดึงหมวดหมู่ทั้งหมด
export const getAllCategories = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// ดึงข้อมูลหมวดหมู่ตาม ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await baseUrlWithToken.get(`/flashcards/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// สร้างหมวดหมู่ใหม่
export const createCategory = async (categoryData) => {
  try {
    const response = await baseUrlWithToken.post('/flashcards/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// === คำศัพท์ (Flashcards) ===

// ดึงคำศัพท์ในหมวดหมู่
export const getFlashcardsByCategory = async (categoryId) => {
  try {
    const response = await baseUrlWithToken.get(`/flashcards/categories/${categoryId}/flashcards`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

// สร้างคำศัพท์ใหม่
export const createFlashcard = async (categoryId, flashcardData) => {
  try {
    const response = await baseUrlWithToken.post(`/flashcards/categories/${categoryId}/flashcards`, flashcardData);
    return response.data;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

// สร้างคำศัพท์หลายคำพร้อมกัน
export const createMultipleFlashcards = async (categoryId, cards) => {
  try {
    const response = await baseUrlWithToken.post(`/flashcards/categories/${categoryId}/flashcards/batch`, { cards });
    return response.data;
  } catch (error) {
    console.error('Error creating multiple flashcards:', error);
    throw error;
  }
};

// === การทบทวน (Review) ===

// ดึงคำศัพท์ที่ต้องทบทวน
export const getDueReviewCards = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/review-due');
    return response.data;
  } catch (error) {
    console.error('Error fetching due review cards:', error);
    throw error;
  }
};

// บันทึกผลการทบทวน
export const submitReviewResult = async (flashcardId, isCorrect, timeTaken) => {
  try {
    const response = await baseUrlWithToken.post(`/flashcards/review/${flashcardId}`, { isCorrect, timeTaken });
    return response.data;
  } catch (error) {
    console.error('Error submitting review result:', error);
    throw error;
  }
};

// ตั้งค่ารายการโปรด
export const toggleFavorite = async (flashcardId) => {
  try {
    const response = await baseUrlWithToken.post(`/flashcards/favorite/${flashcardId}`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// === แบบทดสอบ (Quiz) ===

// สร้างแบบทดสอบ
export const createQuiz = async (params = {}) => {
  try {
    const response = await baseUrlWithToken.post('/flashcards/quiz', params);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// บันทึกผลการทำแบบทดสอบ
export const submitQuizResult = async (results, totalTime) => {
  try {
    const response = await baseUrlWithToken.post('/flashcards/quiz/submit', { results, totalTime });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    throw error;
  }
};

// === สถิติการเรียนรู้ (Stats) ===

// ดึงสถิติการเรียนรู้
export const getLearningStats = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching learning stats:', error);
    throw error;
  }
};

// ดึงข้อมูลคำศัพท์ที่เรียนล่าสุด
export const getRecentStudiedCards = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/stats/recent');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent studied cards:', error);
    throw error;
  }
};

// ดึงข้อมูลคำศัพท์ที่ยากที่สุด
export const getHardestCards = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/stats/hardest');
    return response.data;
  } catch (error) {
    console.error('Error fetching hardest cards:', error);
    throw error;
  }
};

// ดึงข้อมูลการกระจายตัวของหมวดหมู่
export const getCategoryDistribution = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/stats/category-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    throw error;
  }
};
// // เพิ่มฟังก์ชันใหม่
// export const addToReview = async (flashcardId) => {
//   try {
//     const response = await axiosClient.post(`/flashcards/add-to-review/${flashcardId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding to review:', error);
//     throw error;
//   }
// };

export const getAllReviewableCards = async () => {
  try {
    const response = await baseUrlWithToken.get('/flashcards/all-reviewable');
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviewable cards:', error);
    throw error;
  }
};

export const addToReview = async (flashcardId) => {
  try {
    const response = await baseUrlWithToken.post(`/flashcards/add-to-review/${flashcardId}`);
    return response.data;
  } catch (error) {
    // จัดการข้อผิดพลาดให้ละเอียดยิ่งขึ้น
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
      throw new Error(error.response.data.message || 'Failed to add to review');
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error('Failed to setup request. Please try again.');
    }
  }
};
