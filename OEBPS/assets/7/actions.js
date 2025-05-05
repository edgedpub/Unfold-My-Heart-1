pubcoder.projectID = pubcoder.projectID || "8FB1114702334CBF94168BE8E27DB0BE";
pubcoder.project.id = pubcoder.project.id || "8FB1114702334CBF94168BE8E27DB0BE";
pubcoder.project.title = pubcoder.project.title || "Unfold My Heart";
pubcoder.page.id = pubcoder.page.id || 13;
pubcoder.page.title = pubcoder.page.title || "7";
pubcoder.page.number = pubcoder.page.number || 7;
pubcoder.page.alias = pubcoder.page.alias || "";

var ua = navigator.userAgent.toLowerCase();
var touchDownEvent;
var touchUpEvent;
var isMobile;
var aigX = 0, aigY = 0;
var askAudioPermission = false;

var obj113_animation_count = 0;
/*
 * 
 * Init Action Lists
 *
 * 
 */
var obj113_onTap_activeActionGroupIndex = -1;
var obj113_onTap_runningActionsCount = 0;
var obj113_onTap_loopCount = 0;
/*
 * 
 * Init SCCounter
 *
 * 
 */
 
 $(window).load(function(){
	window.eventObj = {};
	/*
	 * 
	 * Init SCAnimation
	 * 
	 * 
	 */
	
initAnimation_113();
function initAnimation_113()
{
        var targetObjectId = "#obj113";
        var widthSCAnimationObject = 1366;
        var heightSCAnimationObject = 783;
		var framesPerSecond = 1;
		var howManyLoops = 1;
		var backToFirstFrame = false;
        var isAnimationInfinite = false;
        window.audio_animation_obj113 = $("#")[0];
        window.hasAudioTrack_obj113 = false
 initAnimation(targetObjectId,widthSCAnimationObject,heightSCAnimationObject,framesPerSecond,window.obj113_animation_count,isAnimationInfinite,howManyLoops,backToFirstFrame);
window.api_animate_obj113 = $(targetObjectId).spritespin("api");
}

	/*
	 *
	 *   Init Shake
	 *
	 */
	window.addEventListener('shake', function () {
		
	}, false);
	
	/*
	 *
	 *   Init Masked Images
	 *
	 */
	 
 	/*
	 * 
	 * Init SCPhotogallery
	 * 
	 * 
	 */
	
 	/*
	 * 
	 * Init SCQuizMulti
	 * 
	 * 
	 */
	
 	/*
	 * 
	 * Init SCDrawer
	 * 
	 * 
	 */
	
    
 	/*
	 * 
	 * Init SCWPanZoom
	 * 
	 * 
	 */
	
    
 	/*
	 * 
	 * Init SCWMemoryGame
	 * 
	 * 
	 */
	
    
    
	if(! navigator.userAgent.match(/PubCoderHelper/i)) {
		/*
		 *
	 	 *   Action Groups
	 	 *
	 	 */
		
obj113_onTap_actionGroup0 = function(){
	isLastActionGroup = false;
	if (isLastActionGroup) {
		window.obj113_onTap_activeActionGroupIndex = -1;
		$("#obj113").trigger("obj113_onTap_ended");
		
		return;
	}
	window.obj113_onTap_activeActionGroupIndex = 0;
	


//	action: playAnimation 
//	target: obj113 
playAnimation_124();
function playAnimation_124() {
	var targetObjectId = "#obj113";
	var targetObject = $(targetObjectId)[0];
	window.obj113_onTap_runningActionsCount = obj113_onTap_runningActionsCount + 1;
	var isAnimationInfinite = false;
	if (isAnimationInfinite) {
		window.obj113_onTap_runningActionsCount = window.obj113_onTap_runningActionsCount - 1;
if (window.obj113_onTap_runningActionsCount == 0) {
	obj113_onTap_actionGroup1();
}
		if ($(targetObjectId).hasClass("playing")) {
			return;
		}
	}
	if (window.hasAudioTrack_obj113 && !$(targetObjectId).hasClass("playing")) {
		var myAudio = window.audio_animation_obj113;
		myAudio.src = myAudio.src; // myAudio.currentTime = 0 does not work on iOS
		myAudio.play();
	}
    $(targetObjectId).addClass("playing");
	setTimeout(function() {
	    api_animate_obj113.startAnimation();
	}, 1);
	if (!isAnimationInfinite) {
		$("#obj113").one("obj113_animation_ended",function(event) {
		    window.obj113_onTap_runningActionsCount = window.obj113_onTap_runningActionsCount - 1;
if (window.obj113_onTap_runningActionsCount == 0) {
	obj113_onTap_actionGroup1();
}
		});
	}
 }


















};
obj113_onTap_actionGroup1 = function(){
	isLastActionGroup = true;
	if (isLastActionGroup) {
		window.obj113_onTap_activeActionGroupIndex = -1;
		$("#obj113").trigger("obj113_onTap_ended");
		
		return;
	}
	window.obj113_onTap_activeActionGroupIndex = 1;
	





















};
		
		/*
		 *
	 	 *  Events
	 	 *
	 	 */
		











/*
 *
 *   obj113: Event Touch Down
 *
 */
$("#obj113").bind(PubCoder.Events.Tap, function(event) {
	event.preventDefault();	
	if (window.obj113_onTap_activeActionGroupIndex != -1) return;
var obj113_onTap_runningActionsCount = 0;
var obj113_onTap_loopCount = 0;
obj113_onTap_actionGroup0();
});





		
		
		/*
		 *
	 	 *  Page is ready to be played
	 	 *
	 	 */
		if (askAudioPermission) {
	$("#SCAudioPermissionAllowButton").click(function () {
		$( "audio" ).each(function( index ) {
			this.play();
			this.pause();
		});
		$(window).trigger(PubCoder.Events.PagePlay);
	});
	$("#SCAudioPermissionCancelButton").click(function () {
		$(window).trigger(PubCoder.Events.PagePlay);
	});
	var remodalInst = $('[data-remodal-id=SCAudioPermissionAlert]').remodal().open();
} else {
	setTimeout(function() {
		$(window).trigger(PubCoder.Events.PagePlay);
	}, 200);
}
	 }
});
var orientationDevice = getOrientation(PubCoder.isAndroidReader);
$(window).on(PubCoder.Events.PagePlay, function() {
	
$("#obj22").trigger('SCEventShow');
$("#obj113").trigger('SCEventShow');
	$(window).trigger(PubCoder.Events.PageReady);
	
});