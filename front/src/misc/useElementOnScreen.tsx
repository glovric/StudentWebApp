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

export function isElementVisibleOnScreen(targetClass: any, options: any, callback: any) {

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                callback(true);
              }
              else {
                callback(false);
              }
            });

          }, options);

        const allElements = document.querySelectorAll(targetClass);

        allElements.forEach((element) => observer.observe(element));

        return () => {
            if(allElements.length > 0) {
                allElements.forEach((element) => observer.unobserve(element));
            }
        };

    }, [options, callback]);

} 

export const animateCourseRows = () => {

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