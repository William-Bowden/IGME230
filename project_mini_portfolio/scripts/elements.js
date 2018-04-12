let title;

window.onload = (e) => {
    title = document.querySelector(".logo").firstChild;
    tick();
};

// acts as an update function, updating the game timer
function tick(){
    setTimeout(tick, 750);
    
    if(title.style.borderColor == "rgb(255, 255, 255)"){
        title.style.borderColor = "";
    }
    else{
        title.style.borderColor = "rgb(255, 255, 255)";
    }
}