import axios from 'axios';
import { showAlert } from './alerts';

// type is either data or password
export const updateSettings = async (data, type) => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/users/${
      type === 'data' ? 'updateMe' : 'updatePassword'
    }`;
    console.log(url, '<---url');
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
    console.log(res, 'patch result of user data');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
