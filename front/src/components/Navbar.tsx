import { Link } from "react-router-dom"
import myImage from '../assets/fakz_icon.jpg';

function Navbar() {

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
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
            </ul>
        </nav>

    )

}

export default Navbar