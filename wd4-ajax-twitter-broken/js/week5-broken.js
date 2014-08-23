if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

var MyTwitterApi = (function(options) {

	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/');

	function readyListeners() {
		console.log('readyListeners()');

		setupTimeline();
		setupSearch();
		setupUIHandler();
	}

	function setupUIHandler() {
		console.log('UI handler');
		$('body').on('data-received', function(event, eventArgs) {
			console.log('data received from: ', event, eventArgs);
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
		console.log('search');
		$('form[name=search] button').click(function(event) {
			var myEvent = $(event.currentTarget),
				form = myEvent.closet('form'),
				args = {},
				results = form.find('.results ul'),
				keyword = form.find('input[name=q]').val();

			args['op'] = 'search';
			args['q'] = keyword;
			var count_f = form.find('input[name=count]');

			if (count_f) {
				args['count'] = count_f.val();
			}
			var result_type_f = form.find('select[name=result_type]');
			if (result_type_f) {
				args['result_type'] = result_type_f.val();
			}

			$.getJSON( API_BASE + "twitter-proxy.php", args,
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


	var updateUI = function( $resultElement, data, keyword) {
		console.log('UI');
		$resultElement.empty();
		
		for (var s in data) {
			var status = data[s];
			var li = document.createElement('li');
			var txt = status['text'];
			var txtNode = document.createElement('span');
			if (keyword != null) {
				var re = new RegExp(keyword, 'i');
				txtNode.innerHTML = txt.replace(re, '<span class="highlight">' + keyword + '</span>')
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


	// var select_timeline = $('form[name="timeline"] .results1');
	// var select_search1 = $('form[name="search1"] .results2');
	// var select_search2 = $('form[name="search2"] .results3');


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



	// $('form[name="timeline"]').submit(function(e) {
	// 		// e.preventDefault();
	// 	$.get(
	// 		'twitter-proxy.php',
	// 		{
	// 			'op': 'user_timeline',
	// 			'screen_name': $("input[name='screen_name']").val(),
	// 			'count': 10,
	// 			'include_rts': false
	// 		},
	// 		function(data){
	// 			// console.log(data);
	// 			updateUI(data, select_timeline);
	// 			// $('.results').trigger('data-received', data);
	// 		}
			
	// 	);
	// 	return false;
	// });


	// $('form[name="search1"]').submit(function() {

	// 	$.get(
	// 		'twitter-proxy.php',
	// 		{
	// 			'op': 'search',
	// 			'q': $("input[name='q1']").val(),
	// 			'count': 10,
	// 			'lang': 'en'
	// 		},
	// 		function(data) {
	// 			var query = $("input[name='q1']").val();
	// 			updateUI(data, select_search1, query);
	// 			// $('.results').trigger('data-received', [data]);
	// 		}
	// 	);
	// 	return false;
	// });



	// $('form[name="search2"]').submit(function() {

	// 	$.get(
	// 		'twitter-proxy.php',
	// 		{
	// 			'op': 'search',
	// 			'q': $("input[name='q2']").val(),
	// 			"result_type": $("select[name='result_type']").find(':selected').text(),
	// 			'count': $("input[name='count']").val(),
	// 			'lang': 'en'
	// 		},
	// 		function(data) {
	// 			var query = $("input[name='q2']").val();
	// 			updateUI(data, select_search2, query);
	// 			// $('.results').trigger('data-received', [data]);
	// 		}
	// 	);
	// 	return false;
	// });

// var updateUI = function( data, location, query) {
	// 	var obj = (JSON && JSON.parse(data)) || $.parseJSON(data);
	// 	console.log(obj);
	// 	var loopThroughThis;

	// 	if (obj.hasOwnProperty('statuses')) {
	// 		loopThroughThis = obj.statuses;
	// 	} else {
	// 		loopThroughThis = obj;
	// 	}

	// 	var container = $(location);
	// 	container.empty();
	// 	for (var i = 0; i < loopThroughThis.length; i++) {
	// 		var newTweet = '<li>' + loopThroughThis[i].text + '</li>';
			
	// 		//highlights the search word with blue
	// 		if(query) {
	// 			var highlightText = new RegExp('('+ query + ')', 'i');
	// 			newTweet = newTweet.replace(highlightText, '<span class="highlight">$1</span>');
	// 		}

	// 		//makes links click-able 
	// 		newTweet = convertToLinks(newTweet);

	// 		container.append(newTweet);
	// 	}
	// };
	

	var init = function() {
		console.log('init()');
		readyListeners();
	};
	shared.init = init;

	return shared;
}());

MyTwitterApi.init();
