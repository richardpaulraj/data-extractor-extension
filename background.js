// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.links) {
    // Forward messages to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // chrome.tabs.sendMessage(tabs[0].id, msg)
      chrome.runtime.sendMessage(msg.links)
    })
  } else if (msg.emails) {
    chrome.runtime.sendMessage(msg.emails)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // chrome.tabs.sendMessage(tabs[0].id, msg)
      chrome.runtime.sendMessage(msg.links)
    })
  }
})
