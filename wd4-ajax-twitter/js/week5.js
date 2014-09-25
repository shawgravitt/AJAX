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
		setUpMap();
	}

	function setupUIHandler() {
		$('body').on('data-received', function(event, eventArgs) {
			console.log('data received from: ', event, eventArgs);
			updateUI( eventArgs.resultElement, eventArgs.data, eventArgs.keyword );
			// googleMapAPI(data);
		});
	}

	function setupTimeline() {

		$('form[name=timeline] button').click(function(event) {
			var thisEvent = $(event.currentTarget),
				form = thisEvent.closest('form'),
				args = {},
				screen_name = form.find('input[type=text]').val(),
				results = form.find('.results ul');

			args['op'] = 'user_Timeline';
			args['screen_name'] = screen_name;
			args['lang'] = 'en';

				$.getJSON(API_BASE + 'twitter-proxy.php', args,
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
			args['lang'] = 'en';

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
						keyword: keyword,
						// geocode: 39.833333, -98.583333, 2000mi
					};
					$('body').trigger('data-received', eventArgs);
			});

			return false;
		});
	}

	var updateUI = function( $resultElement, data, keyword ) {
		console.log('updating UI ...');
		console.log(data);
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

			findCoordinates(status, txt);


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


	var map;

	function setUpMap() {
		
		var circus = new google.maps.LatLng(33.813245,-84.362171);
		var mapOptions = {
			zoom: 10,
			center: circus
			// mapTypeId: google.maps.MapTypeId.HYBRID
        };
       var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	}

	
 	//plot map
	function findCoordinates(status, txt) {
		var lat;
		var lng;
		
		
			if (status.coordinates != null) {
				lat = status.coordinates.coordinates[1];
				lng = status.coordinates.coordinates[0];
				console.log(lat);
				console.log(lng);

			}else {
				console.log('no coordinates')
				// return false;
			}


		var tweetLocation = new google.maps.LatLng(lat, lng);
		var mapOptions = {
			center: tweetLocation,
			// zoom: 10,
			// mapTypeId: google.maps.MapTypeId.HYBRID
        };
        

        var overlayContent = txt;

        var infowindow = new google.maps.InfoWindow({
          content: overlayContent
        });
	
        var marker = new google.maps.Marker({
			position: tweetLocation,
			map: map,
			draggable:true,
			animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
        });

	}








	var init = function() {
		console.log('init()');
		createListeners();
		// googleMapAPI();
	};
	shared.init = init;

	return shared;
}());

MyTwitterApi.init();

