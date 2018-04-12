let slideIndex = 1;

window.onload = (e) => {
    showSlides(slideIndex);
};

// Open the Modal
function openModal() {
  document.getElementById('asteroid').style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById('tds').style.display = "none";
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let captionText = document.querySelector("#caption");
    
    let slides;
    let slideDeck = n/4;
    
    console.log(slideDeck);
    
    if(slideDeck <= 1){
        slides = document.getElementsByClassName("asteroids");
        slideIndex = 1;
    }
    
    if(slideDeck > 1 && slideDeck <= 2){
        slides = document.getElementsByClassName("td");
        slideIndex = 5;
    }
    
    let dots = document.getElementsByClassName("demo");

    if (n > slides.length) {slideIndex = 1}

    if (n < 1) {slideIndex = slides.length}

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";

    captionText.innerHTML = dots[slideIndex-1].alt;
}