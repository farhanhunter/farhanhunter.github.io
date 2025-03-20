document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Dark/Light mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or use preferred color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Form submission handling using fetch API
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form input values
            const formButton = contactForm.querySelector('button[type="submit"]');
            const resultDisplay = document.getElementById('formStatus');
            const originalText = formButton.textContent;

            // Ensure resultDisplay exists
            if (!resultDisplay) {
                console.error('Result display element not found');
                return;
            }

            // Show loading state
            formButton.disabled = true;
            formButton.textContent = 'Sending...';

            // Prepare form data
            const formData = new FormData(contactForm);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });

            // Send the data using fetch API
            fetch('https://script.google.com/macros/s/AKfycbxt38PMbkQeul3NggLwwqjZ2MrAL3PcIEZEfRBZH5pkoR2U-EYo-kNGYTUDv57Dte-89g/exec', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                body: JSON.stringify(object)
            })
                .then(() => {
                    // Show success message
                    formButton.textContent = 'Message Sent!';
                    formButton.style.backgroundColor = 'var(--success-color)';
                    resultDisplay.style.display = 'block';
                    resultDisplay.textContent = 'Thank you for your message. I will get back to you soon.';
                    resultDisplay.style.color = 'var(--success-color)';

                    // Reset form
                    contactForm.reset();

                    // Reset button after delay
                    setTimeout(() => {
                        formButton.disabled = false;
                        formButton.textContent = originalText;
                        formButton.style.backgroundColor = '';
                        resultDisplay.style.display = 'none';
                    }, 3000);
                })
                .catch(error => {
                    // Show error message
                    console.error('Error:', error);
                    formButton.textContent = 'Error!';
                    formButton.style.backgroundColor = '#dc3545';
                    resultDisplay.style.display = 'block';
                    resultDisplay.textContent = 'Something went wrong. Please try again later.';
                    resultDisplay.style.color = '#dc3545';

                    // Reset button after delay
                    setTimeout(() => {
                        formButton.disabled = false;
                        formButton.textContent = originalText;
                        formButton.style.backgroundColor = '';
                    }, 3000);
                });
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe section titles and project cards
    document.querySelectorAll('.section-title, .project-card, .about-content, .contact-content').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add some CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .animate-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0);
        }

        .project-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease, opacity 0.8s ease;
        }

        .project-card.animate-on-scroll {
            transform: translateY(50px);
        }

        .project-card.in-view {
            transform: translateY(0);
        }

        .project-card:hover {
            transform: translateY(-10px);
        }
    `;
    document.head.appendChild(style);
});