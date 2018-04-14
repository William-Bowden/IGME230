let mainImage;
let thumbnails;

let current;

let changeMain = (e) => 
{   
//    mainImage = document.querySelector(e.target.classList[0]).querySelector("img");
    
    // if there is a current selected, reset the opacity on it
    if(current){
        current.style.opacity = "1";
    }

    // set new current and update the opacity
    current = e.target;
    current.style.opacity = "0.3";

    // set image
    mainImage.src = current.src;      
};