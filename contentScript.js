// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg && msg.action === 'fetchLinks') {
//     fetchLinks()
//   }
// })

// function fetchLinks() {
//   const links = []

//   const aTags = document.getElementsByTagName('a')
//   for (const tag of aTags) {
//     links.push(tag.href)
//   }

//   chrome.runtime.sendMessage({ links: links })
// }
