import { useEffect, useState } from 'react';

type AvailableCourse = {
    id: number;
    name: string;
    points: number;
    image_url: string;
    coordinator: string;
    associates: string[];
}

function CoursesPage() {

    const [availableCourses, setAvailableCourses] = useState<AvailableCourse[] | null>(null);

    const fetchAvailableCourses = async () => {
        
        try {

            // Send request to /dashboard
            const response = await fetch('http://localhost:8000/courses/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // If response is ok (user exists), return JWT token
            if (response.ok) {
                setAvailableCourses(result);
            } else {
                console.error("Courses failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

    }

    const animateCourseRows = () => {

        const divElements = document.querySelectorAll('.course-container .course-card');

        // Use IntersectionObserver to handle when the row is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const rowIndex = Math.floor(Array.from(divElements).indexOf(entry.target) / 3); // Determine row index
                    const rowCards = Array.from(divElements).slice(rowIndex * 3, (rowIndex + 1) * 3); // Get all cards in the current row

                    // Check if all cards in the current row are intersecting
                    if (rowCards.every(card => card.classList.contains('show') || entry.isIntersecting)) {
                        rowCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.remove('start-left', 'start-right'); // Remove left/right CSS
                                card.classList.add('show'); // Show the div element
                            }, index * 200); // Stagger timing based on index within the row
                        });

                        // Stop observing the row
                        rowCards.forEach(card => observer.unobserve(card));
                    }
                }
            });
        }, {
            threshold: 0.5 // Adjust as needed
        });

        // Observe only the first card of each row
        divElements.forEach((element, index) => {
            if (index % 3 === 0) { // Observe the first card in each row
                observer.observe(element);
            }
        });
    }

    useEffect(() => {
        const fetchCourses = async () => {
            await fetchAvailableCourses(); // Wait for courses to load
        };
    
        fetchCourses();
    }, []); // Only run once on mount
    
    useEffect(() => {
        if (availableCourses) {
            animateCourseRows();  // Now that availableCourses is populated, observe elements
        }
    }, [availableCourses]);  // Trigger when availableCourses changes

    return(
        <div className='courses'>

            Available courses

            {availableCourses ? (
                availableCourses.length > 0 ? (
                    <div className="course-container">
                        {availableCourses.map((course, index) => {
                            // Determine which class to use based on index
                            const start_side = Math.floor(index / 3) % 2 === 0 ? 'start-left' : 'start-right';
                            return (
                                <div className={`course-card ${start_side}`} key={index}>
                                    <h3>{course.name}</h3>
                                    <p>{course.points} points</p>
                                    <p>Course instructor: {course.coordinator ? course.coordinator : "Unknown"}</p>
                                    <p>Course associates: {course.associates ? course.associates : "Unknown"}</p>
                                    <img src={course.image_url} alt={course.name}></img>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No courses available.</p>
                )
            ) : (
                <p>Loading courses...</p>
            )}

        </div>
    )

}

export default CoursesPage;