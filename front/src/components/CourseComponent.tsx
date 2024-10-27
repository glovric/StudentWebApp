import React, { useState } from 'react';
import type { Course } from '../misc/Types';

type CourseProps = {
    course: Course;
    deleteFromCourse: (enrollmentId: number, courseName: string) => Promise<void>;
    handleEnrollStudent: (courseID: number, studentID: number, courseName: string) => Promise<void>;
};

const CourseComponent: React.FC<CourseProps> = ({ course, deleteFromCourse, handleEnrollStudent }) => {

    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

    const handleSelectChange = (studentId: number | null) => {
        setSelectedStudent(studentId);
    };

    return (
        <div key={course.id}>
            <h3>{course.name}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Academic ID</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {course.enrolled_students.length > 0 ? (
                        course.enrolled_students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.academic_id}</td>
                                <td>
                                    <button onClick={() => deleteFromCourse(student.enrollment_id!, course.name)}>
                                        Delete from course
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No students enrolled.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div>
                <label>Select a student to enroll:</label>
                <select 
                    value={selectedStudent || ''} 
                    onChange={(e) => handleSelectChange(Number(e.target.value))}
                >
                    <option value="">Select a student</option>
                    {course.not_enrolled_students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name} ({student.academic_id})
                        </option>
                    ))}
                </select>
                <button 
                    onClick={() => handleEnrollStudent(course.id, selectedStudent!, course.name)} 
                    disabled={selectedStudent === null}
                >
                    Enroll
                </button>
            </div>
        </div>
    );
};

export default CourseComponent;
