import { useUser } from "../misc/UserContext";
import StudentDashboardComponent from '../components/StudentDashboardComponent';
import TeacherDashboardComponent from "../components/TeacherDashboardComponent";

function DashboardPage() {

    const { userData } = useUser();

    if (userData?.user_type === "student") {
        return <StudentDashboardComponent />;
    }
    else if (userData?.user_type === "teacher") {
        return <TeacherDashboardComponent />
    }
    else {
        return(
            <div>Welcome to Dashboard.</div>
        );
    }

}

export default DashboardPage;