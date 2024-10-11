import { FormEvent, ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import zxcvbn from "zxcvbn";

function RegisterPage() {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

        setErrorMessage(null); // Reset the error message before new submission

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
                const { email } = result; // Extract email from response
                navigate('/register-success', { state: { email } });
            } else {
                console.log(`Registration failed: ${result.message}`);
                setErrorMessage(result.message);
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

    const [strengthScore, setStrengthScore] = useState(-1);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {

        const newPassword = e.target.value;

        if(newPassword.length == 0) {
            setStrengthScore(-1);
        } 
        else {
            const evaluation = zxcvbn(newPassword);
            setStrengthScore(evaluation.score); // Score between 0 and 4
        }
        

    };

    const getColor = (score: number) => {
        switch (score) {
          case 0:
            return "red";    // Very Weak
          case 1:
            return "orange"; // Weak
          case 2:
            return "yellow"; // Fair
          case 3:
            return "lightgreen"; // Good
          case 4:
            return "green";  // Strong
          default:
            return "gray";   // Default color
        }
    };

    return (
        <div className="register">

            <form onSubmit={handleSubmit}>

                <div className="input-field">
                    <div>First name:</div>
                    <input 
                        type="text" 
                        id="first_name" 
                        required>
                    </input>
                </div>

                <div className="input-field">
                    <div>Last name:</div>
                    <input 
                        type="text" 
                        id="last_name" 
                        required>
                    </input>
                </div>

                <div className="input-field">
                    <div>Password:</div>
                    <input 
                        type="password" 
                        id="password"
                        onChange={handlePasswordChange}
                        required>
                    </input>

                    <div className="password-strength-bar">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div key={index}
                             className="single-bar"
                             style={{backgroundColor: index <= strengthScore ? getColor(index) : "#e0e0e0"}}
                        />
                    ))}
                    </div>
                </div>

                <button type="submit">Register</button>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display the error message */}

            </form>

        </div>
    )

}

export default RegisterPage;