// 1
window.onload = (e) => {document.querySelector("#search").onclick = getData};

// 2
let displayTerm = "";

// 3
function getData(){
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    const GIPHY_KEY = "dc6zaTOxFJmzC";

    let url = GIPHY_URL;

    url += "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if(term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    document.querySelector("#content").innerHTML = "<b>Searching for " + displayTerm + "</b>";

    console.log(url);

    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: jsonLoaded
    });

}

function jsonLoaded(obj){

    let content = document.querySelector("#content");

    if(!obj.data || obj.data.length == 0){
        content.innerHtML = `<p><i>No results found for '${displayTerm}'</i></p>`;
        $("#content").fadeIn(500);
        return;
    }

    let results = obj.data;
    let size = document.querySelector("#size").value;
    let width = 100;

    if(size == "fixed_width"){
        width = 200;
    }
    let height = width + 75;

    let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

    for(let i = 0; i < results.length; i++){
        let result = results[i];

        let smallURL = 0;

        if(size == "fixed_width_small"){
            smallURL = result.images.fixed_width_small.url;
        }
        else{
            smallURL = result.images.fixed_width.url;
        }

        if(!smallURL) smallURL = "/images/no-image-found.png";

        let url = result.url;
        let rating = result.rating.toUpperCase();

        var line = `<div class='result' style='width:${width}px;height:${height}px;'><span><a target='_blank' href='${url}'><img src='${smallURL}' title= '${result.id}' /></a></span>`;
        line += `<p>Rating: '${rating}'</p></div>`;

        bigString += line;
    }

    document.querySelector("#content").innerHTML = bigString;

    $("#content").fadeIn(500);


}