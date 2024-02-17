const ol = document.getElementById('ol')
const getLinks = document.getElementById('getLinks')
const getEmails = document.getElementById('getEmails')
const linksCounter = document.getElementById('linksCounter')
const innerButtons = document.getElementById('innerButtons')
const nameWrapper = document.getElementById('myNameWrapper')

function injectContentScriptForLinks() {
  const links = []

  const aTags = document.getElementsByTagName('a')
  for (const tag of aTags) {
    links.push(tag.href)
  }

  chrome.runtime.sendMessage({ links: links })
}
function injectContentScriptForEmails() {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const bodyText = document.body.innerText
  const emailMatches = bodyText.matchAll(emailRegex)
  const extractedEmails = Array.from(emailMatches).map((match) => match[0])
  chrome.runtime.sendMessage({ emails: extractedEmails })
}

getLinks.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: injectContentScriptForLinks,
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
    let counter = 0
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
        a.classList.add('linksATag')
        bookmarkIcon.src = '../icons/bookmark.svg'
        bookmarkIcon.classList.add('bookmarkIcon')
        bookmarkIcon.addEventListener('click', () => {
          // Button click event handler
          bookmarkIconFlag = !bookmarkIconFlag
          if (bookmarkIconFlag) {
            bookmarkIcon.src = '../icons/bookmark.svg'

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
            bookmarkIcon.src = '../icons/bookmarkSelected.svg'

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

        counter++
      }
    })
    if (counter === 0) {
      linksCounter.textContent = `Sorry, no data found.`
    } else if (msg.some((item) => item.includes('@'))) {
      linksCounter.textContent = `Total Emails : ${counter}`
    } else {
      linksCounter.textContent = `Total Links : ${counter}`
    }
  }
})

let copyBtn //Declaring it outside because I am using it in copyToClipboard function

function displayButtons(links) {
  innerButtons.innerHTML = ''
  getLinks.style.display = 'none'
  getEmails.style.display = 'none'
  nameWrapper.style.display = 'none'
  //Copy to Clipboard button
  copyBtn = document.createElement('button')
  copyBtn.textContent = 'Copy to clipboard'
  copyBtn.classList.add('copyBtn')
  copyBtn.addEventListener('click', () => {
    copyToClipboard(links)
  })
  innerButtons.appendChild(copyBtn)

  //Bookmark Button
  const bookmarkBtn = document.createElement('button')
  bookmarkBtn.textContent = "Bookmark's"
  bookmarkBtn.classList.add('bookmarkBtn')

  innerButtons.appendChild(bookmarkBtn)

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
