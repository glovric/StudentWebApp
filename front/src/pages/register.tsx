import { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

    // For switching pages
    const navigate = useNavigate();

    // Probably non React way of obtaining form values
    const extractFormData = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const first_name = (form.elements.namedItem('first_name') as HTMLInputElement).value;
        const last_name = (form.elements.namedItem('last_name') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        return {first_name, last_name, password};
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = extractFormData(e);
        
        try {

            // Get csrf token
            const csrfToken = await getCSRFToken();

            // Send request to /login
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // If response is ok (user exists), it returns JWT token
            if (response.ok) {
                console.log('Registration successful!');
                navigate('/login');
            } else {
                console.log(`Registration failed: ${result.message}`);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
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

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>

                <div>First name:</div>

                <input 
                    type="text" 
                    id="first_name" 
                    required>
                </input>

                <div>Last name:</div>

                <input 
                    type="text" 
                    id="last_name" 
                    required>
                </input>

                <div>Password:</div>

                <input 
                    type="password" 
                    id="password" 
                    required>
                </input>

                <button type="submit">Register</button>
            </form>

        </div>
    )

}

export default RegisterPage;