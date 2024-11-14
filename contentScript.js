// contentScript.js

let recognition;
let isListening = false;

function initializeVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Your browser does not support Speech Recognition.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;

  recognition.onstart = () => {
    console.log('Voice recognition started.');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log('Heard:', transcript);
    handleVoiceCommand(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Voice recognition error:', event.error);
    // Optionally, you can restart recognition on certain errors
  };

  recognition.onend = () => {
    if (isListening) {
      recognition.start(); // Restart recognition if it stopped unexpectedly
    }
  };
}

function toggleVoiceRecognition() {
  if (isListening) {
    recognition.stop();
    isListening = false;
    console.log('Voice recognition stopped.');
    alert('Voice recognition stopped.');
  } else {
    initializeVoiceRecognition();
    recognition.start();
    isListening = true;
    console.log('Voice recognition activated.');
    alert('Voice recognition started.');
  }
}

function handleVoiceCommand(command) {
  if (command.includes('scroll down')) {
    window.scrollBy(0, window.innerHeight / 2);
  } else if (command.includes('scroll up')) {
    window.scrollBy(0, -window.innerHeight / 2);
  } else if (command.includes('scroll to top')) {
    window.scrollTo(0, 0);
  } else if (command.includes('scroll to bottom')) {
    window.scrollTo(0, document.body.scrollHeight);
  } else if (command.includes('zoom in')) {
    document.body.style.zoom = (parseFloat(document.body.style.zoom) || 1) + 0.1;
  } else if (command.includes('zoom out')) {
    document.body.style.zoom = (parseFloat(document.body.style.zoom) || 1) - 0.1;
  } else if (command.includes('reset zoom')) {
    document.body.style.zoom = 1;
  } else if (command.includes('search for')) {
    const searchTerm = command.replace('search for', '').trim();
    if (searchTerm) {
      highlightText(searchTerm);
    }
  } else if (command.includes('stop listening')) {
    toggleVoiceRecognition();
  } else {
    console.log('Command not recognized.');
  }
}

function highlightText(term) {
  if (!term) return;

  // Remove previous highlights
  removeHighlights();

  const regex = new RegExp(`(${term})`, 'gi');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (regex.test(node.nodeValue)) {
      const span = document.createElement('mark');
      span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
      node.parentNode.replaceChild(span, node);
    }
  }
}

function removeHighlights() {
  const marks = document.querySelectorAll('mark');
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    toggleVoiceRecognition();
  }
  // contentScript.js (additional code)

// Update the message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
      toggleVoiceRecognition();
      sendResponse({ isListening });
    } else if (request.action === 'getStatus') {
      sendResponse({ isListening });
    }
  });
  
});
