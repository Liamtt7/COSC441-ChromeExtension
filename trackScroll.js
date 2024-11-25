export function trackScroll(goal, callback) {
    let goalReached = false;
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        const goalPosition = pageHeight * goal;

        if (!goalReached && scrollPosition >= goalPosition) {
            goalReached = true;
            callback();  // Trigger goal reached callback
        }
    });
}