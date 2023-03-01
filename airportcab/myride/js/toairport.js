
function loadMainjs() {
    var couponDiscountAmt = 0
    var DepAirportName;
    var SourceName;
    var SourceCity;
    var source_latitude;
    var source_longitude;
    var cityCODE;
    var source_city;
    var pickup_lat;
    var pickup_long;
    var KMVal;
    var TerminalCode;
    var KMNum;
    var stateforinvoice = "";
    var PaymentMethod = 'payment'
    var MultiplierAmount;
    var sessionToken;
    var couponCodeValue = 0
    var couponcodeType = 'cashback'
    var content_id = 0;
    var fare_price = 0;
    var couponcodePayType = ''
    var CabBookingType = 'hatchback'
    var defaultCashback = 0

    document.getElementById("mb_number").onchange = async function () {
        if ($("#mb_number").val().length == 10 && $("#mb_number").val() != undefined) {
            localStorage.setItem("mobileNum", $("#mb_number").val())
            await Track_LoadAnalytics(localStorage["mobileNum"], "departure", "myairportride", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
        }
    }

    window.onload = async function () {
        localStorage.removeItem("CabSHOW");
    }

    LoadPagedata()
    async function LoadPagedata() {
        var bookingId = localStorage["booking_id"];
        ShowSelfDrive == "yes" ? await loadCity('', 'isSelfDrive') : ''

        setTimeout(() => {
            initAutocomplete();
             if (!localStorage["PageReload"]) {
            getUSERLocation();
        }
        }, 3000);
        $(".timepicker").val("Pick up Time");
        document.getElementById("loader").style.display = "none"
       
        $("#datepicker").val(moment().format('DD-MM-YYYY'))
    }

    async function loadMeruPickPoint(CityCode) {
        const meruPickupPoint = await fetch(BaseURL+domain+'/webapi/meruPickupPoint?city=' + CityCode);
        const meruPickupPoint1 = await meruPickupPoint.json();
        const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
        localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
    }

    // ////////////Load city data code start ///////////
    async function loadCity(departurecode = '', TripType) {
        $("#cabPickupCity").empty();

        return new Promise(async function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: BaseURL+domain+'/webapi/getCityList',
                contentType: "application/json",
                dataType: 'json',
                success: function (data) {
                    let dynamicOption = '';
                    var cityArray = [];
                    // console.log(data);
                    data.forEach(element => {
                        if (element[TripType] == "1") {
                            cityArray.push(element);

                        }
                    })
                    if (TripType == 'isSelfDrive') {
                        dynamicOption += `<option selected="true" disabled value="Select City">Select City</option>`

                    } else {
                        dynamicOption += `<option selected="true" disabled value="Select City">Select City</option>`
                    }
                    $.each(cityArray, function (i, currProgram) {
                        if (departurecode != '' && currProgram.code == departurecode) {
                            dynamicOption += `<option selected="true" value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                            fillTerminalCodeByCity(departurecode)

                        } else {
                            dynamicOption += `<option value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                        }
                    });
                    $("#cabPickupCity").append(dynamicOption)

                    resolve(true);
                },
                error: function (e) {
                    console.log(e)
                    reject("City list not found");
                }
            });
        })

    }
    // ////////////Load city data code end  ///////////

    $("#cabPickupTerminal").on('change', function () {
        var AirportName = $("#cabPickupTerminal :selected").attr('class').split(",")[3]
        if (AirportName.trim() == $("#cabPickupTerminal :selected").text().trim()) {
            source_latitude = $("#cabPickupTerminal :selected").attr('class').split(",")[1]
            source_longitude = $("#cabPickupTerminal :selected").attr('class').split(",")[2]
        }
    })


    // /////////// Fill Terminal code in select field code start /////////////////////
    $('#cabPickupCity').on('change', async function () {
        defaultCashback = 0
        $('#paymentoptions').css("display", "none");

        if (isNaN(document.getElementById("mb_number").value) || document.getElementById("mb_number").value.indexOf(" ") != -1) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter a Valid Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            return;
        }
        if (document.getElementById("mb_number").value.length == 0) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            return;
        }
        if (document.getElementById("mb_number").value.length > 10 || document.getElementById("mb_number").value.length < 10) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter a Valid Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#cabPickupCity").val($("#cabPickupCity option:first").val());
            return;
        }


        await loadMeruPickPoint($(this).find(":selected").val());
        await fillTerminalCodeByCity($(this).find(":selected").val())
        $(".bookBtn").css("display", "none")
        // document.getElementsByClassName("swiper-slide").innerHTML = "";
        // document.getElementById("swiper-wrapper").innerHTML = "";
        DepAirportName = $(this).find(":selected").val()
        $("#pac-input").val('');
        if ($(this).find(":selected").val() == "DXB") {
            $(".manualoption").css("display", "block")
            $("#makeSerIcon").css("display", "none")
            $(".pnr_pickup").css("display", "none")
        } else {
            $(".manualoption").css("display", "none")
            $("#makeSerIcon").css("display", "block")
            $(".pnr_pickup").css("display", "block")
        }
        if (ShowSelfDrive == "yes") {
            $(".pnr_pickup").css("display", "none")

            LoadCardData(PaymentMethod);
        }

        await Track_LoadAnalytics(localStorage["mobileNum"], "departure", "myairportride", "null", SourceCity, $(this).find(":selected").val(), TerminalCode, $(this).find(":selected").val(), pickup_lat, pickup_long, source_latitude, source_longitude,
            moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
    });

    async function fillTerminalCodeByCity(cityCode = '') {
        return new Promise(async function (resolve, reject) {
            $("#cabPickupTerminal").empty();
            let dynamicOption = '';
            const obj = JSON.parse(localStorage["pickupPoint"]);

            let lc = obj;
            let rv;
            rv = lc[cityCode];
            // console.log(rv)
            localStorage.setItem("SelectedSourceCity", JSON.stringify(rv));
            cityCODE = cityCode
            // localStorage.setItem("cityCODE", cityCode);
            source_city = rv[0].source_city
            // localStorage.setItem("source_city", rv[0].source_city)
            if (cityCode == "DEL") {
                source_latitude = rv[2].source_latitude
                source_longitude = rv[2].source_longitude
                // localStorage.setItem("source_latitude", rv[2].source_latitude)
                // localStorage.setItem("source_longitude", rv[2].source_longitude)
            } else {
                source_latitude = rv[0].source_latitude
                source_longitude = rv[0].source_longitude
                //localStorage.setItem("source_latitude", rv[0].source_latitude)
                // localStorage.setItem("source_longitude", rv[0].source_longitude)
            }
            TerminalCode = rv[0].id
            // localStorage.setItem("TerminalCode", rv[0].id)
            SourceName = rv[0]["source_name"]
            // localStorage.setItem("SourceName", rv[0]["source_name"])
            localStorage.setItem("cityValue", cityCode + "-" + rv[0]["id"] + "," + rv[0]["source_latitude"] + "," + rv[0]["source_longitude"] + "," + rv[0]["source_name"])
            rv != undefined && $.each(rv, function (i, currProgram) {
                if (cityCode == "DEL") {
                    dynamicOption += `<option selected value="${currProgram.id
                        }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name
                        }"> ${currProgram.source_name
                        } </option>`
                } else {
                    dynamicOption += `<option value="${currProgram.id
                        }"> ${currProgram.source_name
                        } </option>`
                }
            });
            $("#cabPickupTerminal").append(dynamicOption);
            resolve(true);
        })
    }

    // /////////// Fill Terminal code in select field code end  /////////////////////


    $("#status4").click(function () {
        $(".thank_msg i").removeClass("fa-times-circle");
        $(".thank_msg i").addClass("fa-check-circle");
        $("#brand-logo").css("filter", "blur(0px)");
        $("#addressBox").css("filter", "blur(0px)");
        $("#mapBox").css("filter", "blur(0px)");
        $("#yourInfo").css("filter", "blur(0px)");
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("display", "none");
        // window.location = "booked.html"
        // window.location = "http://predeparturemodify.spicescreen.co/?bookingId=" + localStorage["nonpnr"]
        window.location = "http://edit.myairportride.com/?bookingId=" + localStorage["nonpnr"]
    });

    $("#status2").click(function () {
        $(".thank_msg i").removeClass("fa-times-circle");
        $(".thank_msg i").addClass("fa-check-circle");
        $("#brand-logo").css("filter", "blur(0px)");
        $("#addressBox").css("filter", "blur(0px)");
        $("#mapBox").css("filter", "blur(0px)");
        $("#yourInfo").css("filter", "blur(0px)");
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("display", "none");
        // window.location = "booked.html"
        window.location = "http://edit.myairportride.com/?bookingId=" + localStorage["BookedId"]
    });
    var x = document.getElementById("demo");

    // //////// Fetch current location on page load code start/////////////////
    var MapPlaceId = ''
    async function getUSERLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successHandler1, errorHandler1, {
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        } else {
            Track_analytics(localStorage["booking_id"], "RigoCustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "myRide_toairport");
            console.log("Geolocation is not supported by this browser.");
        }
    }
    var successHandler1 = function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        displaycurrentLocation(lat, lon);
    };
    var errorHandler1 = function (errorObj) {
        Track_analytics(localStorage["booking_id"], "RigoCustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "myRide_toairport");
        console.log(errorObj.code + ": " + errorObj.message);
    };
    function displaycurrentLocation(latitude, longitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        localStorage.setItem("myCurrentPickupLat", latitude)
        localStorage.setItem("myCurrentPickupLong", longitude)
        // console.log(geocoder);

        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {

                    var add = results[0].formatted_address;
                    MapPlaceId = results[0].place_id;
                    var placeAddress = add.split(",");
                    localStorage.setItem("DepartureCityNon-pnr", placeAddress.slice(-3, -1)[0]);
                    localStorage.setItem("DepartureAddressNon-pnr", add);
                    Track_analytics(localStorage["booking_id"], "RigoCustomer", "Null", placeAddress.slice(-3, -1)[0] + "%" + add,
                        "Null", "Null", "Null", "NULL", "myRide_toairport");
                } else {
                    Track_analytics(localStorage["booking_id"], "RigoCustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "myRide_toairport");
                    console.log("address not found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    }
    // //////// Fetch current location on page load code end /////////////////


    // ////////////// Current location fetch code start /////////////////////
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
                enableHighAccuracy: true,
                maximumAge: 10000
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    var successHandler = function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        displayLocation(lat, lon);
    };

    var errorHandler = function (errorObj) {
        console.log(errorObj.code + ": " + errorObj.message);
    };


    var service;
    function displayLocation(latitude, longitude) {
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        localStorage.setItem("myPickupLat", latitude)
        localStorage.setItem("myPickupLong", longitude)
        // console.log(geocoder);

        geocoder.geocode({
            'latLng': latlng
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add = results[0].formatted_address;
                    // console.log(add);
                    document.getElementById("pac-input").innerHTML = add;
                    document.getElementById("pac-input").value = add;
                    var pacInput = document.getElementById("pac-input");
                    $("#pac-input").focus();
                    const pyrmont = {
                        lat: latitude,
                        lng: longitude
                    };
                    // var autocomplete = new google.maps.places.Autocomplete(pacInput);
                    const service = new google.maps.places.PlacesService(pacInput);
                    let getNextPage;
                    getDistancePrice()
                    // Perform a nearby search.


                    function getDistancePrice() {
                        if (source_latitude) {
                            let lat = parseFloat(source_latitude);
                            let lng = parseFloat(source_longitude);

                            PickUpPoint = {
                                lat: lat,
                                lng: lng
                            };
                        } else {
                            PickUpPoint = {
                                lat: 28.554659,
                                lng: 77.090695
                            };
                        } fillInAddress2(results[0]);
                        $("#makeSerIconI").removeClass("fa-map-marker-alt");
                        $("#makeSerIconI").addClass("fa-times");
                        a = results[0].geometry.location.lat();
                        b = results[0].geometry.location.lng();

                        const DropPoint2 = {
                            lat: parseFloat(localStorage["myPickupLat"]),
                            lng: parseFloat(localStorage["myPickupLong"])
                        };

                        pickup_lat = a
                        pickup_long = b

                        let mapp = new google.maps.Map(document.getElementById("map"), {
                            center: PickUpPoint,
                            zoom: 13,
                            mapTypeId: "terrain",
                            mapTypeControl: false,
                            zoomControl: false,
                            streetViewControl: false,
                            fullScreenControl: false
                        });
                        let mk2 = new google.maps.Marker({ position: DropPoint2, map: mapp, title: "Drop Point" });
                        let mk1 = new google.maps.Marker({ position: PickUpPoint, map: mapp, title: "pickup Point" });
                        // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
                        var distance = haversine_distance(mk1, mk2);

                        if (results.length == 0) {
                            return;
                        }
                        let directionsService = new google.maps.DirectionsService();
                        let directionsRenderer = new google.maps.DirectionsRenderer();
                        directionsRenderer.setMap(mapp);
                        // Existing map object displays directions
                        // Create route from existing points used for markers
                        const route = {
                            origin: PickUpPoint,
                            destination: DropPoint2,
                            travelMode: 'DRIVING'
                        }

                        directionsService.route(route, function (response, status) { // anonymous function to capture directions
                            if (status !== 'OK') {
                                window.alert('Directions request failed due to ' + status);
                                return;
                            } else {
                                directionsRenderer.setDirections(response); // Add route to the map
                                var directionsData = response.routes[0].legs[0]; // Get data about the mapped route

                                Track_LoadAnalytics(localStorage["mobileNum"], "departure", "myairportride", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude, "null", "null")

                                if (!directionsData) {
                                    window.alert('Directions request failed');
                                    return;
                                } else {
                                    $("#msg").fadeIn();
                                    KMVal = directionsData.distance.text;
                                    KMTime = directionsData.distance.time;
                                    console.log(KMTime)
                                    let ds = (directionsData.distance.value / 1000);
                                    let distanceP = Math.round(ds);
                                    KMNum = distanceP;
                                    $("#conPicLoc").css("display", "block");
                                }
                                    document.getElementById("datepicker").focus();
                                    document.getElementById("etaDiv").style.marginLeft = "3%";
                                    document.getElementById("etaDiv").style.width = "45%";
                            }
                        });
                    }

                    if ($("#pac-input").val() != "") {
                        $("#pac-input").trigger("places_changed");
                    }
                    $("#makeSerIconI").removeClass("fa-map-marker-alt");
                    $("#makeSerIconI").addClass("fa-times");
                    // initAutocomplete()
                    var value = add.split(",");
                    count = value.length;
                    country = value[count - 1];
                    state = value[count - 2];
                    city = value[count - 3];
                } else {
                    console.log("address not found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    }
    // ////////////// Current location fetch code end /////////////////////

    var pageLoadHeight = window.innerHeight;

    window.addEventListener("resize", (e) => {
        let pageResizedHeight = window.innerHeight;
        if (pageResizedHeight < pageLoadHeight) {
            $(".below_field").css({ // "height": "89%",
                "position": "absolute",
                "bottom": "13%",
                // "left": "5%",
            })
        } else {
            $(".modal").css({
                "position": "absolute",
                // "bottom":"1%",
                // "left": "0"
            })
        }
    });

    var a,
        b;

    function haversine_distance(mk1, mk2) {
        var R = 3958.8; // Radius of the Earth in miles
        var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
        var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
        return d;
    }


    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            let context = this,
                args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);



            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);



        };
    }
    setTimeout(() => {
        var sessionToken = new google.maps.places.AutocompleteSessionToken();
    }, 3000);

    function initAutocomplete() {
        let PickUpPoint;
        if (source_latitude) {
            let lat = parseFloat(source_latitude);
            let lng = parseFloat(source_longitude);
            // console.log(source_latitude);
            // console.log(source_longitude);
            PickUpPoint = {
                lat: lat,
                lng: lng
            };
        } else {
            PickUpPoint = {
                lat: 29.554659,
                lng: 77.090695
            };
        }
        // console.log(PickUpPoint);
        // const DropPoint = {lat: 40.771209, lng: -73.9673991};
        // roadmap, satellite, hybrid and terrain
        const map = new google.maps.Map(document.getElementById("map"), {
            center: PickUpPoint,
            zoom: 13,
            mapTypeId: "terrain",
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
            fullScreenControl: false
        });
        var mk1 = new google.maps.Marker({ position: PickUpPoint, map: map, title: "Drop Point" });

        let inputContainer = document.querySelector('pac-input');
        let autocomplete_results = document.querySelector('.autocomplete-results');
        // let service = new google.maps.places.AutocompleteService();
        let serviceDetails = new google.maps.places.PlacesService(map);

        // Create a new session token.
        // var sessionToken = new google.maps.places.AutocompleteSessionToken();
        var countryRestrict = {
            'country': 'in'
        };
        // Pass the token to the autocomplete service.
        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ // input: 'pizza near Syd',
            componentRestrictions: countryRestrict,
            sessionToken: sessionToken
        }, displaySuggestions);
        let marker = new google.maps.Marker({ map: map });
        var displaySuggestions = function (predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                console.log("Try again. Please refresh the page");
                return;
            }
            let results_html = [];
            results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')

            predictions.forEach(function (prediction) { // <li id="current_location">Get Current location </li>
                results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id
                    }><span class="autocomplete-icon icon-localities"></span> 
                <span class="autocomplete-text">${prediction.description
                    }</span></li>`);
            });
            autocomplete_results.innerHTML = results_html.join("");
            autocomplete_results.style.display = 'block';
            let autocomplete_items = autocomplete_results.querySelectorAll('.autocomplete-item');
            document.getElementById("current_location").addEventListener('click', function () {
                Track_analytics(localStorage["booking_id"], "RigoCustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNRCurrentLocation_click");
                getLocation();
                autocomplete_results.style.display = 'none';
            })
            for (let autocomplete_item of autocomplete_items) {

                autocomplete_item.addEventListener('click', function () {
                    let prediction = {};
                    const selected_text = this.querySelector('.autocomplete-text').textContent;
                    var placeArr = selected_text.split(",");
                    SourceCity = placeArr.slice(-3, -1)[0]
                    // localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);


                    const place_id = this.getAttribute('data-place-id');
                    MapPlaceId = this.getAttribute('data-place-id')
                    let request = {
                        placeId: place_id,
                        fields: ['name', 'geometry']
                    };

                    serviceDetails.getDetails(request, function (place, status) { // console.log(place)
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }
                            var bounds = new google.maps.LatLngBounds();

                            if (source_latitude) {
                                let lat = parseFloat(source_latitude);
                                let lng = parseFloat(source_longitude);
                                PickUpPoint = {
                                    lat: lat,
                                    lng: lng
                                };
                            } else {
                                PickUpPoint = {
                                    lat: 28.554659,
                                    lng: 77.090695
                                };
                            }
                            $("#makeSerIconI").removeClass("fa-map-marker-alt");
                            $("#makeSerIconI").addClass("fa-times");
                            a = place.geometry.location.lat();
                            b = place.geometry.location.lng();

                            const DropPoint2 = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            };

                            pickup_lat = a;
                            pickup_long = b;
                            //localStorage.setItem("pickup_lat", a);
                            // localStorage.setItem("pickup_long", b);
                            var mk2 = new google.maps.Marker({ position: DropPoint2, map: map, title: "Drop Point" });
                            // var line = new google.maps.Polyline({path: [PickUpPoint, DropPoint2], map: map});
                            var distance = haversine_distance(mk1, mk2);

                            if (place.length == 0) {
                                return;
                            }
                            let directionsService = new google.maps.DirectionsService();
                            let directionsRenderer = new google.maps.DirectionsRenderer();
                            directionsRenderer.setMap(map);
                            // Existing map object displays directions
                            // Create route from existing points used for markers
                            const route = {
                                origin: PickUpPoint,
                                destination: DropPoint2,
                                travelMode: 'DRIVING'
                            }

                            directionsService.route(route, function (response, status) { // anonymous function to capture directions
                                if (status !== 'OK') {
                                    window.alert('Directions request failed due to ' + status);
                                    return;
                                } else {
                                    directionsRenderer.setDirections(response); // Add route to the map
                                    var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
                                    if (!directionsData) {
                                        window.alert('Directions request failed');
                                        return;
                                    } else {
                                        $("#msg").fadeIn();
                                        KMVal = directionsData.distance.text;
                                        KMTime = directionsData.distance.time;
                                        console.log(KMTime)
                                        let ds = (directionsData.distance.value / 1000);
                                        let distanceP = Math.round(ds);
                                        KMNum = distanceP;
                                        $("#conPicLoc").css("display", "block");
                                    }
                                    if (KMNum < 5) {
                                        // alert("hello")
                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("Minimum 5km ride is required.")
                                        $("#cmmsg2").css("font-size", "18px")
                                        $(".confirmation_boxCabDiv").css("display", "block")
                                        $(".confirmation_boxCabDiv2").css("display", "block")
                                        $(".confirmation_boxCab2").css("display", "block")
                                        $(".thank_msg").css("display", "none")
                                        $("#status2").css("display", "none")
                                        $("#status5").css("display", "none")
                                        $("#status7").css("display", "block")
                                        $("#statusOutstation").css("display", "none")

                                    }
                                    if (KMNum > 700000) {

                                        $("#cmmsg2").empty()
                                        $("#cmmsg2").html("The distance for your ride is above 70 Km . Book from outstation section for best fares.")
                                        $("#cmmsg2").css("font-size", "18px")
                                        $(".confirmation_boxCabDiv").css("display", "block")
                                        $(".confirmation_boxCabDiv2").css("display", "block")
                                        $(".confirmation_boxCab2").css("display", "block")
                                        $(".thank_msg").css("display", "none")
                                        $("#status2").css("display", "none")
                                        $("#status5").css({ "width": "70px", "font-size": "18px" })
                                        $("#statusOutstation").css("display", "none")
                                    }
                                    else {

                                        document.getElementById("datepicker").focus();
                                        document.getElementById("etaDiv").style.marginLeft = "3%";
                                        document.getElementById("etaDiv").style.width = "45%";

                                    }

                                }
                            });

                        }
                        autocomplete_input.value = selected_text;
                        autocomplete_results.style.display = 'none';
                    });
                    // if(localStorage["PNR_Data"] == "Found"){
                    // }
                })

            }
        };
        let autocomplete_input = document.getElementById('pac-input');
        autocomplete_input.addEventListener('input', debounce(function () {

            if (document.getElementById("mb_number").value.length == 0) {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Mobile Number")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }
            if ($("#cabPickupCity").val() == "Select  City") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Select City")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }



            let value = this.value;
            value.replace('"', '\\"').replace(/^\s+|\s+$/g, '');
            if (value !== "" && value.length >= 7) {
                service.getPlacePredictions({
                    input: value,
                    componentRestrictions: {
                        country: 'in'
                    }
                }, displaySuggestions);
            } else if (value !== "") {
                autocomplete_results.style.display = 'block';
                let results_html = [];
                results_html.push('<li id="current_location"><img src="img/location.png"/><span>Use my Current location</span> <i class="fas fa-solid fa-angle-right"></i></li>')
                autocomplete_results.innerHTML = results_html.join("");

                document.getElementById("current_location").addEventListener('click', function () {
                    getLocation();
                    autocomplete_results.style.display = 'none';
                })
            }
            else {
                autocomplete_results.innerHTML = '';
                autocomplete_results.style.display = 'none';
            }
        }, 500));
    }


    var iOS = navigator.platform && /iPad|iPhone|Mac|iPod/.test(navigator.platform);

    if (iOS) {
        $(".input_srch").css("padding", "0.9em 1.4em .6em .8em");
        $(".client_dtl").css("padding", ".79em 1.4em .6em .8em;");
        $(".depart_ui").css("width", "100%");
        $(".back_depart").css("width", "100%");
    }

    $("#status").click(function () {
        $(".thank_msg i").removeClass("fa-times-circle");
        $(".thank_msg i").addClass("fa-check-circle");
        $("#brand-logo").css("filter", "blur(0px)");
        $("#addressBox").css("filter", "blur(0px)");
        $("#mapBox").css("filter", "blur(0px)");
        $("#yourInfo").css("filter", "blur(0px)");
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("display", "none");
    });
    $("#status5").click(function () {
        localStorage.setItem("loadPagevalue", "outstation")
        location.reload()
    });
    $('#status7').click(function () {
        $('.confirmation_boxCab2').css('display', 'none')
        $('.confirmation_boxCabDiv').css('display', 'none')
        $('#pac-input').val('')
        //location.reload()
    });

   
    $("#makeSerIconI").click(function () {

        if (document.getElementById("mb_number").value.length == 0) {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Enter Mobile Number")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#pac-input").val("");
            return;
        }
        if ($("#cabPickupCity").val() == "Select  City") {
            $("#mandatory").css("display", "block")
            $("#mandatory").html("* Please Select City")
            setTimeout(() => {
                $("#mandatory").css("display", "none")
            }, 2000);
            $("#pac-input").val("");
            return;
        }

        if ($("#makeSerIconI").hasClass("fa-map-marker-alt")) {
            $("#makeSerIconI").removeClass("fa-times");
            $("#makeSerIconI").addClass("fa fa-spinner");
            Track_analytics(localStorage["booking_id"], "RigoCustomer", "null", "null", "null", "null", "NULL", "NULL", "NON-PNRCurrentLocation_click");
            getLocation();
        }
        if ($("#makeSerIconI").hasClass("fa-times")) {
            $("#makeSerIconI").removeClass("fa-times");
            $("#makeSerIconI").removeClass("fa fa-spinner");
            $("#makeSerIconI").addClass("fa-map-marker-alt");
            $("#addressBox").css("height", "230px");
            $("#pac-input").val("");
            $("#ndl1").html("");
            $(".my-button").on("click");
            $(".my-button").removeAttr("disabled", "true");
            $(".my-button").text("Submit");
            initAutocomplete();
        }
    });

    function fillInAddress2(placeVal) { // Get the place details from the autocomplete object.
        const place = placeVal;
        let autocomplete;
        let address1 = "";
        let postcode = "";
        let locality = "";
        let state = "";
        let country = "";
        let clientAdd = "";
        let neighborhood = "";
        let sublocality2 = "";
        let sublocality1 = "";
        let sublocality3 = "";

        for (const component of place.address_components) {
            const componentType = component.types[0];
            switch (componentType) {
                case "street_number":
                    {
                        address1 = `${component.long_name
                            } ${address1}` + ", ";
                        break;
                    }

                case "route":
                    {
                        address1 += component.short_name;
                        break;
                    }

                case "postal_code":
                    {
                        postcode = `${component.long_name
                            }${postcode}`;
                        break;
                    }

                case "postal_code_suffix":
                    {
                        postcode = `${postcode}-${component.long_name
                            }`;
                        break;
                    }
                case "locality": locality = component.long_name;
                    break;
                case "sublocality_level_1": sublocality1 = component.long_name + ", ";
                    break;
                case "sublocality_level_2": sublocality2 = component.long_name + ", ";
                    break;
                case "sublocality_level_3": sublocality3 = component.long_name + ", ";
                    break;
                case "neighborhood": neighborhood = component.long_name;
                    break;

                case "administrative_area_level_1":
                    {
                        state = component.short_name;
                        break;
                    }
                case "country": country = component.long_name;
                    break;
            }
            clientAdd = place.name + " " + address1 + " " + neighborhood + " " + sublocality3 + "" + sublocality2 + "" + sublocality1;
        }
        SourceCity = locality;
    }

    // async function LoadCardData(paymentMethod)
    // {
    //     document.getElementById("loader").style.display = "block";
    //     localStorage.removeItem("LoadTIMEUI")
        
    //     // getstate(pickup_lat, pickup_long);
    //     // function getstate(lat, long) {
    //     //     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + long + '&key=' + 'AIzaSyC59Y7evT_numeVQRjexnhBVC39MXUKOfY')
    //     //         .then((response) => response.json())
    //     //         .then((responseJson) => {
    //     //             console.log(responseJson)
    //     //             var state = responseJson.results[responseJson.results.length - 2].formatted_address;
    //     //             if (String(state).includes(",")) {
    //     //                 state = String(state).split(",")[0];
    //     //             }
    //     //             stateforinvoice = state;
    //     //         })
    //     // }
    // }


    // ////////////////// Create Partner Card UI code start /////////////////////////////
    async function LoadCardData(pmthd) {
        let cabTypeName = CabBookingType
        document.getElementById("Kilometer").innerHTML = KMVal + "s";
        await calculatePricePartnerWise(cabTypeName);

        // let fareCalculate = await calculatePricePartnerWise(cabTypeName);
        // cabFare.push(fareCalculate);
        // localStorage.setItem("partnerFare", parseInt(cabFare[0]));
    }

    ///////////////////// Payment option on changes//////////////////////


    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        minDate: 0,
        onSelect: function (dateText) {

            // Track_LoadAnalytics(localStorage["mobileNum"], "departure", "myairportride", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
            //     moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")

            if ($(".timepicker").val() == "Pick up Time") {
                $("#myForm").css("display", "block");
                $("#time-list-wrap").css("display", "block");
                $(".done_btn").css("display", "none");
                $("#slotdiv").css("display", "block");

                var CardInterval = setInterval(function () {
                    console.log($(".timepicker").val())
                    localStorage.setItem("LoadTIMEUI", true);
                    if ($(".timepicker").val() != "Pick up Time") {
                        clearInterval(CardInterval)
                        LoadCardData(PaymentMethod);
                    }
                }, 1000)
            }
            else if ($(".timepicker").val() != "Pick up Time") {
                LoadCardData(PaymentMethod);
            }
        }
    });

    async function calculatePricePartnerWise(cabTyp) {

        return new Promise(async (resolve, reject) => {

            let sendquestedData = {
                "source_latitude" : pickup_lat,
                "source_longitude" : pickup_long,
                "destination_latitude" : source_latitude,
                "destination_longitude" : source_longitude,
                "distance_value" : KMVal,
                "duration_value" : 150,
                "category_type" : "Daily",
                "city":SourceCity.trim(),
                "state":stateforinvoice,
                "is_airport_pickup": true

            };
            const ReferMega = await fetch('https://testapi.rigocabs.com/api/v1/spicescreen/fare', {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendquestedData)
            });
            const getRigoFare = await ReferMega.json();

            if(getRigoFare.response.length >= 1)
            {
                let Rigo = getRigoFare.response
                Rigo.forEach((element)=>{
                    if(element.servicetype_name.toLowerCase() == "mini")
                    {
                        document.getElementById("MiniFare").innerHTML = "₹ "+element.round_off_estimate_fare
                        document.getElementById("PaidAMOUNT").innerHTML = "₹ "+element.round_off_estimate_fare
                        localStorage.setItem("partnerFare", parseInt(element.round_off_estimate_fare));
                    }
                    if(element.servicetype_name.toLowerCase() == "sedan")
                    {
                        document.getElementById("SedanFare").innerHTML = "₹ "+element.round_off_estimate_fare
                    }
                    if(element.servicetype_name.toLowerCase() == "suv")
                    {
                        document.getElementById("MuvFare").innerHTML = "₹ "+element.round_off_estimate_fare
                    }
                    // if(element.servicetype_name.toLowerCase() == CabBookingType.toLowerCase())
                    // {
                    //     let fare = element.round_off_estimate_fare
                    //     document.getElementById("prRIGO").innerHTML = "₹ "+fare
                    //     resolve(fare)
                    // }
                })
                document.getElementById("greyedbtn").style.display = "none"
                document.getElementsByClassName("bookBtn")[0].style.display = "block"
                resolve(true)

            }
            else{
                document.getElementById("prRIGO").innerHTML = "Not available"
            }
        })
    }

    $(window).click(function (e) { // e.preventDefault();
        $(".autocomplete-results").css("display", "none");
    })

    // //////////////////// Submit Page form data code start ///////////////////////
    document.getElementById("ctn").onsubmit = function (e) {
        e.preventDefault();
        BookMycab('NewPayment')
    }

    document.getElementById("paynowapprov").onclick = function () {
        // BookMycab('PAYTM', "full")
        BookMycab('NewPayment')
    }


    async function BookMycab(PAYMENT_TYPE, paytp) {

        if ($('#terms_condition').is(":checked")) {
        }
        else {
            $("#cmmsg").html("Please agree to the terms & conditions");
            $(".thank_msg i").removeClass("fa-check-circle");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $("#continue").val("Confirm pickup")
            return false;
        }

        if ($("#mb_number").val() == '' || $("#mb_number").val() == undefined) {
            $("#cmmsg").html("Enter Mobile Number");
            $(".thank_msg i").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            return false;
        }

        if (isNaN($("#mb_number").val()) || $("#mb_number").val().indexOf(" ") != -1) {
            $("#cmmsg").html("Please enter a valid mobile number");
            // $("#cmmsg").html("Mobile number should be numeric");
            $(".thank_msg i").css("display", "none");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $("#continue").val("Confirm pickup")
            return false;
        }
        if ($("#mb_number").val().length > 10 || $("#mb_number").val().length < 10 || $("#mb_number").val().includes(".")) {
            $("#cmmsg").html("Please enter a valid mobile number");
            // $("#cmmsg").html("Mobile number should have 10 digits");
            $(".thank_msg i").css("display", "none");
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            $("#continue").val("Confirm pickup")
            return false;
        }

            if ($(".timepicker").val() == "Pick up Time") {
                $("#cmmsg").html("Choose Pickup Date & Time");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false;
            }

            if ($("#pac-input").val() == "" || $("#pac-input").val() == undefined || $("#pac-input").val() == "undefined") {
                $("#cmmsg").html("Please Enter your location ");
                $(".thank_msg i").css("display", "none")
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false
            }
           
            var pick_time;

            // //////////////// Convert time format form AM / PM to 24 hour format code start ////////////////////
            var time = $(".timepicker").val();
            var status = time.includes("M")
            if (status) {
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12)
                    hours = hours + 12;

                if (AMPM == "AM" && hours == 12)
                    hours = hours - 12;

                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10)
                    sHours = "0" + sHours;

                if (minutes < 10)
                    sMinutes = "0" + sMinutes;

                var statusTime = sHours + ":" + sMinutes;
                pick_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime
                localStorage.setItem("Pictime", statusTime)
            } else {
                pick_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + $(".timepicker").val()
                localStorage.setItem("Pictime", $(".timepicker").val())
            }
            // //////////////// Convert time format form AM / PM to 24 hour format code end ////////////////////

            var dateValue = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime
            var currentTime = moment().format('YYYY-MM-DD HH:mm')
            if (currentTime > dateValue) {
                $("#cmmsg").html("You have selected an invalid pickup time.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $("#continue").val("Confirm Pickup");
                return false;
            }

            $(".spinner").css("display", "block")
            $(".spinnerBack").css("display", "block")

            // /////////////////// Load data to create JSON for cab booking code start ///////////////////////
            localStorage.setItem("ptnr", localStorage["partnerName"]);
            var pickup_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + localStorage["Pictime"];

            var price = parseInt(String(localStorage["TotalFare"]).includes("-") ? String(localStorage["TotalFare"]).split("-")[1] : localStorage["TotalFare"]);
            var total_km = KMVal.split(" ");
            totalkm = Math.round(total_km[0]);
            localStorage.setItem("kilometer", totalkm)

            localStorage.setItem("mobileNum", $("#mb_number").val())
            sessionStorage.setItem("MobileNum", $("#mb_number").val())

                  
        // /////////////////// Load data to create JSON for cab booking code end ////////////////////////
        dataJ = {
            "clubMember": [
                {
                    "type": "cabForm",
                    "name_title": '',
                    "user_name": "Customer",
                    "last_name": "Customer",
                    "mobile": $("#mb_number").val(),
                    "email": $('#email_id').val(),
                    "time": Date.now(),
                    "sendLeadSms": "true",
                    "partnerName": 'RIGO',
                    "title": 'RIGO',
                    "category": "CAB",
                    "drop_location": $("#cabPickupTerminal :selected").text().trim(),
                    "pickup_time": pickup_time,
                    "cab_type": CabBookingType,
                    "cab_id": 0,
                    "fare_price": localStorage["partnerFare"],
                    "total_kilometers": totalkm,
                    "terminalCode": cityCODE.trim() == "DEL" ? $("#cabPickupTerminal :selected").text().trim().split("-")[1] : TerminalCode,
                    "msgUniqueId": getRandom(10),
                    "from_city": cityCODE.trim(),
                    "to_city": cityCODE.trim(),
                    "source": $("#pac-input").val().substring(0, 100).trim(),
                    "destination": $("#cabPickupTerminal :selected").text().trim(),
                    "latitude": pickup_lat,
                    "longitude": pickup_long,
                    "isDeparture": 1,
                    "pnr": '',
                    "source_city": SourceCity.trim(),
                    "source_latitude": pickup_lat,
                    "source_longitude": pickup_long,
                    "source_name": $("#pac-input").val().substring(0, 100),
                    "destination_city": source_city.trim(),
                    "destination_latitude": source_latitude,
                    "destination_longitude": source_longitude,
                    "destination_name": $("#cabPickupTerminal :selected").text().trim(),
                    "status": "CAB",
                    "card_type": '',
                    "content_id": localStorage["partnerFare"],
                    "refer_Code": '',
                    "fixedFareId": "",
                    "patner_bookings": "MyAirportRide",
                    "mojoPartner": "RIGO",
                    "carID": '',
                    "token": '',
                    "website_url": "toairport",
                    "user_agent": localStorage["userAgent"],
                    "pay_type": 'post',
                    'paymentMethod': 'PAYBYCASH',
                    "service_charge": 0,
                    "state": stateforinvoice,
                    "order_reference_number": "RGC" + Math.floor(10000000000 + Math.random() * 9000000000),
                    'advance_amount': localStorage["partnerFare"],
                    'discount_type': 'cahsback',
                    'discount_amount': 0
                }
            ]
        };

        // console.log(dataJ);
        localStorage.setItem("RigoToairport", JSON.stringify(dataJ));

        if (PAYMENT_TYPE == "RAZORPAY" && paytp == "full") {
            await addPaymentType('RAZORPAY', '', '', 'full_pay', dataJ.clubMember[0].content_id);
        }
        else if (PAYMENT_TYPE == "RAZORPAY" && paytp == "part") {
            await addPaymentType('RAZORPAY', '', '', 'partial_pay', dataJ.clubMember[0].content_id);
        }

        else if (PAYMENT_TYPE == "PAYTM" && paytp == "full") {
            await addPaymentType('PAYTM', '', '', 'full_pay', dataJ.clubMember[0].content_id);
        }
        else if (PAYMENT_TYPE == "PAYTM" && paytp == "part") {

            await addPaymentType('PAYTM', '', '', 'partial_pay', dataJ.clubMember[0].content_id);
        }

        else if (PAYMENT_TYPE == "NewPayment") {
            console.log(dataJ);
            $(".spinner").css("display", "none")
            $(".spinnerBack").css("display", "none")
            window.location.href = 'payment.html'
        }
        else {
            $.ajax({
                type: 'POST',
                url: BaseAPIURL+domain+'/webapi/cabRegistration',
                contentType: 'application/json',
                Accept: 'application/json',
                data: JSON.stringify(dataJ),
                dataType: 'json',
                success: function (response) {
                    if (response.status == 200) {
                        $("#continue").prop("disabled", true);
                        location.href = "confirmation.html";
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
                    } else {
                        $("#continue").val("Confirm Pickup")
                        $("#cmmsg").html("Booking failed");
                        $(".spinner").css("display", "none")
                        $(".spinnerBack").css("display", "none")
                        $(".thank_msg i").removeClass("fa-check-circle");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                    }
                },
                error: function (res) {
                    console.log("Cab booking failed");
                    $(".spinner").css("display", "none")
                    $(".spinnerBack").css("display", "none")
                    $("#cmmsg").html("Booking failed");
                    $(".thank_msg i").removeClass("fa-check-circle");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                }
            });
        }
    }

    // ///////////////// Cab Img click code start ////////////////////////////
    $(".hatchback").click(async function () {
        if($("#pac-input").val() != '')
        {
            $(".titleLeft").each(function () {
                $(".titleLeft").removeClass("active_cab");
            });
            CabBookingType = 'hatchback'
            $(".hatchback").addClass("active_cab");
            document.getElementById("PaidAMOUNT").innerHTML = document.getElementById("MiniFare").innerHTML;
            let amt = (document.getElementById("MiniFare").innerHTML).split(" ")[1]
            localStorage.setItem("partnerFare", parseInt(amt));
        }
    })

    $(".sedan").click(async function () {
        if($("#pac-input").val() != '')
        {
            CabBookingType = 'sedan'
            $(".titleLeft").each(function () {
                $(".titleLeft").removeClass("active_cab");
            });
            $(".sedan").addClass("active_cab");
            document.getElementById("PaidAMOUNT").innerHTML = document.getElementById("SedanFare").innerHTML;
            let amt = (document.getElementById("SedanFare").innerHTML).split(" ")[1]
            localStorage.setItem("partnerFare", parseInt(amt));
            // LoadCardData(PaymentMethod);
        }
    })

    $(".suv").click(async function () {
        if($("#pac-input").val() != '')
        {
            CabBookingType = 'suv'
            $(".titleLeft").each(function () {
                $(".titleLeft").removeClass("active_cab");
            });

            $(".suv").addClass("active_cab");

            document.getElementById("PaidAMOUNT").innerHTML = document.getElementById("MuvFare").innerHTML;
            let amt = (document.getElementById("MuvFare").innerHTML).split(" ")[1]
            localStorage.setItem("partnerFare", parseInt(amt));
            // LoadCardData(PaymentMethod);
        }
    })
    // ///////////////// Cab Img click code end /////////////////////////////


    $("#status3").click(function () {
        $(".confirmation_boxCab3").css("display", "none");
        $(".confirmation_boxCabDiv3").css("display", "none");
        location.href = "payendBooking.html?payMethod=RAZORPAY"
    })

    ////////////////////// Ride Time UI Code start /////////////////////////////////////
    if (localStorage["loadPagevalue"] == "ride" || localStorage["loadPagevalue"] == "undefined" || localStorage["loadPagevalue"] == undefined) {
        let st = 15;
        let times = [];
        let tt = 60;
        let ap = ["", ""];
        let hour_arr = [];
        let min_arr = [];

        for (let i = 0; tt < 13 * 60; i++) {
            let hh = Math.floor(tt / 60);
            let mm = tt % 60;
            times[i] = ("0" + (
                hh % 12
            )).slice(-2) + ":" + (
                "0" + mm
            ).slice(-2) + ap[Math.floor(hh / 12)];
            tt = tt + st;
        }

        for (k = 0; k <= times.length; k++) {
            if (times[k] != undefined) {
                let timeslot_div = document.createElement("div");
                timeslot_div.setAttribute("class", "time-slot");
                timeslot_div_span = document.createElement("span");
                timeslot_div_span.setAttribute("class", "dispTime");
                timeslot_div_span.setAttribute("id", "time_index" + k);
                var slotTime;
                switch (times[k]) {
                    case "00:00":
                        timeslot_div_span.innerHTML = "12:00";
                        break;
                    case "00:15":
                        timeslot_div_span.innerHTML = "12:15";
                        break;
                    case "00:30":
                        timeslot_div_span.innerHTML = "12:30";
                        break;
                    case "00:45":
                        timeslot_div_span.innerHTML = "12:45";
                        break;
                    default:
                        timeslot_div_span.innerHTML = times[k];
                }
                // timeslot_div_span.innerHTML = times[k];

                timeslot_div.appendChild(timeslot_div_span);
                document.getElementById("time-list-wrap").appendChild(timeslot_div);
            }
        }

        if ($(".dispTime").html() == undefined) {
            $(".dispTime").css("display", "none");
        };

        $(".timepicker").click(() => {

            if (document.getElementById("mb_number").value.length == 0) {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Mobile Number")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                $("#pac-input").val("");
                return;
            }
            if ($("#cabPickupCity").val() == "Select  City") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Select City")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                $("#pac-input").val("");
                return;
            }
            if ($("#pac-input").val() == "") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Pickup Location")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                $("#pac-input").val("");
                return;
            }

            $("#myForm").css("display", "block");
            $("#choosetimegrid").css("display", "block");
            $("#time-list-wrap").css("display", "block");
            $("#timeam").removeClass("activeClass");
            $("#timepm").removeClass("activeClass");
            $("#donetime").css("display", "none");
            $(".dispTime").removeClass("activeClass");
        })
        $(".dispTime").click(function () {

            var x = document.getElementById("timemsg");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", " ");
            }, 2000);

            $(".dispTime").removeClass("activeClass");
            $("#timeam").removeClass("activeClass");
            $("#timepm").removeClass("activeClass");

            $(this).addClass("activeClass");
            localStorage.setItem("depttime", $(this).text());
        });
        var TimeFormat;
        var numberValue;
        $("#timeam").click(() => {
            $("#timeam").addClass("activeClass");
            $("#timepm").removeClass("activeClass");
            if ($(".dispTime").hasClass("activeClass")) {

                TimeFormat = localStorage["depttime"] + " " + $("#timeam").html();
                numberValue = moment(localStorage["depttime"] + " " + $("#timeam").html(), ["h:mm A"]).format("HH:mm");
                if (localStorage["loadPagevalue"] == "outstation") {
                    if (numberValue.split(":")[0] >= 22 || numberValue.split(":")[0] <= 5) {
                        $("#cmmsg").html("Do not select a time between 10pm to 6am");
                        $(".thank_msg i").css("display", "none");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        // return
                    }
                    else {
                        updateTime()
                    }
                }
                else {
                    updateTime()
                }
            }

        })
        $("#timepm").click(() => {
            $("#timepm").addClass("activeClass");
            $("#timeam").removeClass("activeClass");
            if ($(".dispTime").hasClass("activeClass")) {
                TimeFormat = localStorage["depttime"] + " " + $("#timepm").html();
                numberValue = moment(localStorage["depttime"] + " " + $("#timepm").html(), ["h:mm A"]).format("HH:mm");

                if (localStorage["loadPagevalue"] == "outstation") {
                    if (numberValue.split(":")[0] >= 22 || numberValue.split(":")[0] <= 5) {
                        $("#cmmsg").html("Do not select a time between 10pm to 6am");
                        $(".thank_msg i").css("display", "none");
                        $(".confirmation_boxCabDiv").css("display", "block");
                        $(".confirmation_boxCab").css("display", "block");
                        return
                    }
                    else {
                        updateTime()
                    }
                }
                else {
                    updateTime()
                }
            }

        })
        $(".back_icon, .back_text").click(() => {
            $("#myForm").css("display", "none");
        })

        function updateTime() {
            if (String(TimeFormat).includes("undefined")) {
                return false;
            }
            $(".timepicker").html(TimeFormat)
            $(".timepicker").val(TimeFormat)
            $("#myForm").css("display", "none");

            var today = new Date();
            var timeToday = today.getHours();
            var getMin = today.getMinutes();
            if (String(timeToday).length == 1) {
                timeToday = "0" + timeToday
            }
            if (String(getMin).length == 1) {
                getMin = "0" + getMin;
            }
            var ZeroHour = timeToday + 2 + ":" + getMin;

            let todayDate = new Date().toISOString().slice(0, 10)

            var Timevalue = moment(TimeFormat, ["h:mm A"]).format("HH:mm");

            Track_LoadAnalytics(localStorage["mobileNum"], "departure", "myairportride", "null", SourceCity, cityCODE, TerminalCode, source_city, pickup_lat, pickup_long, source_latitude, source_longitude,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), Timevalue)

            if ((todayDate == localStorage["STDdate"]) || (todayDate == moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"))) {
                if (Timevalue < moment().add(120, 'minutes').format('HH:mm')) {
                    $("#cmmsg").html("You are advised to select a time, 2 hour later than current time.");
                    $(".thank_msg i").css("display", "none");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $(".timepicker").val("Pick up Time");
                }
            }

            var pick_time;

            // //////////////// Convert time format form AM / PM to 24 hour format code start ////////////////////
            var time = $(".timepicker").val();
            var status = time.includes("M")
            if (status) {
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12)
                    hours = hours + 12;

                if (AMPM == "AM" && hours == 12)
                    hours = hours - 12;

                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10)
                    sHours = "0" + sHours;

                if (minutes < 10)
                    sMinutes = "0" + sMinutes;

                var statusTime = sHours + ":" + sMinutes;
                pick_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + statusTime
                localStorage.setItem("Pictime", statusTime)
            } else {
                pick_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + $(".timepicker").val()
                localStorage.setItem("Pictime", $(".timepicker").val())
            }
            // //////////////// Convert time format form AM / PM to 24 hour format code end ////////////////////

            let x = $(".timepicker").val().split(" ")[0].split(":")[0];
            localStorage.setItem("removecash", "no")


            if (Timevalue > localStorage["STDtime"]) {
                $("#cmmsg").html("You have selected an invalid pickup time. You are advised to select a time, 3 hours prior to your departure.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pick up Time");
            }
            if (moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") < todayDate) {
                $("#cmmsg").html("You have selected an invalid pickup Date. You are advised to select a time, 3 hours prior to your departure.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pick up Time");
            }
            if (!localStorage["LoadTIMEUI"]) {
                if (ShowSelfDrive != "yes") {
                    if (($("#cabPickupCity").val() != null) && ($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                        LoadCardData(PaymentMethod);
                    }
                }

            }
        }
    }

    ////////////////////// Ride Time UI Code end  //////////////////////////////////////

}

