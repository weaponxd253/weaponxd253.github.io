// Function to reset the form
function resetForm() {
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.reset();
        document.getElementById('modalTitle').innerText = 'Add New Post';
    }
    isEditing = false;
    currentPostId = null;
}

// Function to open a modal with GSAP animation
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    gsap.to(modal, {
        duration: 0.5,
        opacity: 1,
        display: 'block',
        ease: 'power2.inOut'
    });
    gsap.fromTo(modal.querySelector('.modal-content'), {
        y: -50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut'
    });
}

// Function to close a modal with GSAP animation
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    gsap.to(modal.querySelector('.modal-content'), {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
    });
    gsap.to(modal, {
        duration: 0.5,
        opacity: 0,
        display: 'none',
        ease: 'power2.inOut',
        onComplete: () => {
            modal.style.display = 'none';
        }
    });
    resetForm();
}

// Function to open description modal with GSAP animation
function openDescriptionModal(descriptionModalId) {
    const modal = document.getElementById(descriptionModalId);
    gsap.to(modal, {
        duration: 0.5,
        opacity: 1,
        display: 'block',
        ease: 'power2.inOut'
    });
    gsap.fromTo(modal.querySelector('.modal-content'), {
        y: -50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut'
    });
}

// Make the functions globally accessible
window.openModal = openModal;
window.closeModal = closeModal;
window.openDescriptionModal = openDescriptionModal;

document.addEventListener('DOMContentLoaded', () => {
    const postModal = document.getElementById('postModal');
    const postForm = document.getElementById('postForm');
    const openAddPostModal = document.getElementById('openAddPostModal');
    const themeSwitcher = document.getElementById('themeSwitcher');
    const root = document.documentElement;
    const loginButton = document.getElementById('loginButton');
    const backToTopButton = document.getElementById('backToTop');

    let posts = [];
    let isEditing = false;
    let currentPostId = null;

    loginButton.addEventListener('click', () => {
        openModal('loginModal');
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.token);
            closeModal('loginModal');
        })
        .catch(error => console.error('Error:', error));
    });

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        const icon = document.getElementById('themeSwitcherIcon');
        icon.textContent = newTheme === 'dark' ? '🌞' : '🌙';

        // GSAP animations
        gsap.to(root, {
            duration: 0.5,
            '--background-color': getComputedStyle(document.documentElement).getPropertyValue(`--background-color-${newTheme}`),
            '--text-color': getComputedStyle(document.documentElement).getPropertyValue(`--text-color-${newTheme}`),
            '--header-background': getComputedStyle(document.documentElement).getPropertyValue(`--header-background-${newTheme}`),
            '--header-text-color': getComputedStyle(document.documentElement).getPropertyValue(`--header-text-color-${newTheme}`),
            '--footer-background': getComputedStyle(document.documentElement).getPropertyValue(`--footer-background-${newTheme}`),
            '--footer-text-color': getComputedStyle(document.documentElement).getPropertyValue(`--footer-text-color-${newTheme}`),
            '--section-background': getComputedStyle(document.documentElement).getPropertyValue(`--section-background-${newTheme}`)
        });

        // Animating the header and footer
        gsap.fromTo("header", { opacity: 0 }, { opacity: 1, duration: 0.5 });
        gsap.fromTo("footer", { opacity: 0 }, { opacity: 1, duration: 0.5 });

        // Ensure sections exist before animating
        const sections = document.querySelectorAll('section');
        if (sections.length > 0) {
            gsap.fromTo(sections, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.2 });
        }

        // Animating individual elements within sections
        sections.forEach(section => {
            const headers = section.querySelectorAll('h2');
            const paragraphs = section.querySelectorAll('p');
            const buttons = section.querySelectorAll('.btn');
            const images = section.querySelectorAll('img');

            if (headers.length > 0) {
                gsap.fromTo(headers, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, stagger: 0.2 });
            }

            if (paragraphs.length > 0) {
                gsap.fromTo(paragraphs, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, delay: 0.2, stagger: 0.2 });
            }

            if (buttons.length > 0) {
                gsap.fromTo(buttons, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, delay: 0.3, stagger: 0.2 });
            }

            if (images.length > 0) {
                gsap.fromTo(images, { rotationY: 180, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 0.7, delay: 0.4, stagger: 0.3 });
            }
        });

        root.setAttribute('data-theme', newTheme);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetElement,
                    offsetY: 70 // Adjust this offset if you have a fixed header
                },
                ease: 'power2.inOut'
            });
        });
    });

    // Show/Hide Back to Top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            gsap.to(backToTopButton, { duration: 0.5, opacity: 1, display: 'block' });
        } else {
            gsap.to(backToTopButton, { duration: 0.5, opacity: 0, display: 'none' });
        }
    });

    // Scroll to top when Back to Top button is clicked
    backToTopButton.addEventListener('click', () => {
        gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: 'power2.inOut' });
    });
});


// Existing code...

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Slick Carousel for the slideshows
    $('.slideshow').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true
    });

    // Existing code...
});
