import { useState, FC } from 'react';
import type { Course } from '../misc/Types';

type CourseProps = {
    course: Course;
    deleteFromCourse: (enrollmentId: number, courseName: string, studentName: string) => Promise<void>;
    handleEnrollStudent: (courseID: number, courseName: string, studentID: number, studentName: string) => Promise<void>;
    deleteCourse: (courseID: number) => Promise<void>;
};

const TeacherCourseComponent: FC<CourseProps> = ({ course, deleteFromCourse, handleEnrollStudent, deleteCourse }) => {

    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

    const handleSelectChange = (studentId: number | null) => {
        setSelectedStudent(studentId);
    };

    const handleEnrollClick = () => {
        if (selectedStudent !== null) {
            const student = course.not_enrolled_students.find(s => s.id === selectedStudent);
            if (student) {
                handleEnrollStudent(course.id, course.name, selectedStudent, student.name);
            }
        }
    };
    

    return (
        <div className='teacher-course' key={course.id}>
            <div className='course-heading'>
                <h2 className='centered-item'>{course.name}</h2>
                <button className='right-item' onClick={() => deleteCourse(course.id)}>Delete course</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Mail</th>
                        <th>Academic ID</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {course.enrolled_students.length > 0 ? (
                        course.enrolled_students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.academic_id}</td>
                                <td>
                                    <button onClick={() => deleteFromCourse(student.enrollment_id!, course.name, student.name)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No students enrolled.</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={3}>
                            <select value={selectedStudent || ''}  onChange={(e) => handleSelectChange(Number(e.target.value))}>
                                <option value="">Select a student</option>
                                {course.not_enrolled_students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.academic_id})
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button onClick={handleEnrollClick} disabled={selectedStudent === null}>Enroll</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TeacherCourseComponent;
