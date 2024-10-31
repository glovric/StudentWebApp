import { Link } from "react-router-dom"
import myImage from '../assets/fakz_icon.jpg';
import { useUser } from "../misc/UserContext";


function Navbar() {

    const { userData } = useUser();

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
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
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
        </nav>

    )

}

export default Navbar