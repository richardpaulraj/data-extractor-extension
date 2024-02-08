const ol = document.getElementById('ol')
const getLinks = document.getElementById('getLinks')
const linkCount = document.getElementById('linkCount')
const buttonsContainer = document.getElementById('buttonsContainer')

function injectContentScript() {
  const links = []

  const aTags = document.getElementsByTagName('a')
  for (const tag of aTags) {
    links.push(tag.href)
  }

  chrome.runtime.sendMessage({ links: links })
}

getLinks.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: injectContentScript,
    })
  })
})

// Handle messages from the background script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.links) {
    // Clear existing list items
    ol.innerHTML = ''

    //copying to clipboard
    displayButtons(msg.links)
    // Iterate over the array of links and create list items
    let linkCounter = 0
    msg.links.forEach((link) => {
      if (link !== '') {
        let bookmarkIconFlag = true

        let li = document.createElement('li')
        let a = document.createElement('a')
        let bookmarkIcon = document.createElement('img')
        let bookmarkLinkContainer = document.createElement('div')

        a.textContent = link
        a.href = link
        a.target = '_blank'
        a.style.color = 'black'
        bookmarkIcon.src = '../bookmark.svg'
        bookmarkIcon.classList.add('bookmarkIcon')
        bookmarkIcon.addEventListener('click', () => {
          // Button click event handler
          bookmarkIconFlag = !bookmarkIconFlag
          if (bookmarkIconFlag) {
            bookmarkIcon.src = '../bookmark.svg'

            chrome.storage.local.get('bookmarkedLinks', (e) => {
              let bookmarkedLinks = e.bookmarkedLinks || []
              bookmarkedLinks = bookmarkedLinks.filter(
                (bookmark) => bookmark !== link
              )
              chrome.storage.local.set({
                bookmarkedLinks: bookmarkedLinks,
              })
            })
          } else {
            bookmarkIcon.src = '../bookmarkSelected.svg'

            chrome.storage.local.get('bookmarkedLinks', (e) => {
              let bookmarkedLinks = e.bookmarkedLinks || []
              bookmarkedLinks.push(link)
              chrome.storage.local.set({
                bookmarkedLinks: bookmarkedLinks,
              })
            })
          }
        })
        bookmarkLinkContainer.classList.add('bookmarkLinkContainer')

        bookmarkLinkContainer.appendChild(bookmarkIcon) // Append button to the list item
        bookmarkLinkContainer.appendChild(a)
        li.appendChild(bookmarkLinkContainer)
        ol.appendChild(li)

        linkCounter++
      }
    })

    linkCount.textContent = `Total Links : ${linkCounter}`
  }
})

let copyBtn

function displayButtons(links) {
  buttonsContainer.innerHTML = ''
  getLinks.style.display = 'none'
  //Copy to Clipboard button
  copyBtn = document.createElement('button')
  copyBtn.textContent = 'Copy to clipboard'
  copyBtn.classList.add('copyBtn')
  copyBtn.addEventListener('click', () => {
    copyToClipboard(links)
  })
  buttonsContainer.appendChild(copyBtn)

  //Bookmark Button
  const bookmarkBtn = document.createElement('button')
  bookmarkBtn.textContent = "Bookmark's"
  bookmarkBtn.classList.add('bookmarkBtn')

  buttonsContainer.appendChild(bookmarkBtn)

  bookmarkBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage()
  })
}

function copyToClipboard(links) {
  const linkText = links.join('\n')
  navigator.clipboard
    .writeText(linkText)
    .then(() => (copyBtn.textContent = 'Copied :)'))
}
