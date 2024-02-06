const links = []

const aTags = document.getElementsByTagName('a')
for (const tag of aTags) {
  links.push(tag.href)
}

chrome.storage.local.set({
  links,
})

chrome.runtime.sendMessage(null, links)

console.log(links)
