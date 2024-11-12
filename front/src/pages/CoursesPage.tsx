import { useEffect, useState } from 'react';
import { animateCourseRows } from '../misc/useElementOnScreen';

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

    const shuffleArray = (arr: AvailableCourse[]) => {
        const shuffledArray = [...arr];  // Make a copy to avoid mutating original state
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));  // Random index between 0 and i
          // Swap elements at index i and j
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
      };

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
                const shuffled = shuffleArray(result);
                setAvailableCourses(shuffled);
            } else {
                console.error("Courses failed:", result);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }

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

            {availableCourses ? (
                availableCourses.length > 0 ? (
                    <div className="course-container">
                        {availableCourses.map((course, index) => {
                            // Determine which class to use based on index
                            const start_side = Math.floor(index / 3) % 2 === 0 ? 'start-left' : 'start-right';
                            return (
                                <div className={`course-card ${start_side}`} key={index}>
                                    <img src={course.image_url} alt={course.name}></img>
                                    <div className='course-card-content'>
                                        <h2>{course.name}</h2>
                                        <p>{course.points} points</p>
                                        <p>Course instructor: {course.coordinator ? course.coordinator : "None"}</p>
                                        <p>Course associates: {course.associates ? course.associates : "None"}</p>
                                    </div>
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