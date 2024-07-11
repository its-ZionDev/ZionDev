const shadowHeader = () => {
  const header = document.getElementById('header');
  this.scrollY >= 50
    ? header.classList.add('shadow-header')
    : header.classList.remove('shadow-header');
};

window.addEventListener('scroll', shadowHeader);

const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 58;
    const sectionId = current.getAttribute('id');
    const sectionClass = document.querySelector(
      `.nav-menu a[href*=${sectionId}]`,
    );

    if (sectionClass) {
      if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
        sectionClass.classList.add('active-link');
      } else {
        sectionClass.classList.remove('active-link');
      }
    }
  });
};

window.addEventListener('scroll', scrollActive);

const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](
    darkTheme,
  );
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](
    iconTheme,
  );
}

themeButton.addEventListener('click', () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  localStorage.setItem('selected-theme', getCurrentTheme());
  localStorage.setItem('selected-icon', getCurrentIcon());
});

const sr = ScrollReveal({
  origin: 'top',
  distance: '70px',
  duration: 2500,
  delay: 400,
  reset: true,
});

sr.reveal('.home-profile, .about-img-box, .contact-mail', { origin: 'right' });
sr.reveal(
  '.home-name, .home-info, .about-container .section-title-1, .about-info, .contact-social, .contact-data',
  { origin: 'left' },
);
sr.reveal('.service-card, .experience-details, .project-card', {
  interval: 100,
});

document
  .getElementById('contact-form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = this;
    const formData = new FormData(form);
    const contactMessageElement = document.getElementById('contact-message');

    let isValid = true;
    form.querySelectorAll('[required]').forEach(function (input) {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }
    });

    if (!isValid) {
      contactMessageElement.textContent = 'Please fill in all required fields.';
      contactMessageElement.style.color = 'red';
      return;
    }

    const urlEncodedData = new URLSearchParams();
    formData.forEach((value, key) => {
      urlEncodedData.append(key, value);
    });

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData.toString(),
      });

      const result = await response.json();
      contactMessageElement.textContent = result.message;
      contactMessageElement.style.color = response.ok ? 'green' : 'red';

      if (response.ok) {
        form.reset();
        setTimeout(() => {
          contactMessageElement.textContent = ''; 
          contactMessageElement.style.color = '';
        }, 5000);
      }
    } catch (error) {
      contactMessageElement.textContent = 'An error occurred: ' + error.message;
      contactMessageElement.style.color = 'red';
    }
  });
