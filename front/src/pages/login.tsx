import { FormEvent, ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const navigate = useNavigate();

    const extractFormData = (e: FormEvent<HTMLFormElement>) => {
        // Probably non React way of obtaining form values
        const form = e.currentTarget;
        const username = (form.elements.namedItem('username') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        return {username, password};
    }

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = extractFormData(e);
        
        try {

            const csrfToken = await getCSRFToken();

            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
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
        </div>
    )

}

export default LoginPage;