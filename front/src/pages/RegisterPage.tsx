import { FormEvent, ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import zxcvbn from "zxcvbn";
import { useElementOnScreen } from "../misc/useElementOnScreen";
import { getCSRFToken } from "../misc/Tokens";


function RegisterPage() {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    useElementOnScreen(".form", "slide-in", {threshold: 0.1});

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
                const { email, username } = result; // Extract email from response
                navigate('/register-success', { state: { email, username } });
            } else {
                console.error(`Registration failed: ${result.message}`);
                setErrorMessage(result.message);
            }

        } catch (error) {
            console.error(`An error occurred: ${(error as Error).message}`);
        }
    }

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

            <form className="form" onSubmit={handleSubmit}>

                    <h3>First name:</h3>
                    <input 
                        type="text" 
                        id="first_name" 
                        required>
                    </input>

                    <h3>Last name:</h3>
                    <input 
                        type="text" 
                        id="last_name" 
                        required>
                    </input>

                    <h3>Password:</h3>
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

                <button type="submit">Register</button>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display the error message */}

            </form>

        </div>
    )

}

export default RegisterPage;