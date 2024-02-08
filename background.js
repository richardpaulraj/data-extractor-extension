// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Forward messages to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // chrome.tabs.sendMessage(tabs[0].id, msg)
    chrome.runtime.sendMessage(msg)
  })
})
