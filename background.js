// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('Voice-Activated Web Navigation extension installed.');
  });
  
  // Optional: Handle actions when the extension icon is clicked
  chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
  });
  