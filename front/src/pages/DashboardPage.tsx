import { useUser } from "../misc/UserContext";
import StudentDashboardComponent from '../components/StudentDashboardComponent';
import TeacherDashboardPage from "./TeacherDashboardPage";

function DashboardPage() {

    const { userData } = useUser();

    if (userData?.user_type === "student") {
        return <StudentDashboardComponent />;
    }
    else if (userData?.user_type === "teacher") {
        return <TeacherDashboardPage/>
    }
    else {
        return(
            <div>Ovo je Dashboard.</div>
        );
    }

}

export default DashboardPage;