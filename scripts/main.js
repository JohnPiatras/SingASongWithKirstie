"use strict"


// Called when youtube api is ready
// Note, the IFrame Player API is loaded in youtube.js
function onYouTubeIframeAPIReady() {
	YouTubeContainer.init();
	initVideoThumbnails();	
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

//Grabs a playlist from the SingASongWithKirstie channel on youtube
//Gets video IDs and creates a series of thumbnails for display on front page
function initVideoThumbnails() {
	let centerContent = document.getElementById("centerContent");
	centerContent.classList.add("hide");
	
	let videos = getYoutubePlaylist();

   // for (let n = 0; n < playlist.items.length; n++) {
	//for (let n = videos.length - 1; n >= 0; n--) {		
	videos.forEach( (video) => {
		let videoThumbnail = document.createElement("div");
		videoThumbnail.setAttribute("class", "videoThumbnail");
		videoThumbnail.setAttribute("id", video.id);
		centerContent.appendChild(videoThumbnail);
		
		let thumbnail = document.createElement("img");
		thumbnail.setAttribute("src", video.thumbUrl);
		thumbnail.setAttribute("id", video.id + "-thumb");
		thumbnail.setAttribute("class", "youtubeThumb");
		thumbnail.addEventListener('click', onThumbnailClick, false);
		videoThumbnail.appendChild(thumbnail);
		
		let thumbcaption = document.createElement("div");
		thumbcaption.setAttribute("class", "thumbcaption");
		thumbcaption.innerHTML = video.title;
		videoThumbnail.appendChild(thumbcaption);
    });
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


 
 




