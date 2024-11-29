// scroll-percentage.js
/**console.log('scroll-percentage.js loaded.');

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
*/
// Function to calculate and update scroll percentage
function updateScrollPercentage() {
  // Calculate the current scroll percentage
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

  // Update the scrollbar thumb's percentage display
  document.documentElement.style.setProperty('--scroll-percentage', scrollPercentage);
  document.body.style.setProperty('--scroll-percentage', scrollPercentage);

  // Directly apply the percentage to the scrollbar thumb
  const thumb = document.querySelector("body::-webkit-scrollbar-thumb");
  if (thumb) {
    thumb.setAttribute("data-scroll-percentage", scrollPercentage);
  }
}

// Attach the scroll event listener
window.addEventListener('scroll', updateScrollPercentage);

// Initialize the scroll percentage when the page loads
document.addEventListener('DOMContentLoaded', updateScrollPercentage);
