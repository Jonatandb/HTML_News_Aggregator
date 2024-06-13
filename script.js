
const API_KEY = '4f14401d8e214579a857b024a6d257d3' // This free API KEY only works on localhost.

let currentPage = 1
let currentCategory = null
let currentKeyword = null
let isLoading = false
let lastArticleCount = 0

function fetchNews(isSearching) {
  if(isLoading) return

  isLoading = true
  let url
  if (isSearching) {
    const keyword = document.getElementById('searchKeyword').value
    url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${API_KEY}&page=${currentPage}`
  } else {
    const category = currentCategory || document.getElementById('category').value
    url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&category=${category}&page=${currentPage}`
  }

  fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Api not working.')
    })
    .then(data => {
    const newsContainer = document.getElementById('newsContainer')
    if (currentPage === 1) {
      newsContainer.innerHTML = ""
    }
    const articlesWithImage = data?.articles?.filter(art => art.urlToImage) || []

    if (articlesWithImage.length === 0 || articlesWithImage.length === lastArticleCount) {
      displayNoMoreNews()
      isLoading = false
      return
    }

    lastArticleCount = articlesWithImage.length

    articlesWithImage.forEach(art => {
      const newsItem = `
      <div class="newsItem">
        <div class="newsImage">
          <img src="${art.urlToImage}" alt="${art.title}">
        </div>
        <div class="newsContent">
          <div class="info">
            <h5>${art.source.name}</h5>
            <span>|</span>
            <h5>${art.publishedAt}</h5>
          </div>
            <h2>${art.title}</h2>
            <p>${art.description}</p>
            <a href="${art.url}" target="_blank">Read More</a>
        </div>
      </div>
      `
      newsContainer.innerHTML += newsItem

    })

    currentPage++
    isLoading = false

  }).catch(err => {
      console.error("There was an error fetching the news", err)
      isLoading = false
  })
}

function displayNoMoreNews() {
  const newsContainer = document.getElementById('newsContainer')
  newsContainer.innerHTML += '<p id="noMoreNews">No more news to load.</p>'
}

window.onscroll = function () {
  const noMoreNews = document.getElementById('noMoreNews')
  if(!noMoreNews) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
      if (currentKeyword) {
        fetchNews(true)
      } else {
        fetchNews(false)
      }
    }
  }
}

document.getElementById('searchKeyword').addEventListener('input', function () {
  currentPage = 1
  currentCategory = null
  currentKeyword = this.value
})

document.getElementById('fetchCategory').addEventListener('click', function () {
  currentPage = 1
  currentCategory = null
  currentKeyword = null
  fetchNews(false)
})