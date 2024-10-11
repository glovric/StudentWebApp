import { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    // For switching pages
    const navigate = useNavigate();

    // Probably non React way of obtaining form values
    const extractFormData = (e: FormEvent<HTMLFormElement>) => {
        // Probably non React way of obtaining form values
        const form = e.currentTarget;
        const username = (form.elements.namedItem('username') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        return {username, password};
    }

    // Obtaining CSRF token (CORS stuff)
    const getCSRFToken = async () => {
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

    // Testing JWT token
    const handleProtected = async () => {

        var accessToken = localStorage.getItem('accessToken');

        try {

            const response = await fetch('http://localhost:8000/protected/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Include the JWT in the Authorization header
                    'Content-Type': 'application/json', // Set the content type
                },
            });

            if (response.status === 401) {
                // If unauthorized, refresh the access token
                accessToken = await refreshAccessToken();
                if(accessToken) {console.log("Access token renewed.");}
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

        } catch (err) {
            console.log(err);
        }
    };

    // Login handling
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = extractFormData(e);
        
        try {

            // Get csrf token
            //const csrfToken = await getCSRFToken();

            // Send request to /login
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'X-CSRFToken': csrfToken,
                },
                //credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                const { access, refresh } = result;
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                console.log('Login successful!');
                navigate('/');
            } else {
                console.log(`Login failed: ${result.message}`);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    };

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.log("User logged out.");
        navigate('/login');
    }

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
    
        if (!refreshToken) {
            console.error('No refresh token found. User needs to log in again.');
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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return null;
            
        }

    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>

                <div>Mail:</div>

                <input 
                    type="text" 
                    id="username" 
                    required>
                </input>

                <div>Password:</div>

                <input 
                    type="password"
                    id="password"
                    required>
                </input>

                <button type="submit">Submit</button>
            </form>

            <button onClick={handleProtected}>Test JWT token</button>
            <button onClick={handleLogOut}>Log Out</button>

        </div>
    )

}

export default LoginPage;