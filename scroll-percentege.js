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
// Create the scroll indicator element
// Create the scroll indicator element
// Create the scroll indicator element
const scrollIndicator = document.createElement('div');
scrollIndicator.id = 'vn-scroll-indicator';

// Create the percentage text element
const percentageText = document.createElement('span');
percentageText.id = 'vn-percentage-text';
percentageText.textContent = '0%'; // Initialize with 0%

scrollIndicator.appendChild(percentageText);
// Style the scroll indicator
scrollIndicator.style.position = 'fixed';
scrollIndicator.style.top = '0';
scrollIndicator.style.left = '0';
scrollIndicator.style.height = '12px';
scrollIndicator.style.backgroundColor = '#29e';
scrollIndicator.style.zIndex = '9999';
scrollIndicator.style.width = '0%';
scrollIndicator.style.display = 'flex';
scrollIndicator.style.alignItems = 'center';
scrollIndicator.style.justifyContent = 'center';
scrollIndicator.style.color = '#fff';
scrollIndicator.style.fontWeight = 'bold';


percentageText.style.fontSize = '7px';
percentageText.style.margin = '0';

// Append the scroll indicator to the body
document.body.appendChild(scrollIndicator);


function updateScrollPercentage() {
  const scrollTop = window.scrollY || window.pageYOffset;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  let scrollPercentage = (scrollTop / scrollHeight) * 100;

  // Ensure the percentage is between 0% and 100%
  scrollPercentage = Math.min(Math.max(scrollPercentage, 0), 100);
  const roundedPercentage = Math.round(scrollPercentage);

  // Update the width of the scroll indicator
  scrollIndicator.style.width = scrollPercentage + '%';

  // Update the percentage text
  percentageText.textContent = roundedPercentage + '%';
}

// Attach the scroll event listener
window.addEventListener('scroll', updateScrollPercentage);

// Initialize the scroll percentage when the page loads
window.addEventListener('load', updateScrollPercentage);
