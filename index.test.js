const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const gsap = require('gsap');

describe('About Me Section', () => {
    let document;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
        document = dom.window.document;

        // Mock gsap functions
        gsap.fromTo = jest.fn();
        gsap.to = jest.fn();
    });

    test('should have About Me section', () => {
        const aboutSection = document.querySelector('#about');
        expect(aboutSection).not.toBeNull();
    });

    test('should have profile image in About Me section', () => {
        const profileImg = document.querySelector('#about .profile-img');
        expect(profileImg).not.toBeNull();
        expect(profileImg.getAttribute('src')).toBe('assets/images/myLogo.jpg');
        expect(profileImg.getAttribute('alt')).toBe('Profile Picture');
    });

    test('should have correct paragraphs in About Me section', () => {
        const paragraphs = document.querySelectorAll('#about p');
        expect(paragraphs.length).toBe(7); // Ensure all paragraphs are present
        expect(paragraphs[0].textContent).toContain("Hello! I'm Xavier Denson,");
        expect(paragraphs[6].textContent).toContain("xdenson253@outlook.com");
    });

    test('should animate sections on load', () => {
        require('./script'); // Assuming your script is in script.js and it's located in the same directory as the test file
        const sections = document.querySelectorAll('section');
        expect(gsap.fromTo).toHaveBeenCalled();
        expect(gsap.to).toHaveBeenCalled();
    });
});
