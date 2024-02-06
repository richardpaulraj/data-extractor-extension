// chrome.storage.get(['links'], (res) => {})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log(msg)
  console.log(sender)
  console.log(sendResponse)

  if (msg) {
    chrome.runtime.sendMessage(msg)
  }
})
