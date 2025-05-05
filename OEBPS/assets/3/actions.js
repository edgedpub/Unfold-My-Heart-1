pubcoder.projectID = pubcoder.projectID || "8FB1114702334CBF94168BE8E27DB0BE";
pubcoder.project.id = pubcoder.project.id || "8FB1114702334CBF94168BE8E27DB0BE";
pubcoder.project.title = pubcoder.project.title || "Unfold My Heart";
pubcoder.page.id = pubcoder.page.id || 9;
pubcoder.page.title = pubcoder.page.title || "3";
pubcoder.page.number = pubcoder.page.number || 3;
pubcoder.page.alias = pubcoder.page.alias || "";

var ua = navigator.userAgent.toLowerCase();
var touchDownEvent;
var touchUpEvent;
var isMobile;
var aigX = 0, aigY = 0;
var askAudioPermission = false;

var obj63_animation_count = 0;
/*
 * 
 * Init Action Lists
 *
 * 
 */
var obj63_onTap_activeActionGroupIndex = -1;
var obj63_onTap_runningActionsCount = 0;
var obj63_onTap_loopCount = 0;
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
	
initAnimation_63();
function initAnimation_63()
{
        var targetObjectId = "#obj63";
        var widthSCAnimationObject = 1366;
        var heightSCAnimationObject = 778;
		var framesPerSecond = 1;
		var howManyLoops = 1;
		var backToFirstFrame = false;
        var isAnimationInfinite = false;
        window.audio_animation_obj63 = $("#")[0];
        window.hasAudioTrack_obj63 = false
 initAnimation(targetObjectId,widthSCAnimationObject,heightSCAnimationObject,framesPerSecond,window.obj63_animation_count,isAnimationInfinite,howManyLoops,backToFirstFrame);
window.api_animate_obj63 = $(targetObjectId).spritespin("api");
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
		
obj63_onTap_actionGroup0 = function(){
	isLastActionGroup = false;
	if (isLastActionGroup) {
		window.obj63_onTap_activeActionGroupIndex = -1;
		$("#obj63").trigger("obj63_onTap_ended");
		
		return;
	}
	window.obj63_onTap_activeActionGroupIndex = 0;
	


//	action: playAnimation 
//	target: obj63 
playAnimation_69();
function playAnimation_69() {
	var targetObjectId = "#obj63";
	var targetObject = $(targetObjectId)[0];
	window.obj63_onTap_runningActionsCount = obj63_onTap_runningActionsCount + 1;
	var isAnimationInfinite = false;
	if (isAnimationInfinite) {
		window.obj63_onTap_runningActionsCount = window.obj63_onTap_runningActionsCount - 1;
if (window.obj63_onTap_runningActionsCount == 0) {
	obj63_onTap_actionGroup1();
}
		if ($(targetObjectId).hasClass("playing")) {
			return;
		}
	}
	if (window.hasAudioTrack_obj63 && !$(targetObjectId).hasClass("playing")) {
		var myAudio = window.audio_animation_obj63;
		myAudio.src = myAudio.src; // myAudio.currentTime = 0 does not work on iOS
		myAudio.play();
	}
    $(targetObjectId).addClass("playing");
	setTimeout(function() {
	    api_animate_obj63.startAnimation();
	}, 1);
	if (!isAnimationInfinite) {
		$("#obj63").one("obj63_animation_ended",function(event) {
		    window.obj63_onTap_runningActionsCount = window.obj63_onTap_runningActionsCount - 1;
if (window.obj63_onTap_runningActionsCount == 0) {
	obj63_onTap_actionGroup1();
}
		});
	}
 }


















};
obj63_onTap_actionGroup1 = function(){
	isLastActionGroup = true;
	if (isLastActionGroup) {
		window.obj63_onTap_activeActionGroupIndex = -1;
		$("#obj63").trigger("obj63_onTap_ended");
		
		return;
	}
	window.obj63_onTap_activeActionGroupIndex = 1;
	





















};
		
		/*
		 *
	 	 *  Events
	 	 *
	 	 */
		











/*
 *
 *   obj63: Event Touch Down
 *
 */
$("#obj63").bind(PubCoder.Events.Tap, function(event) {
	event.preventDefault();	
	if (window.obj63_onTap_activeActionGroupIndex != -1) return;
var obj63_onTap_runningActionsCount = 0;
var obj63_onTap_loopCount = 0;
obj63_onTap_actionGroup0();
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
	
$("#obj14").trigger('SCEventShow');
$("#obj63").trigger('SCEventShow');
	$(window).trigger(PubCoder.Events.PageReady);
	
});