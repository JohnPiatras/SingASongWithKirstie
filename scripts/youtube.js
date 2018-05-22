"use strict"

const API_KEY = " AIzaSyAeBabA_TskH1rKGLOIVX5xt35PvqECuI8 ";

//**************************************************************
// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//**************************************************************


function getYoutubePlaylist(){
    let userid = "UCJdWFFx0gaQswqQQZHw2new";
    let playlistid = "PL_iLoxbFb7q4J4KnGtTBhU5ZdroxO8rxx";
    let maxnumbervideos = 100;

    let queryStr = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&key=" + API_KEY;
    let playlist = JSON.parse(getJSONData(queryStr));
    let items = playlist.items;

    while(playlist.nextPageToken){
        queryStr = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&pageToken=" + playlist.nextPageToken + "&key=" + API_KEY;
        playlist = JSON.parse(getJSONData(queryStr));
        items = [...items, ...playlist.items];
    }

    return items.map( item => {
        if(item.snippet.resourceId.kind == "youtube#video"){
            let new_item = {
                title: item.snippet.title,
                id: item.snippet.resourceId.videoId,
                thumbUrl: item.snippet.thumbnails.high.url,
            }
            return new_item;
        }    
    });
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