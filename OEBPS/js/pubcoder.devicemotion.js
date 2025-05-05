pubcoder.initDeviceMotion = function() {
	console.log(window);
	if (pubcoder.isDeviceMotionInited === true) {
		return;
	} else {
		pubcoder.isDeviceMotionInited = true;
	}
	
	window.onorientationchange = function() {
		var newOrientation;
		if (PubCoder.isAndroidReader)
			newOrientation = Android.getRotation();
		else 
			newOrientation = window.orientation;
				/*window.orientation returns a value that indicates whether iPhone is in portrait mode, landscape mode with the screen turned to the
				  left, or landscape mode with the screen turned to the right. */
		window.orientationDevice = switchOrientationName(newOrientation,PubCoder.isAndroid);
	};
	window.ondevicemotion = function(e) {
		console.log(e);
		if (window.SCDisableDeviceMotion == true) {
			return // do nothing, ondevicemotion is disabled, probably by Pubcoder Quick Preview Motion Simulator
		} else if (!window.SCuaosIsWindows) {
			switch (window.orientationDevice) {
				case 'landscapeButtonLeft':
					window.aigX = e.accelerationIncludingGravity.x;
					window.aigY = e.accelerationIncludingGravity.y;
					break;
				case 'portraitButtonBottom':
					 window.aigX = -e.accelerationIncludingGravity.y;  
					 window.aigY = e.accelerationIncludingGravity.x;
					break;
				case 'landscapeButtonRight':
					window.aigX = -e.accelerationIncludingGravity.x;  
					window.aigY = -e.accelerationIncludingGravity.y;
					break;
				case 'portraitButtonTop':
					window.aigX = e.accelerationIncludingGravity.y;  
					window.aigY = -e.accelerationIncludingGravity.x;
					 break;
			}
		} else {
			if (!(navigator.userAgent.toLowerCase().indexOf("edge") > -1) && !(navigator.userAgent.toLowerCase().indexOf("trident") > -1))
				window.aigX = e.accelerationIncludingGravity.y;
			else
				window.aigX = -e.accelerationIncludingGravity.y;
			window.aigY = e.accelerationIncludingGravity.x;
		}
		if (window.SCQuickPreview) {
			PubCoder.call('deviceMoved', [window.aigX, window.aigY]);
		}
	};



	/*
	 *
	 * Find more about this plugin by visiting
	 * http://alxgbsn.co.uk/
	 *
	 * Copyright (c) 2010-2012 Alex Gibson
	 * Released under MIT license
	 *
	 */
	(function (window, document) {

		function Shake() {

			//feature detect
			this.hasDeviceMotion = 'ondevicemotion' in window;

			//default velocity threshold for shake to register
			this.threshold = 5;

			//use date to prevent multiple shakes firing
			this.lastTime = new Date();

			//accelerometer values
			this.lastX = null;
			this.lastY = null;
			this.lastZ = null;

			//create custom event
			if (typeof CustomEvent === "function") {
				this.event = new CustomEvent('shake', {
					bubbles: true,
					cancelable: true
				});
			} else if (typeof document.createEvent === "function") {
				this.event = document.createEvent('Event');
				this.event.initEvent('shake', true, true);
			} else { 
			return false;
			}
		}

		//reset timer values
		Shake.prototype.reset = function () {
			this.lastTime = new Date();
			this.lastX = null;
			this.lastY = null;
			this.lastZ = null;
		};

		//start listening for devicemotion
		Shake.prototype.start = function () {
			this.reset();
			if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
		};

		//stop listening for devicemotion
		Shake.prototype.stop = function () {

			if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
			this.reset();
		};

		//calculates if shake did occur
		Shake.prototype.devicemotion = function (e) {

			var current = e.accelerationIncludingGravity,
				currentTime,
				timeDifference,
				deltaX = 0,
				deltaY = 0,
				deltaZ = 0;

			if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
				this.lastX = current.x;
				this.lastY = current.y;
				this.lastZ = current.z;
				return;
			}
			
			var ie = false;
			if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") !== -1) 
				ie = true;

			deltaX = (ie) ? (this.lastX - current.x) : Math.abs(this.lastX - current.x);
			deltaY = (ie) ? (this.lastY - current.y) : Math.abs(this.lastY - current.y);
			deltaZ = (ie) ? (this.lastZ - current.z) : Math.abs(this.lastZ - current.z);

			if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {
				//calculate time in milliseconds since last shake registered
				currentTime = new Date();
				timeDifference = currentTime.getTime() - this.lastTime.getTime();

				if (timeDifference > 333) {
					window.dispatchEvent(this.event);
					this.lastTime = new Date();
				}
			}

			this.lastX = current.x;
			this.lastY = current.y;
			this.lastZ = current.z;

		};

		//event handler
		Shake.prototype.handleEvent = function (e) {

			if (typeof (this[e.type]) === 'function') {
				return this[e.type](e);
			}
		};

		//create a new instance of shake.js.
		var myShakeEvent = new Shake();
		myShakeEvent && myShakeEvent.start();

	}(window, document));
};



function getOrientation(isAndroidReader) {
	var orientationName, orientationType;
	if (isAndroidReader)
		orientationType = Android.getRotation();
	else
		orientationType = window.orientation;
	orientationName = switchOrientationName(orientationType, isAndroidReader);
	return orientationName;
}

function switchOrientationName(orientation, isAndroid) {
	var orientationDetected;
	var orientationName;
	orientationDetected = orientation;
	if (orientation == 0 && isAndroid) 
			orientationDetected = 180;
	else if (orientation == 90 && isAndroid)
			orientationDetected = -90;
	else if (orientation == 180 && isAndroid)
		orientationDetected = 0;
	else if (orientation == 270 && isAndroid)
		orientationDetected = 90;
	
	var orientationName;
	switch(orientationDetected) {
    case 0:
    	orientationName = 'portraitButtonBottom';
        break; 
    case 90:
    	orientationName = 'landscapeButtonRight';
        break;
    case -90: 
    	orientationName = 'landscapeButtonLeft';
        break;
	case 180:
		orientationName = 'portraitButtonTop';
     break;
  }
	return orientationName;
}