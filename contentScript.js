// contentScript.js

console.log('Content script loaded.');

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
    alert('Voice recognition stopped.'); //change for a temporary pop-up

    // Remove scroll percentage updates when stopping voice recognition
    window.removeEventListener('scroll', updateScrollPercentage);
  } else {
    initializeVoiceRecognition();
    recognition.start();
    isListening = true;
    console.log('Voice recognition activated.');
    alert('Voice recognition started.'); //change for a temporary pop-up

  }
}

const initialStyles = {
  zoom: document.body.style.zoom || "1",
  transform: document.body.style.transform || "",
  fontSize: document.body.style.fontSize || ""
};

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
    document.body.style.zoom = (parseFloat(document.body.style.zoom) || 1) + 0.2;
  } else if (command.includes('zoom out')) {
    document.body.style.zoom = (parseFloat(document.body.style.zoom) || 1) - 0.2;
  } else if (command.includes('reset zoom')) {
    document.body.style.zoom = initialZoom; // Reset to the stored initial state
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
  traverseDOM(document.body, regex);
}

function traverseDOM(element, regex) {
  for (let node of element.childNodes) {
    if (node.nodeType === 3) { // Text node
      const matches = node.nodeValue.match(regex);
      if (matches) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        regex.lastIndex = 0;
        let match;

        while ((match = regex.exec(node.nodeValue)) !== null) {
          const precedingText = node.nodeValue.substring(lastIndex, match.index);
          if (precedingText) {
            fragment.appendChild(document.createTextNode(precedingText));
          }
          const mark = document.createElement('mark');
          mark.textContent = match[0];
          fragment.appendChild(mark);
          lastIndex = regex.lastIndex;
        }

        const remainingText = node.nodeValue.substring(lastIndex);
        if (remainingText) {
          fragment.appendChild(document.createTextNode(remainingText));
        }

        node.parentNode.replaceChild(fragment, node);
      }
    } else if (node.nodeType === 1) { // Element node
      traverseDOM(node, regex);
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

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);

  if (request.action === 'toggle') {
    toggleVoiceRecognition();
    sendResponse({ isListening });
  } else if (request.action === 'getStatus') {
    sendResponse({ isListening });
  }
});
