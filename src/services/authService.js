import axios from 'axios';

const API_URL = 'http://localhost:8080'; // 根据您的后端地址进行调整

// 请求拦截器添加认证头
axios.interceptors.request.use(
  (config) => {
    // 从 sessionStorage 获取 token（如果有的话）
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user) {
      config.withCredentials = true; // 确保包含 cookies
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器处理错误
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 未授权，重定向到登录页
      sessionStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const register = async (userAccount, userPassword, checkPassword, planetCode) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, {
      userAccount,
      userPassword,
      checkPassword,
      planetCode
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// 更新后的注册函数，处理包含所有新字段的FormData
const registerComplete = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const login = async (userAccount, userPassword) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, {
      userAccount,
      userPassword
    }, { withCredentials: true });
    
    if (response.data.code === 0 && response.data.data) {
      sessionStorage.setItem('currentUser', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
    sessionStorage.removeItem('currentUser');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/current`, { withCredentials: true });
    
    if (response.data.code === 0 && response.data.data) {
      sessionStorage.setItem('currentUser', JSON.stringify(response.data.data));
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('currentUser');
    }
    return null;
  }
};

const searchUsers = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/user/search`, {
      params: { username },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// 修改后的删除用户函数
const deleteUser = async (idObj) => {
  try {
    const response = await axios.post(`${API_URL}/user/delete`, idObj, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const isAdmin = () => {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  return user && user.userRole === 1;
};

const isLoggedIn = () => {
  return !!sessionStorage.getItem('currentUser');
};

export const authService = {
  register,
  registerComplete, // 新的完整注册函数
  login,
  logout,
  getCurrentUser,
  searchUsers,
  deleteUser,
  isAdmin,
  isLoggedIn
};

export default authService;