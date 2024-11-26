// scroll-percentage.js
console.log('scroll-percentage.js loaded.');

function updateScrollPercentage() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = Math.min((scrollTop / scrollHeight) * 100, 100).toFixed(1);

  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.style.width = `${scrollPercentage}%`;
    scrollIndicator.innerText = `${scrollPercentage}%`;
  }
}

// Update on scroll
window.addEventListener('scroll', updateScrollPercentage);

// Initialize on load
updateScrollPercentage();

