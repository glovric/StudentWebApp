import { useUser } from "../contexts/UserContext";
import campus from "../assets/campus.jpg";
import courses from "../assets/courses.jpg";
import professors from "../assets/professors.png";
import research from "../assets/research.jpg";
import uni from "../assets/uni.jpg";

function HomePage() {

    const { userData } = useUser();

    const location = "48.858844,2.294351"; // Replace with your desired coordinates
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${location}`;

    return (
        <div>
            <h1>Welcome to FaKZ, {userData ? userData.username : 'Guest' }!</h1>

            <div className="home-page-container">

                <div className="left container-item">
                    <div>
                        <h2>Overview</h2>
                        <p>FaKZ is an independent and self-governing educational institution dedicated to fostering academic 
                        excellence and innovation. Our commitment to providing a diverse and modern curriculum positions 
                        us as a leader in higher education.</p>
                    </div>
                    <img src={uni}></img>
                </div>

                <div className="right container-item">
                    <iframe className="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d695.1864248173173!2d16.00983219105774!3d45.81635111842127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d7b6f73c7a9d%3A0x2b1f85df3bde668!2sTrgova%C4%8Dka%20%C5%A1kola%20Zagreb!5e0!3m2!1shr!2shr!4v1729333165603!5m2!1shr!2shr"
                            allowFullScreen
                            loading="lazy"
                            title="Google Map"
                    ></iframe>
                    <div>
                        <h2>Location</h2>
                        <p>FaKZ headquarters is located in Maksimir, Zagreb, with additional departments throughout the city. 
                            Other departments can be found in Dubrava, Pantovčak, Šalata, Bukovac to name a few.
                        </p>
                    </div>
                </div>

                <div className="left container-item">
                    <div>
                    <h2>Courses Offered</h2>
                    <p>
                        We offer a wide array of up-to-date courses in various fields, including: <br/>

                        Economics: <br/>
                        Specializations in Microeconomics, Macroeconomics, International Trade, and Financial Analysis.<br/><br/>

                        Computer Science:<br/>
                        Courses in Software Development, Data Science, Artificial Intelligence, and Cybersecurity.<br/><br/>

                        Medicine:<br/>
                        Programs covering Clinical Medicine, Public Health, Medical Research, and Health Administration.<br/><br/>

                        Electrical Engineering:<br/>
                        Focus areas in Renewable Energy, Robotics, Telecommunications, and Circuit Design.<br/><br/>

                        Mathematics:<br/>
                        Studies in Pure Mathematics, Applied Mathematics, Statistics, and Mathematical Modeling.<br/><br/>

                        Chemistry:<br/>
                        Curriculum includes Organic Chemistry, Biochemistry, Analytical Chemistry, and Environmental Chemistry.
                    </p>
                    </div>
                    <img src={courses}></img>
                </div>

                <div className="right container-item">
                    <img src={professors}></img>
                    <div>
                        <h2>Faculty</h2>
                        <p>
                            Our lecturers are professionals with years of experience in their respective fields.
                            Our lecturers are seasoned professionals with extensive experience in academia and industry. They bring practical insights and mentorship to the classroom, enhancing the learning experience.
                        </p>
                    </div>
                </div>

                <div className="left container-item">
                    <div>
                        <h2>Campus Life</h2>
                        <p>FaKZ promotes a vibrant campus culture with various student organizations, clubs, and events. Opportunities for internships, research projects, and community engagement ensure that our students gain valuable real-world experience.</p>
                    </div>
                    <img src={campus}></img>
                </div>

                <div className="right container-item">
                    <img src={research}></img>
                    <div>
                        <h2>Research and Innovation</h2>
                        <p>We are committed to advancing knowledge through research. FaKZ encourages interdisciplinary collaboration and supports innovative projects that address contemporary challenges in science, technology, and society.</p>
                    </div>
                </div>

                <div className="left container-item">
                Contact Information

                Website: www.fakz.edu
                Email: admissions@fakz.edu
                Phone: +385 (0)1 234 5678
                </div>

            </div>
        </div>
    )

}

export default HomePage;