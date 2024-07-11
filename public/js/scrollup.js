const scrollup = () =>{
    const scrollup = document.getElementById('scroll-up');
    this.scrollY >= 350 ? scrollup.classList.add('show-scroll') : scrollup.classList.remove('show-scroll')
}

window.addEventListener('scroll', scrollup);