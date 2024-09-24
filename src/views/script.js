document.addEventListener('DOMContentLoaded', function () {
  const navbarToggle = document.getElementById('navbarToggle')
  const navbarLinks = document.getElementById('navbarLinks')

  navbarToggle.addEventListener('click', function () {
    navbarLinks.style.display = navbarLinks.style.display === 'flex' ? 'none' : 'flex'
  })
})
