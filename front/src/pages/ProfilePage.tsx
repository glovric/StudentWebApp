import { useUser } from "../misc/UserContext";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useElementOnScreen } from "../misc/useElementOnScreen";


function ProfilePage() {

    const { userData } = useUser();
    useElementOnScreen(".profile-info", "slide-in-up", {threshold: 0.5});

    const navigate = useNavigate();

    useEffect(() => {

        if (!userData) {
            navigate('/');
        }

        const divElements = document.querySelectorAll('.profile-info > div');
        const totalElements = divElements.length;

        // Iterate through the total number of elements
        for (let i = 0; i < totalElements; i++) {
            setTimeout(() => {
                divElements[i].classList.add('show'); // Show the div element
            }, i * 100); // Adjust timing as needed
        }


    }, [userData]);

    return (
        <div className="profile">
            <div className="profile-info">
                <h1>User information</h1>
                <div className="left">Username: {userData?.username}</div>
                <div className="right">Mail address: {userData?.email}</div>
                <div className="left">First name: {userData?.first_name}</div>
                <div className="right">Last name: {userData?.last_name}</div>
                <div className="left">User type: {userData?.user_type}</div>
            </div>
        </div>
    );

}

export default ProfilePage;