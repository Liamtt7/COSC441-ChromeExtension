// Update the scroll percentage
const updateScrollPercentage = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.min((scrollTop / scrollHeight) * 100, 100).toFixed(1);
  
    // Update the scrollbar
    const scrollIndicator = document.getElementById("scroll-indicator");
    scrollIndicator.style.width = `${scrollPercentage}%`;
    scrollIndicator.innerText = `${scrollPercentage}%`;
  };
  
  // Add a scroll event listener
  window.addEventListener("scroll", updateScrollPercentage);
  updateScrollPercentage(); // Initialize on load
  