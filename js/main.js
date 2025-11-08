
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

        // ---- GSAP animations ----
    if (window.gsap) {
      // simple timeline for hero text
      const tl = gsap.timeline();
      tl.from(".hero__title", { y: 20, opacity: 0, duration: 0.8 })
        .from(".hero__tag", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".search-area", { y: 20, opacity: 0, duration: 0.6 }, "-=0.2");

      // scroll animation for recipe cards
      if (window.ScrollTrigger) {
        gsap.utils.toArray(".card").forEach(card => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
          });
        });
      }
    }

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


  // ---- recipe ----
  if (page === 'recipe') {
  const titleEl = document.getElementById('recipe-title');
  const imgEl = document.getElementById('recipe-img');
  const ingList = document.getElementById('ingredients');
  const stepsList = document.getElementById('instructions');

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    titleEl.textContent = 'No recipe id provided.';
    return;
  }

  async function loadRecipe(mealId) {
    titleEl.textContent = 'Loading…';
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await res.json();
      const meal = data.meals && data.meals[0];

      if (!meal) {
        titleEl.textContent = 'Recipe not found.';
        return;
      }

      // title and image
      titleEl.textContent = meal.strMeal || 'Recipe';
      if (meal.strMealThumb) {
        imgEl.src = meal.strMealThumb;
        imgEl.alt = meal.strMeal;
      }

      // ingredients (mealDB uses strIngredient1..20 + strMeasure1..20)
      ingList.innerHTML = '';
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const meas = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          const li = document.createElement('li');
          li.textContent = `${ing}${meas ? ` — ${meas}` : ''}`;
          ingList.appendChild(li);
        }
      }

      
      stepsList.innerHTML = '';
      const raw = (meal.strInstructions || '').trim();
      if (raw) {
       
        const parts = raw.split(/\r?\n|\.\s+/).filter(Boolean);
        parts.forEach(step => {
          const li = document.createElement('li');
          li.textContent = step;
          stepsList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No instructions available.';
        stepsList.appendChild(li);
      }
    } catch (err) {
      titleEl.textContent = 'Error loading recipe.';
      console.error(err);
    }
  }

  loadRecipe(id);

  // fake favourite demo
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const favs = JSON.parse(localStorage.getItem('favs') || '[]');
      if (!favs.includes(id)) favs.push(id);
      localStorage.setItem('favs', JSON.stringify(favs));
      saveBtn.textContent = 'Saved ✓';
    });
  }
}

  // ---- GSAP anima ----
  if (window.gsap) {
    // fade in title and image
    const tl = gsap.timeline();
    tl.from("#recipe-title", { y: 20, opacity: 0, duration: 0.8 })
      .from("#recipe-img", { opacity: 0, duration: 0.8 }, "-=0.4");

    // stagger ingredients
    if (document.querySelectorAll("#ingredients li").length) {
      gsap.from("#ingredients li", {
        y: 10,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.5
      });
    }

    // scroll anim for instructions
    if (window.ScrollTrigger) {
      gsap.from("#instructions li", {
        scrollTrigger: {
          trigger: "#instructions",
          start: "top 80%"
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1
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
