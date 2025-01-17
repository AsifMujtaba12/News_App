const categories = ['business', 'entertainment', 'health', 'science', 'sports', 'technology'];
let currentCategory = 'business';
let currentPage = 1;
let pageSize = 12;
let isLoading = false;
const apiKey = '220384b953234a4d88bad5808df8ca7b'
let searchQuery = '';


const navDrawer = document.getElementById('nav-drawer');
const navBar = document.getElementById('nav-bar');
const drawerBar = document.getElementById('drawer-bar');
const toggleButton = document.getElementById('toggle-mode');
const errorDiv = document.getElementById('error');
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const menuButton = document.getElementById('menu-btn');
const closeDrawerButton = document.getElementById('close-drawer-btn');



function createCategoryElements(parent) {
    categories.forEach(category => {
        const navItem = document.createElement('div');
        navItem.classList.add('nav-item');
        navItem.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        navItem.addEventListener('click', () => {
            currentCategory = category;
            currentPage = 1;
            newsContainer.innerHTML = '';
            fetchNews();
            navDrawer.classList.remove('open')
        })
        parent.appendChild(navItem);
    })
}

// fetch news  through api
async function fetchNews() {
    if(isLoading) return;
    isLoading = true;  //agar true nahi hai true karo  
    errorDiv.classList.add('hidden'); 
    try {
       const queryParam = searchQuery ? `&q=${searchQuery}` : `&category=${currentCategory}`; 
       const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&page=${currentPage}&pageSize=${pageSize}${queryParam}&apiKey=${apiKey}`);
       const data = await response.json();
       console.log(data);
       displayNews(data.articles);
       currentPage++;
    } catch (error){
       errorDiv.classList.remove('hidden');
    } finally {
       isLoading = false;
    }
   }
  //display the News data on page
   function displayNews(articles) {
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.innerHTML = `<img src="${article.urlToImage || 'default.jpg'}" alt="News Image" />
        <div class="content">
         <h2>${article.title}</h2>
         <p>${article.description || 'No news description available'}</p>
         <a href="${article.url}" target="_blank">Read more</a>
        </div>`
        newsContainer.appendChild(newsItem);
    })
}
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 500){
        fetchNews();
    }
})
document.addEventListener('DOMContentLoaded', () => {
    navDrawer.classList.remove('open'); // Ensure sidebar is hidden
});

let debounceTimer;


function debounce(fun, delay) {
    return (...args) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fun(...args);
        }, delay)
    }
}
// search input
searchInput.addEventListener('input', debounce((e) => {
    searchQuery = e.target.value;
    currentPage = 1;
    newsContainer.innerHTML = '';
    fetchNews();
}, 300))

// menu button click handler --> open and close menu
menuButton.addEventListener('click', () => navDrawer.classList.toggle('open'))
closeDrawerButton.addEventListener('click', () => navDrawer.classList.toggle('open'))


// toggle dark mode
toggleButton.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');   //change css to dark mode // .toggle checks class is present or not  agar hogi hata dega  agar nahi add kar dega
// Updates the button text/icon based on the current mode
toggleButton.innerHTML = document.body.classList.contains('dark-mode')   // if current mode is dark return true otherwise return false 
? `<span class="material-symbols-outlined">light_mode</span>` 
: `<span class="material-symbols-outlined">nightlight</span>`;
toggleButton.title = document.body.classList.contains('dark-mode')
 ? "Switch to Light Mode"
 : "Switch to Dark Mode";
})
createCategoryElements(navBar);
createCategoryElements(drawerBar);
fetchNews();