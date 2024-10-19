import { useEffect } from "react";

export function useElementOnScreen(targetClass: any, addClass: string, options: any) {

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add(addClass);
              }
              else {
                entry.target.classList.remove(addClass);
              }
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