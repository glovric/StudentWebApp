type Student = {
    id: number;
    name: string;
    academic_id: string;
    enrollment_id?: number;  // Optional since not all students will have an enrollment ID
};

type Course = {
    id: number;
    name: string;
    enrolled_students: Student[];
    not_enrolled_students: Student[];
};

export type { Student, Course };