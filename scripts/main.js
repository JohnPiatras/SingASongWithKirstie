//some globals

var apikey = " AIzaSyAeBabA_TskH1rKGLOIVX5xt35PvqECuI8 "

window.ytPlayer = null;
window.ytPlaylist = null;
window.playerId="videoContainer";

var cssRules = document.styleSheets[0].cssRules;

//**************************************************************
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//**************************************************************


/************************************************************
/* This function is called once the API code is downloaded. *
 * It calls a number of initialisation functions            *
 ************************************************************/
function onYouTubeIframeAPIReady() {


  initVideoThumbnails();
  initYoutTubePlayer();
  

}

//see comments here: https://stackoverflow.com/questions/30081301/getting-all-videos-of-a-channel-using-youtube-api
//for fetching youtube channel data
function getJSONData(yourUrl) {
	var Httpreq = new XMLHttpRequest();
	try {
		Httpreq.open("GET", yourUrl, false);
		Httpreq.send(null);
		} catch (ex) {
		alert(ex.message);
	}
	return Httpreq.responseText;
}


function initYoutTubePlayer() {
	window.ytPlayer = new YT.Player("ytPlayer", {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
	});
}

/****************************************************************************
 * Iterate throw our list of video IDs, create a thumbnailContainer div and *
 * image for each and set the onClick handler.                              *
 ****************************************************************************/
function initVideoThumbnails() {
	var centerContent = document.getElementById("centerContent");
	
	var userid = "UCJdWFFx0gaQswqQQZHw2new";
	var playlistid = "PL_iLoxbFb7q4J4KnGtTBhU5ZdroxO8rxx";
	var maxnumbervideos = 50;
	//var videoinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + userid + "&maxResults=" + maxnumbervideos + "&key=" + apikey));
	
	//var videoinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + userid + "&playlist?list=" + playlistid + "&maxResults=" + maxnumbervideos + "&key=" + apikey));

	var playlist = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&key=" + apikey));
	
	
    for (var n = 0; n < playlist.items.length; n++) {
		//var id = window.ytPlaylist[n];
		
		if(playlist.items[n].kind === "youtube#playlistItem" & playlist.items[n].snippet.resourceId.kind === "youtube#video"){
			
			var id = playlist.items[n].snippet.resourceId.videoId;
			
			//create a videoThumbnail div
			var videoThumbnail = document.createElement("div");
			
			videoThumbnail.setAttribute("class", "videoThumbnail");
			videoThumbnail.setAttribute("id", id);
			
			
			//videoThumbnail.setAttribute("style", "background-image:url(" + videos[n].snippet.thumbnails.high.url + ");background-size:contain;");
			centerContent.appendChild(videoThumbnail);
			
			//create thumbnail image element
			var thumbid = id + '-thumb';
			var thumbnail = document.createElement("img");
			//thumbnail.setAttribute("src", "http://i.ytimg.com/vi/" + id + "/hqdefault.jpg");
			thumbnail.setAttribute("src", playlist.items[n].snippet.thumbnails.high.url);
			thumbnail.setAttribute("id", id + "-thumb");
			thumbnail.setAttribute("class", "youtubeThumb");
			thumbnail.addEventListener('click', onThumbnailClick, false);
			videoThumbnail.appendChild(thumbnail);
			
			var thumbcaption = document.createElement("div");
			thumbcaption.setAttribute("class", "thumbcaption");
			thumbcaption.innerHTML = playlist.items[n].snippet.title;
			videoThumbnail.appendChild(thumbcaption);
		}
    }
}


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data === YT.PlayerState.ENDED) {
		var vidContainer = event.target.a.parentNode;

		stopVideo();
	}
	if (event.data === YT.PlayerState.PAUSED) {
		var vidContainer = event.target.a.parentNode;
		event.target.stopVideo();
		stopVideo();
	}

}

function onThumbnailClick(event) {
	
	var thumb = event.target;
	var thumbContainer = thumb.parentNode;
	
	//test code
	playVideo(thumbContainer.id);

}

function playVideo(vId) {
	var p = document.getElementById(window.playerId);
	window.ytPlayer.loadVideoById(vId);
	document.getElementById("fader").classList.remove("hide");
	p.classList.remove("hide");
	window.ytPlayer.playVideo();
}

function stopVideo(){
	var p = document.getElementById(window.playerId);
	window.ytPlayer.stopVideo();
	p.classList.add("hide");
	document.getElementById("fader").classList.add("hide");
}




