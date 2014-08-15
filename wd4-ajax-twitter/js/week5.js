if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};


var MyTwitterApi = (function(options) {

	var select_timeline = $('form[name="timeline"] .results1');
	var select_search1 = $('form[name="search1"] .results2');
	var select_search2 = $('form[name="search2"] .results3');

	var updateUI = function( data, location, query) {
		var obj = (JSON && JSON.parse(data)) || $.parseJSON(data);

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

			if(query) {
				var highlightText = new RegExp('('+ query + ')', 'i');
				newTweet = newTweet.replace(highlightText, '<span class="highlight">$1</span>');
			}
			container.append(newTweet);
		}
	};

	$('form[name="timeline"]').submit(function() {

		$.get(
			'twitter-proxy.php',
			{
				'op': 'user_timeline',
				'screen_name': $("input[name='screen_name']").val()
			},
			function(data) {
				updateUI(data, select_timeline);
			}
			
		);
		return false;
	});


	$('form[name="search1"]').submit(function() {

		$.get(
			'twitter-proxy.php',
			{
				'op': 'search',
				'q': $("input[name='q1']").val()
			},
			function(data) {
				var query = $("input[name='q1']").val();
				updateUI(data, select_search1, query);

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
				'count': $("input[name='count']").val()
			},
			function(data) {
				var query = $("input[name='q2']").val();
				updateUI(data, select_search2, query);
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
