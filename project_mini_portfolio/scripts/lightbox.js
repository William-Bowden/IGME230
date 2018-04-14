let slideIndex = 1;

// Open the Modal
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById('myModal').style.display = "none";
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
    let slides = document.querySelectorAll(".mySlides");
    let dots = document.querySelectorAll(".demo");
    let captionText = document.querySelector("#caption");

    let imgs = document.querySelectorAll(".imgHere");
    let currentImgs = [];
    
    if (n > (slides.length * (imgGroup+1))) {slideIndex = 1}

    if (n < 1) {slideIndex -= slides.length}
    
    let imgGroup = Math.ceil(n/slides.length) - 1;

    console.log(imgGroup);
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    for(let j = 0; j < slides.length; j++){
        currentImgs.push(imgs[j + (imgGroup * slides.length)].querySelector("img").src);
        console.log(slides[j].querySelector("img").src);
        slides[j].querySelector("img").src = currentImgs[j + (imgGroup * slides.length)];
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
}
