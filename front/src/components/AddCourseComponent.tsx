import { useEffect } from 'react';
import { getJWT } from '../misc/Tokens';
import { FormEvent, ChangeEvent, useState, FC } from "react";
import { Teacher } from '../misc/Types';

interface AddCourseComponentProps {
    onCourseAdded: () => void; // Callback to notify parent that the course is added
}

// Takes onCourseAdded from parent component
const AddCourseComponent: FC<AddCourseComponentProps> = ({ onCourseAdded }) => {

    const [selectedAssociates, setSelectedAssociates] = useState<number[]>([]); // Array of selected associate IDs
    const [associates, setAssociates] = useState<Teacher[] | null>(null); // List of all associates
    const [currentAssociate, setCurrentAssociate] = useState<number | null>(null); // Currently selected associate (to add)

    useEffect(() => {
        // Load associates on page render
        loadAssociates();
    }, []);

    // Load associates from db
    const loadAssociates = async () => {

        try {

            const token = getJWT().access;

            const response = await fetch('http://localhost:8000/teachers/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                setAssociates(result);
            } else {
                console.log("Add Course associate fetch failed:", result);
            }
        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    }

    // Handle changes in the select element
    const handleSelectAssociateChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCurrentAssociate(Number(e.target.value)); // Set the selected associate ID
    };

    // Add the selected associate to the list
    const handleAddAssociate = () => {
        if (currentAssociate && !selectedAssociates.includes(currentAssociate)) {
            setSelectedAssociates([...selectedAssociates, currentAssociate]);
        }
    };

    // Remove an associate from the list
    const handleRemoveAssociate = (id: number) => {
        setSelectedAssociates(selectedAssociates.filter((associateId) => associateId !== id));
        setCurrentAssociate(null);
    };

    // Probably non React way of obtaining form values
    const extractFormData = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const courseName = (form.elements.namedItem('name') as HTMLInputElement).value;
        const coursePoints = (form.elements.namedItem('points') as HTMLInputElement).value;
        const courseImage = (form.elements.namedItem('image') as HTMLInputElement).value;
        return {courseName, coursePoints, courseImage, selectedAssociates};
    }

    // Adding course to db using POST
    const handleAddCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = extractFormData(e);
        
        try {

            const token = getJWT().access;

            // Send request to /login
            const response = await fetch('http://localhost:8000/add-course/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                onCourseAdded(); // Refresh Teacher Dashboard and remove Add Course popup
            } else {
                console.error(`Course adding failed: ${result.message}`);
            }

        } catch (error) {
            console.log(`An error occurred: ${(error as Error).message}`);
        }
    }

    return (
        <div className="add-course">
            <h1>Add a new course</h1>
            <form className="add-course-form" onSubmit={handleAddCourseSubmit}>

                <h3>Name:</h3>
                <input 
                    type="text" 
                    id="name" 
                    required>
                </input>

                <h3>Points:</h3>
                <input 
                    type="number" 
                    id="points" 
                    required>
                </input>

                <h3>Image:</h3>
                <input 
                    type="text" 
                    id="image"
                    required>
                </input>

                <h3>Associates:</h3>
                <select value={currentAssociate || ''} onChange={handleSelectAssociateChange}>

                    <option value="">Select an Associate</option>
                    {associates?.filter((associate) => !selectedAssociates.includes(associate.id)) // Filter out selected associates
                        .map((associate) => (
                            <option key={associate.id} value={associate.id}>
                                {associate.academic_id} {associate.name}
                            </option>
                        )
                    )}

                </select>

                <button type="button" onClick={handleAddAssociate} disabled={!currentAssociate}>
                    Add Associate
                </button>

                {selectedAssociates.length > 0 && ( // Display selected associates in a separate div
                    <div className="selected-associates">
                        <h4>Selected Associates:</h4>
                        <ul>
                            {selectedAssociates.map((associateId) => {
                                const associate = associates?.find((a) => a.id === associateId);
                                return (
                                    <li key={associateId}>
                                        {associate?.academic_id} {associate?.name}
                                        <button type="button" onClick={() => handleRemoveAssociate(associateId)}>Remove</button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <button type="submit">Add course</button>

            </form>
        </div>
    );
}

export default AddCourseComponent;
