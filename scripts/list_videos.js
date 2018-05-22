"use strict"

generateList();

function generateList(){
    let songs = getYoutubePlaylist().sort( (a, b) => a.title > b.title ? 1 : -1);

    let ordered_list = document.querySelector("#centerContent ol");

    for(let i = 0; i < songs.length; i++){
        let new_list_item = document.createElement("li");
        new_list_item.textContent = songs[i].title;
        ordered_list.appendChild(new_list_item);
    }    
}


