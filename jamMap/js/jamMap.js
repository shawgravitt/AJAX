if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};


var MyTourMap = (function(options) {

	
	
	var shared = {},
		options = options || {},
		API_BASE = window.location.href.replace(/\/[^\/]+.html\??(.*)/, '/');

	function createListeners() {
		setupSearch();
		setUpMap();
	}

	// gets the artist id from Jambase
	function setupSearch() {

		$('form[name=search] button').click(function(event) {
			var thisEvent = $(event.currentTarget),
				form = thisEvent.closest('form'),
				args = {},
				artistID;
				artist = form.find('input[name=q]').val();
				$('.artist').html(artist);
			args['name'] = artist;
			args['api_key'] = 'GAKRGEMKMM72Y5A5AGA6RQVD'; //original f7m72ksthddcp3gf85b44qz4

			$.getJSON( 'http://api.jambase.com/artists?', args,
			function(response) {
				artistID = response.Artists[0].Id;
				eventList(artistID);
				LatLngList = [];
				
			});

			return false;
		});
	}



	var results = $('.results');

	//puts the artist id into the event list search
	var eventList = function(artistID) {
		console.log(artistID);
		var args = {};

		var venueName;
		var jamDate;  // date of event 
		var venueLink; // website to concert venue
		var address;
		var city;
		var state;
		var venueAddress;


		var newDate; // date in correct format
		var newVenueLink; // fixed venue URL (may not need this)

		args['artistId'] = artistID;
		args['api_key'] =  'GAKRGEMKMM72Y5A5AGA6RQVD'; //original f7m72ksthddcp3gf85b44qz4

		$.getJSON( 'http://api.jambase.com/events?', args,
			function(data) {
				if (data.Events.length == 0) {
					alert("No Concert information is available for this artist right now.");
				} else{

					console.log(data);
					results.empty();
					for (var i = 0; i < data.Events.length; i++) {
						venueName = data.Events[i].Venue.Name;
						jamDate = data.Events[i].Date;
						venueLink = data.Events[i].Venue.Url;
						address = data.Events[i].Venue.Address;
						city = data.Events[i].Venue.City;
						state = data.Events[i].Venue.StateCode;

						newDate = changeDate(jamDate);
						newVenueLink = convertToLinks(venueLink);
						venueAddress = venueAddressMaker(address, city, state);

						geoCoder(venueAddress, newDate, venueName, newVenueLink);

						updateUI( newDate, venueName, newVenueLink, city, state);
						
					}
				}
			}
		);
	};

	
	// takes the correct address format and changes it into lat and lng coordinates for Google maps
	function geoCoder(venueAddress, newDate, venueName, newVenueLink) {
		var venueLatLng;
		var params = {};

		params['address'] = venueAddress;
		params['key'] = 'AIzaSyDU3Q2i2-1QXoybl0QmIDF14xkSSDa9WVQ';

		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?', params,
			function(geoData) {
				console.log('geocoder');
				var lat = geoData.results[0].geometry.location.lat;
				var lng = geoData.results[0].geometry.location.lng;
				venueLatLng = new google.maps.LatLng(lat, lng);
				
				venueMarker(venueLatLng);
				
				markerMaker(newDate, venueName, newVenueLink);

				LatLngList.push(venueLatLng);
				zoomMapToArrayOfCoords();
			}
		);
	}

	var updateUI = function( date, venueName, newVenueLink, city, state ) {
		console.log('updating UI ...');
		console.log(newVenueLink);
		var li = document.createElement('li');
		
		var anchor = document.createElement('a');
		if (newVenueLink) {
			anchor.setAttribute('href', newVenueLink);
		}
		anchor.innerHTML = venueName;

		var txtNode = document.createTextNode(date + " " + city + ", " + state + " ");
		
		li.appendChild(txtNode);
		li.appendChild(anchor);
		results.append(li);

	};



// utility functions

	// changes URL data into click-able links (may not need this)
	function convertToLinks(text) {
		var replaceText;
		var replacePattern;

		replacePattern = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
		replacedText = text.replace(replacePattern, '$1');
		
		return replacedText;
	}

	//changes date data in to correct format
	function changeDate(time) {
		var r = time.match(/^\s*([0-9]+)\s*-\s*([0-9]+)\s*-\s*([0-9]+)(.*)$/);
		return r[2]+"/"+r[3]+"/"+r[1];
	}

	//puts the address data into the correct format
	function venueAddressMaker(address, city, state) {
		var venueAddress = address.concat(" ", city, " ", state );
		return venueAddress;
	}


	//map stuff

	var map;
	var mapOptions = {};
	var marker; //the marker 
	var initialLocation; //where the user is located
	var browserSupportFlag =  new Boolean(); //  error stuff
	var siberia = new google.maps.LatLng(60, 105); // coords for error states
	var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);// coords for error states
	var LatLngList = Array(); //array to set bounds for zooming map

	function setUpMap() {
		
		mapOptions = {
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        if(navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				map.setCenter(initialLocation);

				markerPosition(initialLocation);

            }, function() {
				handleNoGeolocation(browserSupportFlag);
            });
		}
          // Browser doesn't support Geolocation
		else {
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		}

		function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
				alert("Geolocation service failed.");
				initialLocation = newyork;
            } else {
				alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
				initialLocation = siberia;
            }
				map.setCenter(initialLocation);
			}

	}

	function markerPosition(location) {
		marker = new google.maps.Marker({
			position: location,
			map: map,
			animation: google.maps.Animation.DROP
		});
	}

	function markerMaker(newDate, venueName, newVenueLink) {
		console.log("marker maker");

		var markerString = newDate.concat(" ", venueName);

		var overlayContent = (markerString);

        var infowindow = new google.maps.InfoWindow({
          content: overlayContent
        });

        google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,this);
        });
	}

	//plot map
	function venueMarker(location) {

		mapOptions = {
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.HYBRID
		};

		marker = new google.maps.Marker({
			position: location,
			map: map,
			animation: google.maps.Animation.DROP
		});
	}


	function zoomMapToArrayOfCoords() {
		//  Create a new viewpoint bound
		var bounds = new google.maps.LatLngBounds();
		//  Go through each...
		for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
			//  And increase the bounds to take this point
			bounds.extend (LatLngList[i]);
		}
		//  Fit these bounds to the map
		map.fitBounds (bounds);
	}

	
	var init = function() {
		console.log('init()');
		createListeners();
	};
	shared.init = init;

	return shared;
}());

MyTourMap.init();

