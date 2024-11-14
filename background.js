// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log('Voice-Activated Web Navigation extension installed.');
});

// No additional code is needed here since all user interactions are handled in popup.js and contentScript.js
