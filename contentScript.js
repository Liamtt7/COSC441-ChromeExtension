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
  command = command.toLowerCase(); // Normalize the command to lowercase for consistent matching

  if (command.includes('scroll down')) {
    window.scrollBy(0, window.innerHeight / 2);
  } else if (command.includes('scroll up')) {
    window.scrollBy(0, -window.innerHeight / 2);
  } else if (command.includes('scroll to top')) {
    window.scrollTo(0, 0);
  } else if (command.includes('scroll to bottom')) {
    window.scrollTo(0, document.body.scrollHeight);
  } else if (command.includes('scroll to middle')) {
    const middlePosition = (document.body.scrollHeight - window.innerHeight) / 2;
    window.scrollTo(0, middlePosition);
  } else if (command.match(/scroll (\d+)%/)) {
    const match = command.match(/scroll (\d+)%/);
    const percentage = parseInt(match[1]);
    if (percentage >= 0 && percentage <= 100) {
      const scrollPosition = (document.body.scrollHeight - window.innerHeight) * (percentage / 100);
      window.scrollTo(0, scrollPosition);
    } else {
      console.log('Percentage out of range (0-100).');
    }
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

  const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');

  const body = document.body;

  const walker = document.createTreeWalker(
    body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (node.parentNode && node.parentNode.nodeName !== 'SCRIPT' && node.parentNode.nodeName !== 'STYLE') {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    },
    false
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
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
        mark.style.backgroundColor = 'yellow'; // Ensure highlight color
        mark.style.color = 'black';
        fragment.appendChild(mark);
        lastIndex = regex.lastIndex;
      }

      const remainingText = node.nodeValue.substring(lastIndex);
      if (remainingText) {
        fragment.appendChild(document.createTextNode(remainingText));
      }

      node.parentNode.replaceChild(fragment, node);
    }
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedHighlightText = debounce(highlightText, 300);


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
