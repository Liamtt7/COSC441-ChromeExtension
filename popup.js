// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-btn');

  // Send a message to the content script to toggle voice recognition
  toggleBtn.addEventListener('click', () => {
    toggleVoiceRecognition();
  });

  // Update button text based on listening state
  updateButtonState();
});

function toggleVoiceRecognition() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('Sending toggle message to content script.');
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
        alert('Error: ' + chrome.runtime.lastError.message);
      } else {
        const toggleBtn = document.getElementById('toggle-btn');
        toggleBtn.textContent = response.isListening ? 'Stop Listening' : 'Start Listening';
        console.log('Received response from content script:', response);
      }
    });
  });
}

function updateButtonState() {
  const toggleBtn = document.getElementById('toggle-btn');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting status:', chrome.runtime.lastError);
        toggleBtn.textContent = 'Start Listening';
      } else {
        toggleBtn.textContent = response.isListening ? 'Stop Listening' : 'Start Listening';
        console.log('Received status from content script:', response);
      }
    });
  });
}
