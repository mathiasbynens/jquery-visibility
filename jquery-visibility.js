/*! http://mths.be/visibility v1.0.0 by @mathias */
(function(document, $, undefined) {

	var propertyName,
	    eventName = 'focusin focusout'; // fallback events

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

	$(document).on(eventName, function(event) {
		$.event.trigger(propertyName && document[propertyName] || event.type == 'focusout' ? 'hide.visibility' : 'show.visibility');
	});

}(document, jQuery));