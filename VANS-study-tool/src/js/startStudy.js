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

let reps = 3;


// Switch to the study screen
startStudyBtn.addEventListener("click", () => {
    mainScreen.style.display = "none";
    studyScreen.style.display = "flex";
    document.getElementById("half-section").scrollIntoView({ behavior: 'auto', block: 'start' });
    startStudy();
});


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
};

function waitForButtonClick(button) {
    return new Promise((resolve) => {
        const handleClick = () => {
            isTracking = true;
            enableScrolling();
            button.removeEventListener("click", handleClick); // remove the listener
            resolve();
        };
        button.addEventListener("click", handleClick);
    });
}

async function studyController() {
    const data = [["Task", "Task Time"]]

    for (let i = 0; i < reps; i++) {
        await waitForButtonClick(startTrackingBtn);
        const scrollDownTime = await scrollDownStudy();
        data.push(["Down", scrollDownTime.toFixed(2)]);

        await waitForButtonClick(startTrackingBtn);

        const scrollUpTime = await scrollUpStudy();
        data.push(["Up", scrollUpTime.toFixed(2)]);
    }
    console.log("endStudy called");
    logDataToCSV(data);
    endStudy();
}

function logDataToCSV(data) {
    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "study_data.csv";
    link.click();
    console.log("CSV file saved");
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
        const startTime = Date.now();

        const handleScroll = () => {
            
            if(isTracking){
                const currentScrollPosition = window.scrollY - startScrollPosition;
                const viewportHeight = window.innerHeight;
                const totalHeight = document.body.scrollHeight - viewportHeight;

                const scrollPercentage = Math.round((currentScrollPosition / totalHeight) * 100);
                progressDisplay.textContent = `Scroll progress: ${Math.max(0, scrollPercentage)}%`;

                if (scrollPercentage >= 25) {
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    console.log(`User has scrolled down 25% of the page in ${elapsedTime.toFixed(2)} seconds.`);
                    isTracking = false;
                    window.removeEventListener("scroll", handleScroll);
                    resetStudyScreen();
                    resolve(elapsedTime);
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
        const startTime = Date.now();

        const handleScroll = () => {
            if (isTracking) {
                
                const currentScrollPosition = window.scrollY - startScrollPosition;
                const viewportHeight = window.innerHeight;
                const totalHeight = document.body.scrollHeight - viewportHeight;

                const scrollPercentage = Math.round((currentScrollPosition / totalHeight) * 100);
                progressDisplay.textContent = `Scroll progress: ${Math.min(0, scrollPercentage)}%`;

                // Check if user has scrolled down 25%
                if (scrollPercentage <= -25) {
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    console.log(`User has scrolled up 25% of the page in ${elapsedTime.toFixed(2)} seconds.`);
                    isTracking = false;
                    window.removeEventListener("scroll", handleScroll);
                    resetStudyScreen();
                    resolve(elapsedTime);
                }


            }
        }

        window.addEventListener("scroll", handleScroll);
    });

}

