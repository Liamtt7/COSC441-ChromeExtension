// Initialize variables for tracking time and state
let studyActive = false;
let isTracking = false;

const startStudyBtn = document.getElementById("start-study-btn");
const studyScreen = document.querySelector(".study-screen");
const mainScreen = document.querySelector("main");
const startTrackingBtn = document.getElementById("start-tracking-btn");
const instructions = document.getElementById("instructions");
const progressDisplay = document.getElementById("progress");


let lastScrollPosition = 0; // Store last scroll position

let reps = 1;


// Switch to the study screen
startStudyBtn.addEventListener("click", () => {
    mainScreen.style.display = "none";
    studyScreen.style.display = "flex";
    document.getElementById("half-section").scrollIntoView({ behavior: 'auto', block: 'start' });
    startStudy();
});

// Start tracking scroll progress

startTrackingBtn.addEventListener("click", () => {
    instructions.textContent = "Say 'scroll down'";
    isTracking = true;
});



const startStudy = () => {
    studyActive = true;
    studyController()
    console.log("Study started.");
};

const endStudy = () => {
    studyActive = false;
    console.log("Study ended.");
    console.log(`Time taken: ${totalTime.toFixed(2)} ms`);
};

function studyController() {
    for (let i = 0; i < reps; i++) {
        scrollDownStudy();
    }
}

function resetStudyScreen() {
    document.getElementById("half-section").scrollIntoView({ behavior: 'auto', block: 'start' });
    instructions.textContent = "";

}

function scrollDownStudy() {

    let done = false;
    const startScrollPosition = window.scrollY;
    window.addEventListener("scroll", () => {
        if (isTracking) {
            
            const currentScrollPosition = window.scrollY - startScrollPosition;

            const viewportHeight = window.innerHeight;
            const totalHeight = document.body.scrollHeight - viewportHeight;
            const scrollPercentage = Math.round(((currentScrollPosition) / totalHeight) * 100);

            progressDisplay.textContent = `Scroll progress: ${scrollPercentage}%`;

            // Check if user has scrolled down 25%
            if (scrollPercentage >= 25) {
                console.log("User has scrolled down 25% of the page.");
                isTracking = false; // Stop tracking after detecting the threshold
                resetStudyScreen();
            }


        }
    });


}


