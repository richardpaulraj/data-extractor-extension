const savedLinks = document.getElementById('savedLinks')
const clearAllBtn = document.querySelector('.clearAllBtn')

function updateBookmarkList() {
  savedLinks.innerHTML = '' // Clear the existing bookmarks list

  chrome.storage.local.get('bookmarkedLinks', (e) => {
    const bookmarkedLinks = e.bookmarkedLinks || []

    //for dispalying my clearAllBtn
    if (bookmarkedLinks != '') {
      clearAllBtn.style.display = 'block'
    } else {
      clearAllBtn.style.display = 'none'
    }

    if (bookmarkedLinks) {
      bookmarkedLinks.forEach((eachBookmark) => {
        const div = document.createElement('div')
        const a = document.createElement('a')
        const cancel = document.createElement('p')

        div.classList.add('cancelAndLinkContainer')

        cancel.classList.add('cancelEachBookmark')
        cancel.textContent = 'x'

        a.href = eachBookmark
        a.textContent = eachBookmark

        div.append(cancel)
        div.appendChild(a)

        savedLinks.appendChild(div)

        cancel.addEventListener('click', () => {
          chrome.storage.local.get('bookmarkedLinks', (e) => {
            let newBookmarkedLinks = e.bookmarkedLinks.filter(
              (bookmark) => bookmark !== eachBookmark
            )
            chrome.storage.local.set({ bookmarkedLinks: newBookmarkedLinks })
          })
          updateBookmarkList()
        })
      })
    }
  })
}

document.addEventListener('DOMContentLoaded', updateBookmarkList)

// Clear all bookmarks when the button is clicked
clearAllBtn.addEventListener('click', () => {
  chrome.storage.local.remove('bookmarkedLinks', () => {
    updateBookmarkList()
  })
})

// Listen for changes to bookmarks and update the UI accordingly
chrome.storage.onChanged.addListener((changes, areaName) => {
  //   console.log(changes)//here even I am getting the previous value with that I can add undo and redo functions
  if (areaName === 'local' && 'bookmarkedLinks' in changes) {
    updateBookmarkList()
  }
})
