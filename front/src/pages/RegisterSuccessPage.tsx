import { useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function RegisterSuccessPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const { email } = location.state || {};

    useEffect(() => {

        if (!email) {
            navigate('/');
        }
    }, [email]);

    return (
        <div className="register_success">

            <div>
                <h1>Registration Successful!</h1>
                <p>Your account has been successfully registered.</p>
                <p>Email: <strong>{email}</strong></p>
            </div>

        </div>
    )

}

export default RegisterSuccessPage;