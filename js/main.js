
document.addEventListener('DOMContentLoaded', () => {
  // build nav for all pages
  buildNav();

  // identify which page user's on
  const page = document.body.dataset?.page || detectPage();

  // ---- home ----
  if (page === 'home') {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const results = document.getElementById('results');
    const empty = document.getElementById('empty-state');
    const chips = document.querySelectorAll('.chip');

    async function fetchRecipes(url) {
      results.innerHTML = '<p class="muted">Loading…</p>';
      empty.hidden = true;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const meals = data.meals;
        results.innerHTML = ''; // clear loading message

        if (!meals) {
          empty.hidden = false;
          empty.textContent = 'No recipes found.';
          return;
        }

        meals.forEach(meal => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="pad">
              <h3>${meal.strMeal}</h3>
              <a href="recipe.html?id=${meal.idMeal}">View Recipe</a>
            </div>
          `;
          results.appendChild(card);
        });
      } catch (err) {
        results.innerHTML = '<p class="muted">Error loading recipes.</p>';
        console.error(err);
      }
    }

    // handle search form
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const term = input.value.trim();
        if (term) {
          const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`;
          fetchRecipes(url);
        }
      });
    }

    // handle chip filters
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?${filter}`;
        fetchRecipes(url);
      });
    });
  }

  // ---- contact ----
  if (page === 'contact') {
    const form = document.getElementById('contact-form');
    if (form) {
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const nameHint = document.getElementById('name-hint');
      const emailHint = document.getElementById('email-hint');
      const msgHint = document.getElementById('message-hint');

      function validate() {
        nameHint.textContent = name.value.trim() ? '' : 'Please enter your name.';
        const okEmail = /\S+@\S+\.\S+/.test(email.value);
        emailHint.textContent = okEmail ? '' : 'Please enter a valid email.';
        msgHint.textContent = message.value.trim().length >= 20
          ? ''
          : 'Message should be at least 20 characters.';
      }

      form.addEventListener('input', validate);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        validate();
        alert('Thanks! (Form demo for exam — not actually sent.)');
      });
    }
  }

});


// builds navigation bar on every page
function buildNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const navLinks = [
    { href: 'index.html', label: 'Home' },
    { href: 'recipe.html', label: 'Recipe' },
    { href: 'contact.html', label: 'Contact' }
  ];

  const nav = document.createElement('nav');
  nav.className = 'nav';

  navLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    if (window.location.pathname.endsWith(link.href)) {
      a.classList.add('active');
    }
    nav.appendChild(a);
  });

  header.appendChild(nav);
}

// simple fallback to guesses page from file name if no data-page attribute
function detectPage() {
  const file = window.location.pathname.split('/').pop();
  if (file.includes('contact')) return 'contact';
  if (file.includes('recipe')) return 'recipe';
  return 'home';
}
