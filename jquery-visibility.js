/*! http://mths.be/visibility v1.0.1 by @mathias */
(function(document, $, undefined) {

	var isIE = 'fileSize' in document, // TODO: make this mo’ betta
	    propertyName,
	    eventName;

	if (document.hidden != undefined) {
		propertyName = 'hidden';
		eventName = 'visibilitychange';
	} else if (document.mozHidden != undefined) {
		propertyName = 'mozHidden';
		eventName = 'mozvisibilitychange';
	} else if (document.msHidden != undefined) {
		propertyName = 'msHidden';
		eventName = 'msvisibilitychange';
	} else if (document.oHidden != undefined) {
		propertyName = 'oHidden';
		eventName = 'ovisibilitychange';
	} else if (document.webkitHidden != undefined) {
		propertyName = 'webkitHidden';
		eventName = 'webkitvisibilitychange';
	}

	$.support.pageVisibility = !!propertyName;

	// IE needs `document.focus{in,out}`
	// Safari and Opera need window.{focus,blur}
	$((propertyName || isIE) ? document : window).on(propertyName ? eventName : isIE ? 'focusin focusout' : 'focus blur', function(event) {
		$.event.trigger(propertyName && document[propertyName] || /^(?:blur|focusout)$/.test(event.type) ? 'hide.visibility' : 'show.visibility');
	});

}(document, jQuery));