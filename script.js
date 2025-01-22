// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Select all iframe elements (videos) on the page
    const videos = document.querySelectorAll('iframe');
    
    // Add lazy loading to all videos to improve page performance
    videos.forEach(video => {
        video.loading = 'lazy';
    });

    // Select all sections and set up Intersection Observer options
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,          // Use viewport as root
        threshold: 0.1,      // Trigger when 10% of element is visible
        rootMargin: '0px'    // No margin around root
    };

    // Create Intersection Observer for fade-in animations
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing once animation is triggered
            }
        });
    }, observerOptions);

    // Add initial hidden class and start observing each section
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Add click handlers for section titles
    sections.forEach(section => {
        const iframe = section.querySelector('iframe');
        const h2 = section.querySelector('h2');

        h2.addEventListener('click', () => {
            // Pause all other videos when one is selected
            videos.forEach(video => {
                if (video !== iframe) {
                    const videoSrc = video.src;
                    video.src = videoSrc; // Reset source to pause video
                }
            });

            // Smoothly scroll the selected video into view
            iframe.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
    });

    // Error handling for video loading failures
    videos.forEach(video => {
        video.onerror = () => {
            video.style.display = 'none';
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Video unavailable. Please try again later.';
            errorMessage.classList.add('error-message');
            video.parentNode.appendChild(errorMessage);
        };
    });

    // Add click-to-scroll-top functionality to main title
    const mainTitle = document.querySelector('h1');
    mainTitle.style.cursor = 'pointer';
    mainTitle.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add keyboard navigation with arrow keys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            // Find the currently visible section
            const currentSection = [...sections].find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top > -rect.height && rect.top < window.innerHeight;
            });

            if (currentSection) {
                // Navigate to next or previous section based on arrow key
                const nextSection = e.key === 'ArrowDown' 
                    ? currentSection.nextElementSibling 
                    : currentSection.previousElementSibling;
                
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });
});

// Create and append dynamic styles for animations and interactions
const style = document.createElement('style');
style.textContent = `
    /* Initial hidden state for sections */
    .section-hidden {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease-out;
    }

    /* Visible state for sections after fade-in */
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Styling for error messages when videos fail to load */
    .error-message {
        color: #ff4444;
        text-align: center;
        padding: 20px;
        background-color: #ffeeee;
        border-radius: 5px;
    }

    /* Hover animation for sections */
    section {
        transition: transform 0.3s ease;
    }

    section:hover {
        transform: scale(1.01);
    }

    /* Hover effects for section titles */
    h2 {
        cursor: pointer;
        transition: color 0.3s ease;
    }

    h2:hover {
        color: #0066cc;
    }
`;
document.head.appendChild(style);