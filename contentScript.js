// // This script runs in the context of web pages

function findHyperlinks() {
  const hyperlinks = Array.from(document.querySelectorAll('a')).map(a => a.href);
  chrome.runtime.sendMessage({ action: 'sendHyperlinks', hyperlinks });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanHyperlinks') {
    findHyperlinks();
  }
});
