if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};


var MyTwitterApi = (function(options) {

	var select_timeline = $('form[name="timeline"] .results1');
	var select_search1 = $('form[name="search1"] .results2');
	var select_search2 = $('form[name="search2"] .results3');

	var updateUI = function( data, location, query) {
		var obj = (JSON && JSON.parse(data)) || $.parseJSON(data);
		console.log(obj);
		var loopThroughThis;

		if (obj.hasOwnProperty('statuses')) {
			loopThroughThis = obj.statuses;
		} else {
			loopThroughThis = obj;
		}

		var container = $(location);
		container.empty();
		for (var i = 0; i < loopThroughThis.length; i++) {
			var newTweet = '<li>' + loopThroughThis[i].text + '</li>';
			
			//highlights the search word with blue
			if(query) {
				var highlightText = new RegExp('('+ query + ')', 'i');
				newTweet = newTweet.replace(highlightText, '<span class="highlight">$1</span>');
			}

			//makes links click-able 
			newTweet = convertToLinks(newTweet);

			container.append(newTweet);
		}
	};

	//need to work on this some more, there are a lot more links in tweet that what this will work on.
	//hashtags and users, tweet entities need to be factored in somehow.
	function convertToLinks(text) {
		var replaceText, replacePattern;

		replacePattern = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
		replacedText = text.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
		 
		return replacedText;
	}


	// I think this was an attempt to decouple my code, not really sure if it is even close.

	// $('.results').on('data-received', function(data) {

	// 	if ( {'q': $("input[name='q1']").val()} ) {

	// 		var query = $("input[name='q1']").val();
	// 		updateUI(data, select_search1, query);

	// 	} else if( {'q': $("input[name='q2']").val()} ){

	// 		var query = $("input[name='q2']").val();
	// 		updateUI(data, select_search2, query);

	// 	} else {
	// 		updateUI( select_timeline);
	// 	}
	// });



	$('form[name="timeline"]').submit(function(e) {
			// e.preventDefault();
		$.get(
			'twitter-proxy.php',
			{
				'op': 'user_timeline',
				'screen_name': $("input[name='screen_name']").val(),
				'count': 10,
				'include_rts': false
			},
			function(data){
				// console.log(data);
				updateUI(data, select_timeline);
				// $('.results').trigger('data-received', data);
			}
			
		);
		return false;
	});


	$('form[name="search1"]').submit(function() {

		$.get(
			'twitter-proxy.php',
			{
				'op': 'search',
				'q': $("input[name='q1']").val(),
				'count': 10,
				'lang': 'en'
			},
			function(data) {
				var query = $("input[name='q1']").val();
				updateUI(data, select_search1, query);
				// $('.results').trigger('data-received', [data]);
			}
		);
		return false;
	});



	$('form[name="search2"]').submit(function() {

		$.get(
			'twitter-proxy.php',
			{
				'op': 'search',
				'q': $("input[name='q2']").val(),
				"result_type": $("select[name='result_type']").find(':selected').text(),
				'count': $("input[name='count']").val(),
				'lang': 'en'
			},
			function(data) {
				var query = $("input[name='q2']").val();
				updateUI(data, select_search2, query);
				// $('.results').trigger('data-received', [data]);
			}
		);
		return false;
	});


	


	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/');

	var init = function() {
		console.log('init()');
	};
	shared.init = init;

	return shared;
}());

MyTwitterApi.init();
