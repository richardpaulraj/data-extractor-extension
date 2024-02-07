const savedLinks = document.getElementById('savedLinks')

chrome.storage.local.get('bookmarkedLinks', (e) => {
  let bookmarkedLinks = e.bookmarkedLinks || []
  console.log(bookmarkedLinks)
  if (bookmarkedLinks) {
    bookmarkedLinks.forEach((eachBookmark) => {
      const li = document.createElement('li')
      const a = document.createElement('a')

      a.href = eachBookmark
      a.textContent = eachBookmark

      li.appendChild(a)

      savedLinks.appendChild(li)
    })
  }
})
