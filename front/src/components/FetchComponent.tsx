import { useEffect, useState } from "react";

type Course = {
    id: number;
    name: string;
    points: number;
}

function FetchComponent() {

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {

        const fetchCoursesData = async () => {
            const courses_response = await fetch('http://localhost:8000/courses/');
            const courses_data = await courses_response.json();
            setCourses(courses_data);
        };

        fetchCoursesData();

    }, []);


    return (

        <div>

        {courses.map((course) => (
            <div key={course.id}>
                <h3>{course.id} {course.name} {course.points}</h3>
            </div>
        ))}

        </div>
        
    );

}

export default FetchComponent