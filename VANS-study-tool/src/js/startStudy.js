// Initialize variables for tracking time and state
let studyActive = false;
let isTracking = false;

//DOM elements
const startStudyBtn = document.getElementById("start-study-btn");
const studyScreen = document.querySelector(".study-screen");
const mainScreen = document.querySelector("main");
const startTrackingBtn = document.getElementById("start-tracking-btn");
const instructions = document.getElementById("instructions");
const progressDisplay = document.getElementById("progress");

//last scroll position. Used in logic in the study functions.
let lastScrollPosition = 0;

let reps = 3;


// Switch to the study screen
startStudyBtn.addEventListener("click", () => {
    mainScreen.style.display = "none";
    studyScreen.style.display = "flex";
    window.scrollBy({
        top: studyScreen.offsetHeight / 2,
        behavior: 'auto'
    });
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
            button.removeEventListener("click", handleClick);
            resolve();
        };
        button.addEventListener("click", handleClick);
    });
}

//Controls the flow of tasks, manually rearranged to compensate for learnability.
async function studyController() {
    const data = [["Task", "Task Time"]]

    for (let i = 0; i < reps; i++) {
        await waitForButtonClick(startTrackingBtn);
        const scrollUpTime = await scrollUpStudy();
        data.push(["Up", scrollUpTime.toFixed(2)]);
    }
    for(let i = 0; i < reps; i++){
        await waitForButtonClick(startTrackingBtn);
        const scrollDownTime = await scrollDownStudy();
        data.push(["Down", scrollDownTime.toFixed(2)]);
    }
    for (let i = 0; i < reps; i++) {
        await waitForButtonClick(startTrackingBtn);
        const scrollToMiddleTime = await scrollToMiddleStudy();
        data.push(["middle", scrollToMiddleTime.toFixed(2)]);
    }
    for (let i = 0; i < reps; i++) {
        await waitForButtonClick(startTrackingBtn);
        const scrollToBottomTime = await scrollToBottomStudy();
        data.push(["bottom", scrollToBottomTime.toFixed(2)]);
    }
    for (let i = 0; i < reps; i++) {
        await waitForButtonClick(startTrackingBtn);
        const scrollToTopTime = await scrollToTopStudy();
        data.push(["top", scrollToTopTime.toFixed(2)]);
    }


    console.log("endStudy called");
    logDataToCSV(data);
    endStudy();

}

//logs the data to a csv file and downloads it to the browser.
function logDataToCSV(data) {
    const csvContent = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "study_data.csv";
    link.click();
    console.log("CSV file saved");
}

//resets to the midle of the screen to prepare for the next study
function resetStudyScreen() {
    const halfHeight = studyScreen.offsetHeight / 2;
    // Scroll the page so that the view aligns with 50% of the study-screen height
    window.scrollTo({
        top: studyScreen.offsetTop + halfHeight - (window.innerHeight / 2),
        behavior: 'auto'
    });
    disableScrolling();
    instructions.textContent = "";
}

function disableScrolling() {
    document.body.style.overflow = 'hidden';
}
function enableScrolling() {
    document.body.style.overflow = '';
}

//Detects when a user has scrolled down 25% of the page
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

//Detects when a user has scrolled up 25% of the page
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

//Detects when a user has scrolled to the top of the page
function scrollToTopStudy(){
    return new Promise((resolve) => {
        instructions.textContent = "Say 'scroll to top'";
        const startTime = Date.now();

        const handleScroll = () => {
            if (isTracking) {
                
                const currentScrollPosition = window.scrollY;
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

                // Update progress display to show percentage of scroll up
                const scrollPercentage = Math.round((currentScrollPosition / totalHeight) * 100);
                progressDisplay.textContent = `Scroll progress: ${Math.min(100, Math.round((currentScrollPosition / totalHeight) * 100))}%`;

                // Check if user has scrolled up 100%
                if (scrollPercentage <= 0) {
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    console.log(`User has scrolled up 100% of the page in ${elapsedTime.toFixed(2)} seconds.`);
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


//Detects when a user has scrolled to the bottom of the page
function scrollToBottomStudy() {
    return new Promise((resolve) => {
        instructions.textContent = "Say 'scroll to bottom'";
        const startTime = Date.now();

        const handleScroll = () => {
            if (isTracking) {
                const currentScrollPosition = window.scrollY + window.innerHeight;
                const totalHeight = document.documentElement.scrollHeight;

                progressDisplay.textContent = `Scroll progress: ${Math.min(100, Math.round((currentScrollPosition / totalHeight) * 100))}%`;

                // Check if user has reached the bottom of the page
                if (currentScrollPosition >= totalHeight) {
                    const elapsedTime = (Date.now() - startTime) / 1000;
                    console.log(`User has scrolled to the bottom of the page in ${elapsedTime.toFixed(2)} seconds.`);
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

//Detects when a user has scrolled to the middle of the page
function scrollToMiddleStudy() {
    return new Promise((resolve) => {
        // Scroll to the top of the page
        window.scrollTo(0, 0);

        instructions.textContent = "Say 'scroll to middle'";
        const startTime = Date.now();

        const handleScroll = () => {
            const currentScrollPosition = window.scrollY + window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            const halfwayPoint = totalHeight / 2;

            progressDisplay.textContent = `Scroll progress: ${Math.min(100, Math.round((currentScrollPosition / totalHeight) * 100))}%`;

            // Check if user has reached or passed the halfway point of the page
            if (currentScrollPosition >= halfwayPoint) {
                const elapsedTime = (Date.now() - startTime) / 1000;
                console.log(`User has scrolled to at least 50% of the page in ${elapsedTime.toFixed(2)} seconds.`);
                window.removeEventListener("scroll", handleScroll);
                resetStudyScreen();
                resolve(elapsedTime);
            }
        };

        window.addEventListener("scroll", handleScroll);
    });
}

