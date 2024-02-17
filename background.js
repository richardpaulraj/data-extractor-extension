// Listen for messages from injected content script and sends to popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.links) {
    chrome.runtime.sendMessage(msg.links)
  } else if (msg.emails) {
    chrome.runtime.sendMessage(msg.emails)
  }
})
