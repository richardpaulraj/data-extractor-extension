const savedLinks = document.getElementById('savedLinks')
const bookmarkClearAll = document.getElementById('bookmarkClearAll')

chrome.storage.local.get('bookmarkedLinks', (e) => {
  let bookmarkedLinks = e.bookmarkedLinks || []

  if (bookmarkedLinks) {
    bookmarkedLinks.forEach((eachBookmark) => {
      const li = document.createElement('li')
      const a = document.createElement('a')

      a.href = eachBookmark
      a.textContent = eachBookmark

      li.appendChild(a)

      savedLinks.appendChild(li)

      //Clear all Btn
      const clearAllBtn = document.createElement('button')
      clearAllBtn.textContent = 'Clear All'
      clearAllBtn.classList.add('clearAllBtn')
      clearAllBtn.addEventListener('click', () => {
        chrome.storage.local.clear(function () {
          console.log('Local storage cleared')
        })
      })

      bookmarkClearAll.appendChild(clearAllBtn)
    })
  }
})
