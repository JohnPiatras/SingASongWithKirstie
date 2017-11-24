
/**********************
 * YoutTube functions  *
 **********************/

window.apikey = " AIzaSyAeBabA_TskH1rKGLOIVX5xt35PvqECuI8 ";
window.ytPlayer = null;
window.ytPlaylist = null;
window.videoContainerElement = document.getElementById("videoContainer");
window.faderElement = document.getElementById("fader");

//**************************************************************
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//**************************************************************

//Called when youtube api is ready
function onYouTubeIframeAPIReady() {

	initYouTubePlayer();
	initVideoThumbnails();

	var fullscreenButton = document.getElementById("fullscreenButton");
	fullscreenButton.addEventListener('click', onFullscreenButtonClick, false);
}

function initYouTubePlayer() {
	window.ytPlayer = new YT.Player("ytPlayer", {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
	});
}

//Grabs a playlist from the SingASongWithKirstie channel on youtube
//Gets video IDs and creates a series of thumbnails for display on front page
function initVideoThumbnails() {
	var centerContent = document.getElementById("centerContent");
	centerContent.classList.add("hide");
	var userid = "UCJdWFFx0gaQswqQQZHw2new";
	var playlistid = "PL_iLoxbFb7q4J4KnGtTBhU5ZdroxO8rxx";
	var maxnumbervideos = 50;

	var playlist = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&key=" + window.apikey));
	
	
    for (var n = 0; n < playlist.items.length; n++) {
		if(playlist.items[n].kind === "youtube#playlistItem" & playlist.items[n].snippet.resourceId.kind === "youtube#video"){
			var id = playlist.items[n].snippet.resourceId.videoId;
			var videoThumbnail = document.createElement("div");
			videoThumbnail.setAttribute("class", "videoThumbnail");
			videoThumbnail.setAttribute("id", id);
			
			centerContent.appendChild(videoThumbnail);
			
			var thumbid = id + '-thumb';
			var thumbnail = document.createElement("img");
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
	centerContent.classList.remove("hide");
}

function playVideo(vId) {
	window.ytPlayer.loadVideoById(vId);
	window.faderElement.classList.remove("hide");
	window.videoContainerElement.classList.remove("hide");
	window.ytPlayer.playVideo();
}

function stopVideo(){
	window.ytPlayer.stopVideo();
	window.videoContainerElement.classList.add("hide");
	window.faderElement.classList.add("hide");
}

function onPlayerReady(event) {
  //event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data === YT.PlayerState.ENDED) {
		stopVideo();
	}
	if (event.data === YT.PlayerState.PAUSED) {
		stopVideo();
	}

}

/**********************************
 * Handle user interaction events *
 **********************************/
function onThumbnailClick(event) {
	var thumb = event.target;
	var thumbContainer = thumb.parentNode;
	playVideo(thumbContainer.id);
}


/*********************
 * Utility functions *
 *********************/
 
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
 
function onFullscreenButtonClick() {
	var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
	if(fullscreenElement == null) {
		launchIntoFullscreen(document.documentElement);
	} else {
		exitFullscreen();
	}
}

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}


