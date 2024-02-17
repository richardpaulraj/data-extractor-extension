// Listen for messages from injected content script and sends to popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.links) {
    chrome.runtime.sendMessage({ data: msg.links, type: 'links' })
  } else if (msg.emails) {
    chrome.runtime.sendMessage({ data: msg.emails, type: 'emails' })
  }
})
