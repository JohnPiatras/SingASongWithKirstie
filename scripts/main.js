
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
	YouTubeContainer.init();
	initVideoThumbnails();
	FullScreenButton.init();
}

var YouTubeContainer = {
	settings: {
		ytPlayer: null,
		videoContainerElement: document.getElementById("videoContainer"),
		faderElement: document.getElementById("fader")
	},

	init: function() {
		this.settings.ytPlayer = new YT.Player("ytPlayer", {
			events: {
			'onReady': this.onPlayerReady,
			'onStateChange': this.onPlayerStateChange
			}
		});
	},
	
	onPlayerReady: function() {
	},
	
	onPlayerStateChange: function(event) {
		if (event.data === YT.PlayerState.ENDED) {
			YouTubeContainer.stopVideo();
		}
	if (event.data === YT.PlayerState.PAUSED) {
			YouTubeContainer.stopVideo();
		}
	},
	
	stopVideo: function() {
		this.settings.ytPlayer.stopVideo();
		this.settings.videoContainerElement.classList.add("hide");
		this.settings.faderElement.classList.add("hide");
	},
	
	playVideo: function(vId) {
		this.settings.ytPlayer.loadVideoById(vId);
		this.settings.faderElement.classList.remove("hide");
		this.settings.videoContainerElement.classList.remove("hide");
		this.settings.ytPlayer.playVideo();
	}
	
	
}	
 
var FullScreenButton = {
	settings: {
		fullscreenButton: document.getElementById("fullscreenButton")	
	},
	
	init: function() {
		this.bindUIActions();
	},
	
	bindUIActions: function() {
		this.settings.fullscreenButton.addEventListener('click', function() {
			FullScreenButton.onClick();
		});
	},
	
	onClick: function() {
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if(fullscreenElement == null) {
			FullScreenButton.launchIntoFullScreen(document.documentElement);
		} else {
			FullScreenButton.exitFullScreen();
		}
	},
	
	launchIntoFullScreen: function(element) {
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	},
	
	exitFullScreen: function() {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}


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
	
	
   // for (var n = 0; n < playlist.items.length; n++) {
	for (var n = playlist.items.length - 1; n >= 0; n--) {
		if(playlist.items[n].kind === "youtube#playlistItem" & playlist.items[n].snippet.resourceId.kind === "youtube#video"){
			try{
				var videoInfo = {};
				videoInfo.id = playlist.items[n].snippet.resourceId.videoId;
				videoInfo.thumbUrl = playlist.items[n].snippet.thumbnails.high.url;
				videoInfo.title = playlist.items[n].snippet.title;		

				var videoThumbnail = document.createElement("div");
				videoThumbnail.setAttribute("class", "videoThumbnail");
				videoThumbnail.setAttribute("id", videoInfo.id);
				
				centerContent.appendChild(videoThumbnail);
				
				var thumbnail = document.createElement("img");
				thumbnail.setAttribute("src", videoInfo.thumbUrl);
				thumbnail.setAttribute("id", videoInfo.id + "-thumb");
				thumbnail.setAttribute("class", "youtubeThumb");
				thumbnail.addEventListener('click', onThumbnailClick, false);
				videoThumbnail.appendChild(thumbnail);
				
				var thumbcaption = document.createElement("div");
				thumbcaption.setAttribute("class", "thumbcaption");
				thumbcaption.innerHTML = videoInfo.title;
				videoThumbnail.appendChild(thumbcaption);
			}catch(err){
				console.log("Encountered an error fetching info for a video, ignoring...");
				console.log(err);
				try{
					console.log("  Video title: " + playlist.items[n].snippet.title);
					console.log("  Video description: " + playlist.items[n].snippet.description);
				}catch(err2){}
			}
		}
    }
	centerContent.classList.remove("hide");
}


/**********************************
 * Handle user interaction events *
 **********************************/
function onThumbnailClick(event) {
	var thumb = event.target;
	var thumbContainer = thumb.parentNode;
	YouTubeContainer.playVideo(thumbContainer.id);
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
 
 




