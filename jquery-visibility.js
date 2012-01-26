/*! http://mths.be/visibility v1.0.3 by @mathias */
;(function(window, document, $) {

	var prefix,
	    property,
	    // In Opera, `'onfocusin' in document == true`, hence the extra `hasFocus` check to detect IE-like behavior
	    eventName = 'onfocusin' in document && 'hasFocus' in document ? 'focusin focusout' : 'focus blur',
	    prefixes = ['', 'moz', 'ms', 'o', 'webkit'],
	    $support = $.support,
	    $event = $.event;

	while ((property = prefix = prefixes.pop()) != null) {
		property = (prefix ? prefix + 'H': 'h') + 'idden';
		if ($support.pageVisibility = typeof document[property] == 'boolean') {
			eventName = prefix + 'visibilitychange';
			break;
		}
	}

	$(/blur$/.test(eventName) ? window : document).on(eventName, function(event) {
		var originalEvent = event.originalEvent;
		// If it’s a `{focusin,focusout}` event, `fromElement` and `toElement` should be both `null`;
		// else, the page visibility hasn’t changed, but the user just clicked somewhere in the doc.
		// `fromElement` and `toElement` never have the same value unless they’re both `null`.
		if (!/^focus./.test(event.type) || originalEvent.fromElement == originalEvent.toElement) {
			$event.trigger((property && document[property] || /^(?:blur|focusout)$/.test(event.type) ? 'hide' : 'show') + '.visibility');
		}
	});

}(this, document, jQuery));