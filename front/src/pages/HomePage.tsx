import { useUser } from "../contexts/UserContext";
import FetchComponent from '../components/FetchComponent'

function HomePage() {

    const { userData } = useUser();

    return (
        <div>
            Welcome {userData ? userData.username : 'Guest' }!
            <FetchComponent></FetchComponent>
        </div>
    )

}

export default HomePage;