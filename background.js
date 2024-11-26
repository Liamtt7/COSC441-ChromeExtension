// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Voice-Activated Web Navigation extension installed.');
});

// Listen for action (extension icon click)
chrome.action.onClicked.addListener((tab) => {
  // Inject JavaScript files into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["dom-setup.js", "scroll-percentage.js"], // Ensure these files exist in your extension directory
  });

  // Inject CSS files into the current tab
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["popup.css"], // Ensure this CSS file exists
  });
});


// No additional code is needed here since all user interactions are handled in popup.js and contentScript.js
