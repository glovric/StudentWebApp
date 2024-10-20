import { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { getJWT, refreshAccessToken, setJWT, removeJWT } from '../tokens/Tokens';
import { useUser } from "../contexts/UserContext";
import { useElementOnScreen } from "../hooks/useElementOnScreen";


function LoginPage() {

    const { fetchUserData, setUserData } = useUser();
    useElementOnScreen(".form", "slide-in-up", {threshold: 0.1});

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

    // Testing JWT token
    const handleProtected = async () => {

        var accessToken = getJWT().access;

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

            // Send request to /login
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                const { access, refresh } = result;
                setJWT({ access, refresh });
                fetchUserData();
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
        removeJWT();
        setUserData(null);
        console.log("User logged out.");
        navigate('/login');
    }

    return (
        <div className="login">
            <form className="form" onSubmit={handleSubmit}>

                <h3>Mail:</h3>

                <input 
                    type="text" 
                    id="username" 
                    required>
                </input>

                <h3>Password:</h3>

                <input 
                    type="password"
                    id="password"
                    required>
                </input>

                <button type="submit">Submit</button>
                <button onClick={handleProtected}>Test JWT token</button>
                <button onClick={handleLogOut}>Log Out</button>
            </form>

        </div>
    )

}

export default LoginPage;