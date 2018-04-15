let title;

window.onload = (e) => {
    title = document.querySelector(".logo").firstChild;
    tick();
    
    thumbnails = document.querySelectorAll(".thumbnail");
    current = thumbnails[0];
    current.style.opacity = "0.7";
    
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