export const setUserData = (user) => {
    if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
    } else {
        localStorage.removeItem('userData');
    }
};

export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

export const getUserRole = () => {
    const user = getUserData();
    return user ? user.role : null;
};

export const clearUserData = () => {
    localStorage.removeItem('userData');
};