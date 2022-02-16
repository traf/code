// Smooth scroll on filter click
const options = document.querySelectorAll('.notion-dropdown__option')
if(document.documentElement.scrollTop > 400) {
  options.forEach((option) => {
    option.addEventListener('click', () => {
       window.scrollTo({top: 400, behavior: "smooth"})
    })  
  }) 
} 

// Active filter class
function onPageLoad() {
    const header = document.querySelector('.notion-header');
    const options = document.querySelectorAll('.notion-dropdown__option')
    const currentTab = document.querySelector('.notion-dropdown__button-title').textContent
    const setActiveTab = () => {
        const active = Array.from(options).find(el => el.textContent === currentTab);
        active.classList.add('active-filter')
        options.forEach((option) => {
            option.addEventListener('click', () => {
                const activeFilter = document.querySelector('.active-filter')
                if(activeFilter) { 
                    activeFilter.classList.remove('active-filter')
                }
                option.classList.add('active-filter')
            })
        })
    }
    setActiveTab()
        const config = { subtree: true, characterData: true };
        const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                setActiveTab()
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(header, config);
}
document.addEventListener("DOMContentLoaded", onPageLoad);