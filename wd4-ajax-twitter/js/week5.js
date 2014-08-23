if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var MyTwitterApi = (function(options) {
	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/');

	function createListeners() {
		setupTimeline();
		setupSearch();
		setupUIHandler();
	}

	function setupUIHandler() {
		$('body').on('data-received', function(event, eventArgs) {
			console.log('data received from: ', event, eventArgs);
			updateUI( eventArgs.resultElement, eventArgs.data, eventArgs.keyword );
		});
	}

	function setupTimeline() {

		$('form[name=timeline] button').click(function(event) {
			var thisEvent = $(event.currentTarget),
				form = thisEvent.closest('form'),
				screen_name = form.find('input[type=text]').val(),
				results = form.find('.results ul');

				$.getJSON(API_BASE + 'twitter-proxy.php?op=user_Timeline&screen_name=' + screen_name,
				function(response) {
					var eventArgs = {
						resultElement: results,
						data: response
					};
					$('body').trigger('data-received', eventArgs);
				});

			return false;
		});
	}

	function setupSearch() {

		$('form[name=search] button').click(function(event) {
			var thisEvent = $(event.currentTarget),
				form = thisEvent.closest('form'),
				args = {},
				results = form.find('.results ul'),
				keyword = form.find('input[name=q]').val();

			args['op'] = 'search';
			args['q'] = keyword;
			var countInput = form.find('input[name=count]');
			if (countInput) {
				args['count'] = countInput.val();
			}
			var resultTypeInput = form.find('select[name=result_type]');
			if (resultTypeInput) {
				args['result_type'] = resultTypeInput.val();// argument for the Twitter search API
			}

			$.getJSON(API_BASE + 'twitter-proxy.php', args,
				function(response) {
					var eventArgs = {
						resultElement: results,
						data: response.statuses,
						keyword: keyword
					};
					$('body').trigger('data-received', eventArgs);
			});

			return false;
		});
	}

	var updateUI = function( $resultElement, data, keyword ) {
		console.log('updating UI ...');
		$resultElement.empty();
		for (var s in data) {
			var status = data[s];
			var li = document.createElement('li');
			var txt = status['text'];
			var txtNode = document.createElement('span');
			txt = convertToLinks(txt);
			if (keyword != null) {
				var re = new RegExp(keyword, "i");
				txtNode.innerHTML = txt.replace(re, '<span class="highlight">' + keyword + '</span>');
			} else {
				txtNode.innerHTML = txt;
			}
			li.appendChild(txtNode);
			$resultElement.append(li);
		}
	};

	function convertToLinks(text) {
		var replaceText, replacePattern;

		replacePattern = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
		replacedText = text.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
		 
		return replacedText;
	}

	var init = function() {
		console.log('init()');
		createListeners();
	};
	shared.init = init;

	return shared;
}());

MyTwitterApi.init();
