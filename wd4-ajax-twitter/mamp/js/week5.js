if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};


var MyTwitterApi = (function(options) {

	$('form[name="timeline"]').submit(function() {
		$.getJSON('twitter-proxy.php?url='+encodeURIComponent('statuses/user_timeline.json?screen_name=twitterapi&count=2'), function(data) {

			$(".results").html(data);
			alert("data loaded: ");
		});
		return false;
	});
	//user_timeline(screen_name)

	//GET	https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2





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
