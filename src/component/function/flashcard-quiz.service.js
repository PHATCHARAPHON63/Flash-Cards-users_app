import axios from 'axios';

// API endpoint
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// สร้าง axios instance พร้อม token
const createAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * สร้างแบบทดสอบ
 * @param {Object} quizData - ข้อมูลแบบทดสอบที่ต้องการสร้าง
 * @returns {Promise<Object>} - ข้อมูลแบบทดสอบที่สร้างขึ้น
 */
export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_URL}/flashcards/quiz`, quizData, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

/**
 * ส่งผลการทำแบบทดสอบ
 * @param {Object} resultData - ข้อมูลผลการทำแบบทดสอบ
 * @returns {Promise<Object>} - ผลลัพธ์การบันทึกข้อมูล
 */
export const submitQuizResults = async (resultData) => {
  try {
    const response = await axios.post(`${API_URL}/flashcards/quiz/submit`, resultData, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    throw error;
  }
};

/**
 * ดึงสถิติการทำแบบทดสอบของผู้ใช้
 * @returns {Promise<Object>} - ข้อมูลสถิติการทำแบบทดสอบ
 */
export const getQuizStatistics = async () => {
  try {
    const response = await axios.get(`${API_URL}/flashcards/stats`, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting quiz statistics:', error);
    throw error;
  }
};

/**
 * ดึงข้อมูลคำศัพท์ที่ยากที่สุดสำหรับผู้ใช้
 * @returns {Promise<Array>} - รายการคำศัพท์ที่ยากที่สุด
 */
export const getHardestWords = async () => {
  try {
    const response = await axios.get(`${API_URL}/flashcards/stats/hardest`, createAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting hardest words:', error);
    throw error;
  }
};
