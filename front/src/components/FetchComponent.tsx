import { useEffect, useState } from "react";

type Student = {
    id: number;
    name: string;
    surname: string;
    dob: string;
    mail: string;
    password: string;
  };

type Course = {
    id: number;
    name: string;
    points: number;
}

function FetchComponent() {

    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {

        const fetchStudentData = async () => {
            const student_response = await fetch('http://localhost:8000/students/');
            const student_data = await student_response.json();
            setStudents(student_data);
        };

        const fetchCoursesData = async () => {
            const courses_response = await fetch('http://localhost:8000/courses/');
            const courses_data = await courses_response.json();
            setCourses(courses_data);
        };

        fetchStudentData();
        fetchCoursesData();

    }, []);


    return (

        <div>
        
        {students.map((student) => (
            <div key={student.id}>
                <h3>{student.id} {student.name}</h3>
            </div>
        ))}

        {courses.map((course) => (
            <div key={course.id}>
                <h3>{course.id} {course.name} {course.points}</h3>
            </div>
        ))}

        </div>
        
    );

}

export default FetchComponent