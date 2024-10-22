import { useUser } from "../contexts/UserContext";
import StudentDashboardComponent from '../components/StudentDashboardComponent';
import TeacherDashboardComponent from '../components/TeacherDashboardComponent';

type Student = {
    username: string;
    email: string;
    academic_id: string,
    user_id: number
}

function DashboardPage() {

    const { userData } = useUser();

    if (userData?.user_type === "student") {
        return <StudentDashboardComponent />;
    }
    else if (userData?.user_type === "teacher") {
        return <TeacherDashboardComponent/>
    }
    else {
        return(
            <div>Ovo je Dashboard.</div>
        );
    }

}

export default DashboardPage;