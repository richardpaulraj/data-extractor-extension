const ol = document.getElementById('ol')
const getLinks = document.getElementById('getLinks')
const getEmails = document.getElementById('getEmails')
const linkCount = document.getElementById('linkCount')
const buttonsContainer = document.getElementById('buttonsContainer')

function injectContentScript() {
  const links = []

  const aTags = document.getElementsByTagName('a')
  for (const tag of aTags) {
    links.push(tag.href)
  }

  chrome.runtime.sendMessage({ links: links, type: 'links' })
}
function injectContentScriptForEmails() {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const bodyText = document.body.innerText
  const emailMatches = bodyText.matchAll(emailRegex)
  const extractedEmails = Array.from(emailMatches).map((match) => match[0])
  chrome.runtime.sendMessage({ emails: extractedEmails, type: 'emails' })
}

getLinks.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: injectContentScript,
    })
  })
})
getEmails.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: injectContentScriptForEmails,
    })
  })
})

// Handle messages from the background script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && Array.isArray(msg)) {
    // Clear existing list items
    ol.innerHTML = ''

    //copying to clipboard
    displayButtons(msg)
    // Iterate over the array of links and create list items
    let linkCounter = 0
    msg.forEach((link) => {
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

    console.log(msg)

    if (msg.type === 'links') {
      linkCount.textContent = `Total Links : ${linkCounter}`
      console.log('links')
    } else if (msg.type === 'emails') {
      linkCount.textContent = `Total Links : ${linkCounter}`
      console.log('emails')
    }
  }
})

let copyBtn //Declaring it outside because I am using it in copyToClipboard function

function displayButtons(links) {
  buttonsContainer.innerHTML = ''
  getLinks.style.display = 'none'
  getEmails.style.display = 'none'
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
