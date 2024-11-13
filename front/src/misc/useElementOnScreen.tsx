import { useEffect } from "react";

export function useElementOnScreen(targetClass: any, addClass: string, options: any) {

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add(addClass);
              }
              //else {
              //  entry.target.classList.remove(addClass);
              //}
            });

          }, options);

        const allElements = document.querySelectorAll(targetClass);

        allElements.forEach((element) => observer.observe(element));

    }, [options]);

}

export const animateCourseRows = (mobile: boolean) => {

  const divElements = document.querySelectorAll('.course-container .course-card');

  // Use IntersectionObserver to handle when the row is in view
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {

          if (entry.isIntersecting) {

            if(mobile) {
              entry.target.classList.remove('start-left', 'start-right'); // Remove left/right CSS
              entry.target.classList.add('show'); // Show the div element 
              observer.unobserve(entry.target);
            }

            else {
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
        }
      });
  }, {
      threshold: 0.5 // Adjust as needed
  });

  // Observe only the first card of each row
  divElements.forEach((element, index) => {
      if(mobile) {
        observer.observe(element);
      }
      else {
        if (index % 3 === 0) { // Observe the first card in each row
            observer.observe(element);
        }
    }
  });
}

export const animateTeacherCourseTable = (targetClass: any, addClass: string, options: any) => {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(addClass);
          }
        });

      }, options);

    const allElements = document.querySelectorAll(targetClass);

    allElements.forEach((element) => observer.observe(element));

};