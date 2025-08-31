import axios from '../utils/axios';

export const sendEmail = async (data) => {
  try {
    const response = await axios.post('/api/email/send', data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error.response?.data || error.message;
  }
}; 