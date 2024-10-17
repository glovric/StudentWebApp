import { useEffect, useState } from 'react';
import { getJWT, refreshAccessToken } from '../tokens/Tokens';

type Student = {
    username: string;
    email: string;
    academic_id: string,
    user_id: number
}

function DashboardPage() {

    const [students, setStudents] = useState<Student[] | []>([]);

    const getPermission = async () => {
        
        try {

            const token = getJWT().access;

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/dashboard/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,

                },
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                console.log("Response u Dashboardu:", result);
                setStudents(result);
            } else {
                console.log("Dashboard failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    useEffect(() => {
        getPermission();
    }, []);

    return (
        <div>
            <h1>Student List</h1>
            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <ul>
                    {students.map((student, index) => (
                        <li key={index}>
                            <strong>Username:</strong> {student.username}, 
                            <strong>Email:</strong> {student.email}, 
                            <strong>Academic ID:</strong> {student.academic_id}
                            <strong>User ID:</strong> {student.user_id}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

export default DashboardPage;