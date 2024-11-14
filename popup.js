// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
  
    // Send a message to the content script to toggle voice recognition
    toggleBtn.addEventListener('click', () => {
      toggleVoiceRecognition();
    });
  
    // Update button text based on listening state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getStatus' },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            toggleBtn.textContent = 'Start Listening';
          } else {
            toggleBtn.textContent = response.isListening ? 'Stop Listening' : 'Start Listening';
          }
        }
      );
    });
  });
  
  function toggleVoiceRecognition() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          alert('Error: ' + chrome.runtime.lastError.message);
        } else {
          const toggleBtn = document.getElementById('toggle-btn');
          toggleBtn.textContent = response.isListening ? 'Stop Listening' : 'Start Listening';
        }
      });
    });
  }
  