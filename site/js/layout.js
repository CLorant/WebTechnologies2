window.BACKEND_URL = 'http://localhost:5000';

$(() => {
    $("#header").load("./components/header.html"); 
    $("#footer").load("./components/footer.html");
});

function toggleSideNav() {
    $('#menu-toggle').toggleClass('active');
    $('#side-nav').toggleClass('show');
    $('#dark-mobile-bg').toggleClass('show');
    $('body').toggleClass('overflow-hidden');
}