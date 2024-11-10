import { Link } from "react-router-dom"
import myImage from '../assets/fakz_icon.jpg';
import { useUser } from "../misc/UserContext";
import { removeJWT } from '../misc/Tokens';
import { useNavigate } from 'react-router-dom';

function Navbar() {

    const { userData, setUserData } = useUser();

    const navigate = useNavigate();

    const handleLogOut = () => {
        removeJWT();
        setUserData(null);
        console.log("User logged out.");
        navigate('/login');
    }

    return (

        <nav className="navbar">

            <div>
                <img src={myImage}></img>
            </div>

            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/courses">Courses</Link>
                </li>
                {userData === null && (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                )}
                {userData === null && (
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                )}
                {userData !== null && (
                    <li>
                        <Link to="/profile">My Profile</Link>
                    </li>
                )}
                {userData?.user_type === "teacher" && (
                    <li>
                        <Link to="/dashboard">Teacher Dashboard</Link>
                    </li>
                )}
                {userData?.user_type === "student" && (
                    <li>
                        <Link to="/dashboard">Student Dashboard</Link>
                    </li>
                )}
            </ul>

            {userData !== null && (
                <div className="upper-right">
                    Greetings, {userData.username}!
                    <button onClick={handleLogOut}>Log out</button>
                </div>
            )}
        </nav>

    )

}

export default Navbar