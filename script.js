function resetForm() {
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.reset();
        document.getElementById('modalTitle').innerText = 'Add New Post';
    }
    isEditing = false;
    currentPostId = null;
}

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

        gsap.fromTo("header", { opacity: 0 }, { opacity: 1, duration: 0.5 });
        gsap.fromTo("footer", { opacity: 0 }, { opacity: 1, duration: 0.5 });

        const sections = document.querySelectorAll('section');
        if (sections.length > 0) {
            gsap.fromTo(sections, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.2 });
        }

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

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetElement,
                    offsetY: 70
                },
                ease: 'power2.inOut'
            });
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            gsap.to(backToTopButton, { duration: 0.5, opacity: 1, display: 'block' });
        } else {
            gsap.to(backToTopButton, { duration: 0.5, opacity: 0, display: 'none' });
        }
    });

    backToTopButton.addEventListener('click', () => {
        gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: 'power2.inOut' });
    });

    $('.slideshow').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // GSAP animations for project cards
    const projectCards = document.querySelectorAll('.portfolio .project');
    
    projectCards.forEach((card, index) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.2,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const splashPage = document.getElementById('splashPage');
    const splashLogo = document.querySelector('.splash-logo');
    const splashHeading = document.querySelector('.splash-content h1');
    const splashParagraph = document.querySelector('.splash-content p');
    const enterButton = document.getElementById('enterButton');

    // Animate splash content on load
    gsap.to(splashLogo, { duration: 1, opacity: 1, y: 0 });
    gsap.to(splashHeading, { duration: 1, opacity: 1, y: 0, delay: 0.3 });
    gsap.to(splashParagraph, { duration: 1, opacity: 1, y: 0, delay: 0.6 });
    gsap.to(enterButton, { duration: 1, opacity: 1, y: 0, delay: 0.9 });

    enterButton.addEventListener('click', () => {
        gsap.to(splashPage, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                splashPage.style.display = 'none';
            }
        });
    });

    // Optionally, automatically hide the splash page after a delay
    setTimeout(() => {
        gsap.to(splashPage, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                splashPage.style.display = 'none';
            }
        });
    }, 3000); // delay in milliseconds (e.g., 3 seconds)
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const splashPage = document.getElementById('splashPage');
    const splashLogo = document.querySelector('.splash-logo');
    const splashHeading = document.querySelector('.splash-content h1');
    const splashParagraph = document.querySelector('.splash-content p');
    const enterButton = document.getElementById('enterButton');

    // Show the indicator initially
    gsap.to(scrollIndicator, { duration: 1, opacity: 1 });

    // Hide the indicator after scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            gsap.to(scrollIndicator, { duration: 0.5, opacity: 0, onComplete: () => scrollIndicator.classList.add('hidden') });
        } else {
            gsap.to(scrollIndicator, { duration: 0.5, opacity: 1, onComplete: () => scrollIndicator.classList.remove('hidden') });
        }
    });

    // Animate splash content on load
    gsap.to(splashLogo, { duration: 1, opacity: 1, y: 0 });
    gsap.to(splashHeading, { duration: 1, opacity: 1, y: 0, delay: 0.3 });
    gsap.to(splashParagraph, { duration: 1, opacity: 1, y: 0, delay: 0.6 });
    gsap.to(enterButton, { duration: 1, opacity: 1, y: 0, delay: 0.9 });

    enterButton.addEventListener('click', () => {
        gsap.to(splashPage, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                splashPage.style.display = 'none';
            }
        });
    });

    // Optionally, automatically hide the splash page after a delay
    setTimeout(() => {
        gsap.to(splashPage, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                splashPage.style.display = 'none';
            }
        });
    }, 3000); // delay in milliseconds (e.g., 3 seconds)
});

document.addEventListener('DOMContentLoaded', () => {
    const contactLink = document.getElementById('contactLink');
    
    contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'mailto:xdenson253@outlook.com?subject=Contacting%20You&body=Hi%20Xavier,%0A%0AI%20would%20like%20to%20discuss...';
    });

    const scrollIndicator = document.getElementById('scrollIndicator');
    const splashPage = document.getElementById('splashPage');
    const splashLogo = document.querySelector('.splash-logo');
    const splashHeading = document.querySelector('.splash-content h1');
    const splashParagraph = document.querySelector('.splash-content p');
    const enterButton = document.getElementById('enterButton');

    // Show the indicator initially
    gsap.to(scrollIndicator, { duration: 1, opacity: 1 });

    // Hide the indicator after scrolling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            gsap.to(scrollIndicator, { duration: 0.5, opacity: 0, onComplete: () => scrollIndicator.classList.add('hidden') });
        } else {
            gsap.to(scrollIndicator, { duration: 0.5, opacity: 1, onComplete: () => scrollIndicator.classList.remove('hidden') });
        }
    });

    // Animate splash content on load
    gsap.to(splashLogo, { duration: 1, opacity: 1, y: 0 });
    gsap.to(splashHeading, { duration: 1, opacity: 1, y: 0, delay: 0.3 });
    gsap.to(splashParagraph, { duration: 1, opacity: 1, y: 0, delay: 0.6 });
    gsap.to(enterButton, { duration: 1, opacity: 1, y: 0, delay: 0.9 });

    enterButton.addEventListener('click', () => {
        gsap.to(splashPage, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                splashPage.style.display = 'none';
            }
        });
    });

    // Optionally, automatically hide the splash page after a delay
    setTimeout(() => {
        gsap.to(splashPage, {
            duration: 1,
            opacity: 0,
            onComplete: () => {
                splashPage.style.display = 'none';
            }
        });
    }, 3000); // delay in milliseconds (e.g., 3 seconds)
});
