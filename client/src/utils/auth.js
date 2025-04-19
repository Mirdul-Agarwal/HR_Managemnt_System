export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
  
    if (!token || !loginTime) return false;
  
    const now = new Date().getTime();
    const twoHours = 2 * 60 * 60 * 1000;
  
    if (now - loginTime > twoHours) {
      localStorage.clear();
      return false;
    }
  
    return true;
  };
  