import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getResponse = async (text, faceImageBase64 = null) => {
  try {
    const response = await api.post('/chat', {
       text,
       face_image: faceImageBase64
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    return {
      response: "I'm having trouble connecting to the server. Is it running?",
      detected_emotion: 'neutral'
    };
  }
};

export default api;