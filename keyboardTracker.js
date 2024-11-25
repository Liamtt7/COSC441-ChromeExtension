export function trackKeyPress(callback) {
    let keyPressStartTime = null;

    document.addEventListener('keydown', (event) => {
        keyPressStartTime = Date.now();
    });

    document.addEventListener('keyup', (event) => {
        const keyPressEndTime = Date.now();
        const duration = keyPressEndTime - keyPressStartTime;
        callback(duration);
    });
}