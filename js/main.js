/* simple shared nav builder
   (keeps all pages in sync)
*/

document.addEventListener('DOMContentLoaded', () => {
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
});
