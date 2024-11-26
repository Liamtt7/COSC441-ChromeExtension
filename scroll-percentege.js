// scroll-percentage.js
console.log('scroll-percentage.js loaded.');

function updateScrollPercentage() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = Math.min((scrollTop / scrollHeight) * 100, 100).toFixed(0);

  // Update the data-scroll attribute on the body to reflect the scroll percentage
  document.body.style.setProperty('--scroll-percentage', `${scrollPercentage}`);
  
  // Set the custom attribute for the scrollbar thumb to display the percentage
  document.documentElement.setAttribute('data-scroll', scrollPercentage);
}

// Update on scroll
window.addEventListener('scroll', updateScrollPercentage);

// Initialize on load
updateScrollPercentage();
