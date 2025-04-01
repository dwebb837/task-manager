import axios from 'axios';

export const fetchTasks = async () => {
    const response = await axios.get('/api/tasks');
    return response.data;
};