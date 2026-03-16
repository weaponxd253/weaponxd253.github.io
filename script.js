const body = document.body;
const themeSwitcher = document.getElementById('themeSwitcher');
const themeSwitcherIcon = document.getElementById('themeSwitcherIcon');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function applyTheme(theme) {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  themeSwitcherIcon.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeSwitcher?.addEventListener('click', () => {
  const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
  applyTheme(nextTheme);
});

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});
