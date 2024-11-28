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

// startTrackingBtn.addEventListener("click", () => {
    
    
// });



const startStudy = () => {
    disableScrolling();
    studyActive = true;
    studyController();
    console.log("Study started.");
};

const endStudy = () => {
    studyActive = false;
    console.log("Study ended.");    
    mainScreen.style.display = "flex";
    studyScreen.style.display = "none";
    //console.log(`Time taken: ${totalTime.toFixed(2)} ms`);
};

function waitForButtonClick(button) {
    return new Promise((resolve) => {
        const handleClick = () => {
            isTracking = true;
            enableScrolling();
            button.removeEventListener("click", handleClick); // Remove the listener after resolving
            resolve();
        };
        button.addEventListener("click", handleClick);
    });
}

async function studyController() {
    for (let i = 0; i < reps; i++) {
        await waitForButtonClick(startTrackingBtn);
        await scrollDownStudy();
        await waitForButtonClick(startTrackingBtn);
        await scrollUpStudy();
    }
    console.log("endStudy called");
    endStudy();
}

function resetStudyScreen() {

    document.getElementById("half-section").scrollIntoView({ behavior: 'auto', block: 'start' });
    disableScrolling();
    instructions.textContent = "";

}

function disableScrolling() {
    document.body.style.overflow = 'hidden';
}
function enableScrolling() {
    document.body.style.overflow = '';
}

function scrollDownStudy() {
    return new Promise((resolve) => {
        
        const startScrollPosition = window.scrollY;
        instructions.textContent = "Say 'scroll down'";

        const handleScroll = () => {
            
            if(isTracking){
                const currentScrollPosition = window.scrollY - startScrollPosition;
                const viewportHeight = window.innerHeight;
                const totalHeight = document.body.scrollHeight - viewportHeight;

                const scrollPercentage = Math.round((currentScrollPosition / totalHeight) * 100);
                progressDisplay.textContent = `Scroll progress: ${Math.max(0, scrollPercentage)}%`;

                if (scrollPercentage >= 25) {
                    console.log("User has scrolled down 25% of the page.");
                    isTracking = false;
                    window.removeEventListener("scroll", handleScroll);
                    resetStudyScreen();
                    resolve(); // Resolve the Promise to indicate completion
                }
            }

        };

        window.addEventListener("scroll", handleScroll);
    });
}

function scrollUpStudy() {
    return new Promise((resolve) => {
        const startScrollPosition = window.scrollY;
        instructions.textContent = "Say 'scroll up'";

        const handleScroll = () => {
            if (isTracking) {
                
                const currentScrollPosition = window.scrollY - startScrollPosition;
                const viewportHeight = window.innerHeight;
                const totalHeight = document.body.scrollHeight - viewportHeight;

                const scrollPercentage = Math.round((currentScrollPosition / totalHeight) * 100);
                progressDisplay.textContent = `Scroll progress: ${Math.min(0, scrollPercentage)}%`;

                // Check if user has scrolled down 25%
                if (scrollPercentage <= -25) {
                    console.log("User has scrolled up 25% of the page.");
                    isTracking = false;
                    window.removeEventListener("scroll", handleScroll);
                    resetStudyScreen();
                    resolve(); // Resolve the Promise to indicate completion
                }


            }
        }

        window.addEventListener("scroll", handleScroll);
    });

}


