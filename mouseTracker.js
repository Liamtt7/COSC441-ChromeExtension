export function trackMouseMovement(callback) {
    let lastMousePosition = { x: 0, y: 0 };
    let movementStartTime = null;

    document.addEventListener('mousemove', (event) => {
        if (!movementStartTime) {
            movementStartTime = Date.now();
        }
        
        const movementEndTime = Date.now();
        const duration = movementEndTime - movementStartTime;
        const distance = Math.sqrt(
            Math.pow(event.clientX - lastMousePosition.x, 2) + Math.pow(event.clientY - lastMousePosition.y, 2)
        );
        
        callback(distance, duration);
        lastMousePosition = { x: event.clientX, y: event.clientY };
    });
}