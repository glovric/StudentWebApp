type JWT = {
    access: string,
    refresh: string
}

// Obtaining CSRF token (CORS stuff)
export const getCSRFToken = async () => {
    const response = await fetch('http://localhost:8000/csrf-token/', {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    return data.csrfToken; // Return the CSRF token
};

export const refreshAccessToken = async () => {

    const refreshToken = getJWT().refresh;

    if (!refreshToken) {
        return null;
    }

    try {

        const response = await fetch('http://localhost:8000/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        return data.access;

    } catch (error) {

        console.error('Error refreshing access token:', error);
        removeJWT();
        return null;
        
    }

};

export const setJWT = (token: JWT) => {
    localStorage.setItem('accessToken', token.access);
    localStorage.setItem('refreshToken', token.refresh);
}

export const getJWT = () => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    return { access, refresh }
}

export const removeJWT = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}