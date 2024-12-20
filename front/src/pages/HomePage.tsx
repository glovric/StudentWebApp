import campus from "../assets/campus.jpg";
import courses from "../assets/courses.jpg";
import professors from "../assets/professors.png";
import research from "../assets/research.jpg";
import uni from "../assets/uni.jpg";
import { useElementOnScreen } from "../misc/useElementOnScreen";
import { useEffect, useRef } from "react";

function HomePageMobile() {

    return (
            <div className="home-page-container">

                <div className="left item">
                    <div>
                        <h2>Overview</h2>
                        <p>FaKZ is an independent and self-governing educational institution dedicated to fostering academic 
                        excellence and innovation. Our commitment to providing a diverse and modern curriculum positions 
                        us as a leader in higher education.</p>
                    </div>
                    <img src={uni}></img>
                </div>

                <div className="right item">
                    <div>
                        <h2>Location</h2>
                        <p>FaKZ headquarters is located in Zagreb, Maksimir, with additional departments throughout the city. 
                        </p>
                    </div>
                    <iframe className="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d695.1864248173173!2d16.00983219105774!3d45.81635111842127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d7b6f73c7a9d%3A0x2b1f85df3bde668!2sTrgova%C4%8Dka%20%C5%A1kola%20Zagreb!5e0!3m2!1shr!2shr!4v1729333165603!5m2!1shr!2shr"
                            allowFullScreen
                            loading="eager"
                            title="Google Map"
                    ></iframe>
                </div>

                <div className="left item">
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

                <div className="right item">
                    <div>
                        <h2>Faculty</h2>
                        <p>
                            Our lecturers are professionals with years of experience in their respective fields.
                            Our lecturers are seasoned professionals with extensive experience in academia and industry. They bring practical insights and mentorship to the classroom, enhancing the learning experience.
                        </p>
                    </div>
                    <img src={professors}></img>
                </div>

                <div className="left item">
                    <div>
                        <h2>Campus Life</h2>
                        <p>FaKZ promotes a vibrant campus culture with various student organizations, clubs, and events. Opportunities for internships, research projects, and community engagement ensure that our students gain valuable real-world experience.</p>
                    </div>
                    <img src={campus}></img>
                </div>

                <div className="right item">
                    <div>
                        <h2>Research and Innovation</h2>
                        <p>We are committed to advancing knowledge through research. FaKZ encourages interdisciplinary collaboration and supports innovative projects that address contemporary challenges in science, technology, and society.</p>
                    </div>
                    <img src={research}></img>
                </div>

            </div>
    )
}

function HomePageDesktop() {

    return (

            <div className="home-page-container">

                <div className="left item">
                    <div>
                        <h2>Overview</h2>
                        <p>FaKZ is an independent and self-governing educational institution dedicated to fostering academic 
                        excellence and innovation. Our commitment to providing a diverse and modern curriculum positions 
                        us as a leader in higher education.</p>
                    </div>
                    <img src={uni}></img>
                </div>

                <div className="right item">
                    <iframe className="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d695.1864248173173!2d16.00983219105774!3d45.81635111842127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d7b6f73c7a9d%3A0x2b1f85df3bde668!2sTrgova%C4%8Dka%20%C5%A1kola%20Zagreb!5e0!3m2!1shr!2shr!4v1729333165603!5m2!1shr!2shr"
                            allowFullScreen
                            loading="eager"
                            title="Google Map"
                    ></iframe>
                    <div>
                        <h2>Location</h2>
                        <p>FaKZ headquarters is located in Zagreb, Maksimir, with additional departments throughout the city. 
                        </p>
                    </div>
                </div>

                <div className="left item">
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

                <div className="right item">
                    <img src={professors}></img>
                    <div>
                        <h2>Faculty</h2>
                        <p>
                            Our lecturers are professionals with years of experience in their respective fields.
                            Our lecturers are seasoned professionals with extensive experience in academia and industry. They bring practical insights and mentorship to the classroom, enhancing the learning experience.
                        </p>
                    </div>
                </div>

                <div className="left item">
                    <div>
                        <h2>Campus Life</h2>
                        <p>FaKZ promotes a vibrant campus culture with various student organizations, clubs, and events. Opportunities for internships, research projects, and community engagement ensure that our students gain valuable real-world experience.</p>
                    </div>
                    <img src={campus}></img>
                </div>

                <div className="right item">
                    <img src={research}></img>
                    <div>
                        <h2>Research and Innovation</h2>
                        <p>We are committed to advancing knowledge through research. FaKZ encourages interdisciplinary collaboration and supports innovative projects that address contemporary challenges in science, technology, and society.</p>
                    </div>
                </div>

            </div>
    )
}

function HomePage() {

    // State to store the window width and height
    const windowWidthRef = useRef(window.innerWidth); // Store window width in a ref

    const handleResize = () => {
        windowWidthRef.current = window.innerWidth;  // Update the ref without triggering a re-render
    };

    useElementOnScreen([".left", ".right"], "show", {threshold: 0.1});

    // useEffect hook to listen for window resize events
    useEffect(() => {
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => { window.removeEventListener('resize', handleResize); };
    }, []); // Empty dependency array ensures this effect runs once on mount and cleanup on unmount

    return (
        <div>
            {windowWidthRef.current > 768 ? (HomePageDesktop()) : (HomePageMobile())}
        </div>
    )

}

export default HomePage;