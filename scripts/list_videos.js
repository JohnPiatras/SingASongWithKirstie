"use strict"

const API_KEY = " AIzaSyAeBabA_TskH1rKGLOIVX5xt35PvqECuI8 ";

//**************************************************************
// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//**************************************************************

generateList();


function generateList(){
    let userid = "UCJdWFFx0gaQswqQQZHw2new";
    let playlistid = "PL_iLoxbFb7q4J4KnGtTBhU5ZdroxO8rxx";
    let maxnumbervideos = 100;

    console.log("retrieving playlist");
    let queryStr = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&key=" + API_KEY;
    let playlist = JSON.parse(getJSONData(queryStr));
    console.log("Playlist retrieved, copying items array");
    let items = playlist.items;
    console.log("Array copied...");


    while(playlist.nextPageToken){
        queryStr = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&pageToken=" + playlist.nextPageToken + "&key=" + API_KEY;
        playlist = JSON.parse(getJSONData(queryStr));
        items = [...items, ...playlist.items];
    }

    let ordered_list = document.querySelector("#centerContent ol");

    let songs = items.map( item => {
        if(item.snippet.resourceId.kind == "youtube#video")
            return item.snippet.title;
    });
    songs.sort();

    for(let i = 0; i < songs.length; i++){
        let new_list_item = document.createElement("li");
        new_list_item.textContent = songs[i];
        ordered_list.appendChild(new_list_item);
    }
        
    /*for (let n = items.length - 1; n >= 0; n--) {
        if(items[n].kind === "youtube#playlistItem" & items[n].snippet.resourceId.kind === "youtube#video"){
            try{
                let videoInfo = {};
                videoInfo.id = items[n].snippet.resourceId.videoId;
                videoInfo.thumbUrl = items[n].snippet.thumbnails.high.url;
                videoInfo.title = items[n].snippet.title;		

                let new_list_item = document.createElement("li");
                new_list_item.textContent = videoInfo.title;
                ordered_list.appendChild(new_list_item);
            }catch(err){
                console.log("Encountered an error fetching info for a video, ignoring...");
                console.log(err);
            }
        }
    }*/



    
}

function getJSONData(yourUrl) {
	
	let Httpreq = new XMLHttpRequest();
	try {
		Httpreq.open("GET", yourUrl, false);
		Httpreq.send(null);
		} catch (ex) {
		alert(ex.message);
    }
    
	return Httpreq.responseText;
}
