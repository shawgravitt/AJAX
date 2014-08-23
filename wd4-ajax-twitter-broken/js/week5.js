if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var MyTwitterApi = (function(options) {
	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/')

	function setupListeners() {
		console.log('setupListeners()');

		setupTimeline();
		setupSearch();
		setupUIHandler();
	}

	function setupUIHandler() {
		$('body').on('puppy-bark', function(event, eventArgs) {
			console.log('data received from a puppy: ', event, eventArgs);
			updateUI( eventArgs.resultElement, eventArgs.data, eventArgs.keyword );
		});
	}

	function setupTimeline() {

		$('form[name=timeline] button').click(function(event) {
			var $e = $(event.currentTarget),
				$form = $e.closest('form'),
				screen_name = $form.find('input[type=text]').val(),
				$results = $form.find('.results ul');

				$.getJSON(API_BASE + 'twitter-proxy.php?op=getTimeline&screen_name=' + screen_name,
				function(response) {
					var eventArgs = {
						resultElement: $results,
						data: response
					};
					$('body').trigger('puppy-bark', eventArgs);
					// updateUI( $results, response );
				});

			return false;
		});
	}

	function setupSearch() {

		$('form[name=search] button').click(function(event) {
			var $e = $(event.currentTarget),
				$form = $e.closest('form'),
				args = {},
				$results = $form.find('.results ul'),
				keyword = $form.find('input[name=q]').val();

			args['op'] = 'search'; // which PHP function to run
			args['q'] = keyword; // argument for the Twitter search API
			var $count_f = $form.find('input[name=count]');
			if ($count_f) {
				args['count'] = $count_f.val();// argument for the Twitter search API
			}
			var $result_type_f = $form.find('select[name=result_type]');
			if ($result_type_f) {
				args['result_type'] = $result_type_f.val();// argument for the Twitter search API
			}

			$.getJSON(API_BASE + 'twitter-proxy.php', args,
				function(response) {
					var eventArgs = {
						resultElement: $results,
						data: response.statuses,
						keyword: keyword
					};
					$('body').trigger('puppy-bark', eventArgs);
					// update the UI in one line
					// updateUI( $results, response.statuses, keyword );
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
			if (keyword != null) {
				var re = new RegExp(keyword, "i"); 
				txtNode.innerHTML = txt.replace(re, '<span class="highlight">' + keyword + '</span>')
			} else {
				txtNode.innerHTML = txt;
			}
			li.appendChild(txtNode);
			$resultElement.append(li);
		}
	};

	var init = function() {
		console.log('init()');
		setupListeners();
	};
	shared.init = init;

	return shared;
}());

MyTwitterApi.init();
