"use strict"
/**********************
 * YoutTube functions  *
 **********************/

const API_KEY = " AIzaSyAeBabA_TskH1rKGLOIVX5xt35PvqECuI8 ";

//**************************************************************
// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//**************************************************************

let fullscreenbttn = new FullScreenButton();
fullscreenbttn.init();

//Called when youtube api is ready
function onYouTubeIframeAPIReady() {
	YouTubeContainer.init();
	initVideoThumbnails();
	//FullScreenButton.init();	
}

let YouTubeContainer = {
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
 
/*let FullScreenButton = {
	settings: {
		fullscreenButton: document.getElementById("fullscreenButton")	
	},
	
	init: function() {
		this.bindUIActions();
	},
	
	//bindUIActions: function() {
	//	this.settings.fullscreenButton.addEventListener('click', function() {
	//		FullScreenButton.onClick();
	//	});
	//},
	
	bindUIActions: function() {
		this.settings.fullscreenButton.addEventListener('click', FullScreenButton.onClick);
	},
	
	onClick: function() {
		let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
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
}	*/

//Here is an example of creating an object using a constructor
function FullScreenButton() {
	let self = this;
	this.settings = {
		fullscreenButton: document.getElementById("fullscreenButton")	
	};
	
	this.init =  function() {
		this.bindUIActions();
	};
	
	this.bindUIActions = function() {
		this.settings.fullscreenButton.addEventListener('click', self.onClick);
	};
	
	//When a function is called as an event handler 'this' is set to the element that fired the event. So, we need to 
	//store the 'this' that we want to use, in this case we stored it in 'self'.
	this.onClick = function() {
		let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if(fullscreenElement == null) {
			self.launchIntoFullScreen(document.documentElement);
		} else {
			self.exitFullScreen();
		}
	};
	
	this.launchIntoFullScreen = function(element) {
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	};
	
	this.exitFullScreen = function() {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	};
}
 


//Grabs a playlist from the SingASongWithKirstie channel on youtube
//Gets video IDs and creates a series of thumbnails for display on front page
function initVideoThumbnails() {
	let centerContent = document.getElementById("centerContent");
	centerContent.classList.add("hide");
	let userid = "UCJdWFFx0gaQswqQQZHw2new";
	let playlistid = "PL_iLoxbFb7q4J4KnGtTBhU5ZdroxO8rxx";
	let maxnumbervideos = 50;

	let playlist = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&key=" + API_KEY));
	
	
   // for (let n = 0; n < playlist.items.length; n++) {
	for (let n = playlist.items.length - 1; n >= 0; n--) {
		if(playlist.items[n].kind === "youtube#playlistItem" & playlist.items[n].snippet.resourceId.kind === "youtube#video"){
			try{
				let videoInfo = {};
				videoInfo.id = playlist.items[n].snippet.resourceId.videoId;
				videoInfo.thumbUrl = playlist.items[n].snippet.thumbnails.high.url;
				videoInfo.title = playlist.items[n].snippet.title;		

				let videoThumbnail = document.createElement("div");
				videoThumbnail.setAttribute("class", "videoThumbnail");
				videoThumbnail.setAttribute("id", videoInfo.id);
				
				centerContent.appendChild(videoThumbnail);
				
				let thumbnail = document.createElement("img");
				thumbnail.setAttribute("src", videoInfo.thumbUrl);
				thumbnail.setAttribute("id", videoInfo.id + "-thumb");
				thumbnail.setAttribute("class", "youtubeThumb");
				thumbnail.addEventListener('click', onThumbnailClick, false);
				videoThumbnail.appendChild(thumbnail);
				
				let thumbcaption = document.createElement("div");
				thumbcaption.setAttribute("class", "thumbcaption");
				thumbcaption.innerHTML = videoInfo.title;
				videoThumbnail.appendChild(thumbcaption);
			}catch(err){
				console.log("Encountered an error fetching info for a video, ignoring...");
				console.log(err);
			}
		}
    }
	centerContent.classList.remove("hide");
}


/**********************************
 * Handle user interaction events *
 **********************************/
function onThumbnailClick(event) {
	let thumb = event.target;
	let thumbContainer = thumb.parentNode;
	YouTubeContainer.playVideo(thumbContainer.id);
}


/*********************
 * Utility functions *
 *********************/
 
//see comments here: https://stackoverflow.com/questions/30081301/getting-all-videos-of-a-channel-using-youtube-api
//for fetching youtube channel data
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
 
 




