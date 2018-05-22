//Requires page to contain a element with id "fullscreenButton"

(function(){
"use strict"

let fullscreenbttn = new FullScreenButton();
fullscreenbttn.init();
window.fullscreenbttn = fullscreenbttn;

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
})();