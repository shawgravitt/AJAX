if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};


var MyTwitterApi = (function(options) {

	$('form[name="timeline"]').submit(function(e) {
		e.preventDefault();
		console.log("get timeline 1");

		$.get(
			'twitter-proxy.php',
			{
				'op': 'user_timeline',
				'screen_name': $("input[name='screen_name']").val()
			},
			function(data) {
				console.log("success");

				var obj = (JSON && JSON.parse(data)) || $.parseJSON(data);
				console.log(obj);

					var container = $('.results1');
					container.empty();
					for (var i = 0; i < obj.length; i++) {
						var newTweet = '<li>' + obj[i].text + '</li>';
						container.append(newTweet);
					}
			}

		);
	});


	$('form[name="search1"]').submit(function(e) {
		e.preventDefault();
		console.log("get timeline 2");

		$.get(
			'twitter-proxy.php',
			{
				'op': 'search',
				'q': $("input[name='q1']").val()
			},
			function(data) {
				console.log("success");
				var query = $("input[name='q1']").val();
				var obj = (JSON && JSON.parse(data)) || $.parseJSON(data);
				obj.length = 10;
				console.log(obj);

				var container = $('.results2');
				container.empty();
				for (var i = 0; i < obj.statuses.length; i++) {
					var newTweet = '<li>' + obj.statuses[i].text + '</li>';

					var highlightText = new RegExp('('+ query + ')', 'i');
					newTweet = newTweet.replace(highlightText, '<span class="highlight">$1</span>');

					container.append(newTweet);
					
				}
			}

		);
	});



	$('form[name="search2"]').submit(function(e) {
		e.preventDefault();
		console.log("get timeline 3");

		$.get(
			'twitter-proxy.php',
			{
				'op': 'search',
				'q': $("input[name='q2']").val(),
				"result_type": $("select[name='result_type']").find(':selected').text(),
				'count': $("input[name='count']").val()
			},
			function(data) {
				console.log("success");
				var query = $("input[name='q2']").val();
				var obj = (JSON && JSON.parse(data)) || $.parseJSON(data);
			
				console.log(obj);

				var container = $('.results3');
				container.empty();
				for (var i = 0; i < obj.statuses.length; i++) {
					var newTweet = '<li>' + obj.statuses[i].text + '</li>';

					var highlightText = new RegExp('('+ query + ')', 'i');
					newTweet = newTweet.replace(highlightText, '<span class="highlight">$1</span>');

					container.append(newTweet);
					}
			}

		);
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
