import { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { setJWT } from '../misc/Tokens';
import { useUser } from "../misc/UserContext";
import { useElementOnScreen } from "../misc/useElementOnScreen";


function LoginPage() {

    const { fetchUserData } = useUser();
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
            </form>

        </div>
    )

}

export default LoginPage;