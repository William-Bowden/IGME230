let title;

window.onload = (e) => {
    title = document.querySelector(".logo").firstChild;
    tick();
    
    mainImage = document.querySelector("#asteroidsMain").querySelector("img");
    thumbnails = document.querySelector(".thumbnails").querySelectorAll(".thumbnail");
    current = thumbnails[0];
    current.style.opacity = "0.3";
    mainImage.src = current.src;     
    
    console.log(thumbnails);
    
    for(let thumbnail of thumbnails){
        thumbnail.addEventListener("mouseover", changeMain);
    }
};

// acts as an update function, updating the game timer
function tick(){
    setTimeout(tick, 525);
    
    if(title.style.borderColor == "rgb(255, 255, 255)"){
        title.style.borderColor = "";
    }
    else{
        title.style.borderColor = "rgb(255, 255, 255)";
    }
}