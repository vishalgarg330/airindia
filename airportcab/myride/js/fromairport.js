
var MultiplierAmount;
var sessionToken
function loadMainjs() {
    var SourceCityName;
    var stateforinvoice;
    var couponDiscountAmt = 0
    let paymthd1;
    let paymthd2;
    var source_latitude;
    var cityCODE;
    var source_longitude;
    var SourceCity;
    var pickup_lat;
    var pickup_long;
    var TerminalCode;
    var arrivalAirport;
    var ArrivalStation;
    var SourceName;
    var KMVal;
    var KMNum;
    var PaymentMethod = 'payment'
    var PaymentAmt = ''
    var PaymentLater = ''
    var couponCodeValue = 0
    var couponcodeType = 'cashback'
    var couponcodePayType = ''
    var content_id = 0;
    var fare_price = 0;
    var CabBookingType = 'sedan'
    var defaultCashback = 0


    document.getElementById("mb_number").onchange = function () {
        // checkMobile();
        if ($("#mb_number").val().length == 10 && $("#mb_number").val() != undefined) {
            localStorage.setItem("mobileNum", $("#mb_number").val())
            Track_LoadAnalytics($("#mb_number").val(), "arrival", "RIGOCAB", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")
        }
    }

    $("#datepicker").datepicker({
        dateFormat: 'dd-mm-yy',
        minDate: 0,
        onSelect: function (dateText) {

            Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "RIGOCAB", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long,
                moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), "null")

            if ($(".timepicker").val() == "Pick up Time") {
                $("#myForm").css("display", "block");
                $("#time-list-wrap").css("display", "block");
                $(".done_btn").css("display", "none");
                $("#slotdiv").css("display", "block");
                // $( "#datepicker" ).datepicker({ minDate: 0});

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
                LoadCardData(PaymentMethod)
            }
        }
    });

    window.onload = async function () {
        localStorage.removeItem("CabSHOW");
    }

    LoadPagedata()
    async function LoadPagedata() {
        var bookingId = localStorage["booking_id"];
        ShowSelfDrive == "yes" ? loadCity('', 'isSelfDrive') : ''
        setTimeout(() => {
            initAutocomplete();
        }, 3000);
        await getPNR(bookingId);
    }

    async function loadMeruPickPoint(CityCode) {
        const meruPickupPoint = await fetch(BaseURL+domain+'/webapi/meruPickupPoint?city=' + CityCode);
        const meruPickupPoint1 = await meruPickupPoint.json();
        const srcLocationResult = JSON.parse(JSON.stringify(meruPickupPoint1));
        localStorage.setItem("pickupPoint", JSON.stringify(meruPickupPoint1));
    }


    // ////////////Load city data code start ///////////
    async function loadCity(ArrivalCode = '', TripType) {
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
                   
                    data.forEach(element => {
                        if (element[TripType] == "1") {
                            cityArray.push(element);
                        }
                    })
                    console.log(cityArray)
                    if (TripType == 'isSelfDrive') {
                        dynamicOption += `<option selected="true" value="Select City">Select City</option>`
                    } else {
                        dynamicOption += `<option selected="true" value="Select City">Select City</option>`
                    }
                    $.each(cityArray, function (i, currProgram) {
                        if (ArrivalCode != '' && currProgram.code == ArrivalCode) {
                            dynamicOption += `<option selected="true" value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                            fillTerminalCodeByCity(ArrivalCode)
                        }
                        else {
                            dynamicOption += `<option value="${currProgram.code
                                }"> ${currProgram.name
                                } </option>`
                        }
                    });
                    $("#cabPickupCity").append(dynamicOption)
                    resolve(true);
                },
                error: function (e) {
                    reject("City list not found");
                }
            });
        })

    }
    // ////////////Load city data code end  ///////////////////

    $("#cabPickupTerminal").on('change', function () {
        var AirportName = $("#cabPickupTerminal :selected").attr('class').split(",")[3]
        if (AirportName.trim() == $("#cabPickupTerminal :selected").text().trim()) {
            source_latitude = $("#cabPickupTerminal :selected").attr('class').split(",")[1]
            source_longitude = $("#cabPickupTerminal :selected").attr('class').split(",")[2]
        }
        if ($("#pac-input").val() != "") {
            LoadCardData(PaymentMethod);
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
        arrivalAirport = $(this).find(":selected").val()
        $("#pac-input").val('');

        if ($(this).find(":selected").val() == "DXB") {
            $(".manualoption").css("display", "block")
            $("#makeSerIcon").css("display", "none")
            $(".pnr_pickup").css("display", "none")
        }
        else {
            $(".manualoption").css("display", "none")
            $("#makeSerIcon").css("display", "block")
            $(".pnr_pickup").css("display", "block")
        }
        if (ShowSelfDrive == "yes") {
            $(".pnr_pickup").css("display", "none")
            LoadCardData(PaymentMethod);
        }

        await Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "RIGOCAB", "null", "null", $(this).find(":selected").val(), "null", $(this).find(":selected").val(), "null", "null", "null", "null", "null", "null")


    });

    async function fillTerminalCodeByCity(cityCode = '') {
        return new Promise(async function (resolve, reject) {

            ArrivalStation = cityCode
            //  localStorage.setItem('ArrivalStation', cityCode)
            $("#cabPickupTerminal").empty();
            let dynamicOption = '';

            const obj = JSON.parse(localStorage["pickupPoint"]);
            let lc = obj;
            let rv;
            rv = lc[cityCode];
            localStorage.setItem("SelectedSourceCity", JSON.stringify(rv));
            cityCODE = cityCode
            // localStorage.setItem("cityCODE", cityCode);
            SourceCityName = rv[0].source_city;
            if (cityCode == "DEL") {
                source_latitude = rv[2].source_latitude
                //  localStorage.setItem("source_latitude", rv[2].source_latitude)
                source_longitude = rv[2].source_longitude
                //  localStorage.setItem("source_longitude", rv[2].source_longitude)
            }
            else {
                source_latitude = rv[0].source_latitude
                source_longitude = rv[0].source_longitude
                //   localStorage.setItem("source_latitude", rv[0].source_latitude)
                //localStorage.setItem("source_longitude", rv[0].source_longitude)
            }
            TerminalCode = rv[0].id
            //localStorage.setItem("TerminalCode", rv[0].id)
            SourceName = rv[0]["source_name"]
            //  localStorage.setItem("SourceName", rv[0]["source_name"])
            localStorage.setItem("cityValue", cityCode + "-" + rv[0]["id"] + "," + source_latitude + "," + source_longitude + "," + rv[0]["source_name"])
            rv != undefined && $.each(rv, function (i, currProgram) {
                if (cityCode == "DEL") {
                    dynamicOption += `<option selected value="${currProgram.id
                        }" class="${cityCode + "-" + currProgram.id + "," + currProgram.source_latitude + "," + currProgram.source_longitude + "," + currProgram.source_name}"> ${currProgram.source_name
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
        sessionToken = new google.maps.places.AutocompleteSessionToken();
        initAutocomplete()
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

            predictions.forEach(function (prediction) { // <li id="current_location">Get Current location </li>
                results_html.push(`<li class="autocomplete-item" data-type="place" data-place-id=${prediction.place_id
                    }><span class="autocomplete-icon icon-localities"></span> 
                    <span class="autocomplete-text">${prediction.description
                    }</span></li>`);
            });
            autocomplete_results.innerHTML = results_html.join("");
            autocomplete_results.style.display = 'block';
            let autocomplete_items = autocomplete_results.querySelectorAll('.autocomplete-item');
            for (let autocomplete_item of autocomplete_items) {

                autocomplete_item.addEventListener('click', function () {
                    let prediction = {};
                    const selected_text = this.querySelector('.autocomplete-text').textContent;
                    var placeArr = selected_text.split(",");
                    SourceCity = placeArr.slice(-3, -1)[0];
                    // localStorage.setItem("SourceCity", placeArr.slice(-3, -1)[0]);
                    // localStorage.setItem("stateforinvoice", placeArr.slice(-2, -1)[0]);


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

                            pickup_lat = a
                            pickup_long = b
                            //localStorage.setItem("pickup_lat", a);
                            //localStorage.setItem("pickup_long", b);
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

                                    Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "RIGOCAB", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long, "null", "null")


                                    if (!directionsData) {
                                        window.alert('Directions request failed');
                                        return;
                                    } else {
                                        $("#msg").fadeIn();
                                        KMVal = directionsData.distance.text;
                                        let ds = (directionsData.distance.value / 1000);
                                        let distanceP = Math.round(ds);
                                        KMNum = distanceP;
                                        $("#conPicLoc").css("display", "block");

                                    }
                                    if (KMNum < 5) {
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

                                    if (KMNum > 70000) {
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
                $("#pac-input").val("");
                return;
            }
            if ($("#cabPickupCity").val() == "Select City") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Select City")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
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
            } else {
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

    const arrival_Airport = '';
    async function getPNR(bookingId) {

        document.getElementById("loader").style.display = "block"
        $(".timepicker").val("Pick up Time");
        document.getElementById("loader").style.display = "none"
        localStorage.setItem("PNR_Data", "Not-Found")
        PnrdataNotFound();
    }

    async function PnrdataNotFound() {
        // departure_Ads()
        $("#datepicker").val(moment().format('DD-MM-YYYY'))
        // $( "#datepicker" ).datepicker({ minDate: 0});
        //$(".journeyInfo").css("display", "none");
        $("#passenger_name").css("display", "none");
        $(".pnr_pickup").css("margin", "0 0px 6px 0");
        $(".form_mb").css("margin", "1.5% 0 1% 3%");

        if (localStorage["mobileNum"] != "undefined" && localStorage["mobileNum"] != undefined && localStorage["mobileNum"] != "null" && localStorage["mobileNum"] != null) {
            $("#mb_number").val(localStorage["mobileNum"]);
        }
        Track_analytics(localStorage["booking_id"], "RigoCustomer", "Null", "Null", "Null", "Null", "Null", "NULL", "Myride_toairport");
    }

    $("#makeSerIconI").click(function () {
        if ($("#makeSerIconI").hasClass("fa-map-marker-alt")) {

            Track_analytics(localStorage["booking_id"], "RigoCustomer", "null", "null", "null", "null", "NULL", "NULL", "NON-PNRCurrentLocation_click");
        }
        if ($("#makeSerIconI").hasClass("fa-times")) {
            $("#makeSerIconI").removeClass("fa-times");
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


    // ////////////////// Create Partner Card UI code start /////////////////////////////
  
    async function LoadCardData(paymentMethod) {
       
        let cabTypeName = CabBookingType
        document.getElementById("Kilometer").innerHTML = KMVal + "s";
        await calculatePricePartnerWise(cabTypeName);
    
    }


    async function calculatePricePartnerWise(cabTyp) {

        return new Promise(async (resolve, reject) => {

            let sendquestedData = {
                "source_latitude" : source_latitude,
                "source_longitude" : source_longitude,
                "destination_latitude" : pickup_lat,
                "destination_longitude" : pickup_long,
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
    document.getElementById("PayByCash").onclick = function () {
        BookMycab('NewPayment')
    }

    document.getElementById("paynowapprov").onclick = function () {
        BookMycab('NewPayment')
    }


    async function BookMycab(PAYMENT_TYPE, paytp) {
        if ($('#terms_condition').is(":checked")) {
        }
        else {
            $("#cmmsg").html("Please agree to the terms & conditions");
            $(".thank_msg i").css("display", "none")
            $(".confirmation_boxCabDiv").css("display", "block");
            $(".confirmation_boxCab").css("display", "block");
            // $("#continue").val("Confirm pickup")
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
                $(".thank_msg i").css("display", "none")
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                return false;
            }
            if ($("#mb_number").val() == '' || $("#mb_number").val() == undefined) {
                $("#cmmsg").html("Enter Mobile Number");
                $(".thank_msg i").css("display", "none")
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
                    return false;
                }

                // /////////////////// Load data to create JSON for cab booking code start ///////////////////////
                localStorage.setItem("ptnr", localStorage["partnerName"]);


              
                $(".spinner").css("display", "block")
                $(".spinnerBack").css("display", "block")

                var pickup_time = moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") + " " + localStorage["Pictime"];
                if (SourceCityName != "Dubai") {
                    var price = parseInt(String(localStorage["TotalFare"]).includes("-") ? String(localStorage["TotalFare"]).split("-")[1] : localStorage["TotalFare"]);
                    // var price = "1";
                    var total_km = KMVal.split(" ");
                    totalkm = Math.round(total_km[0]);
                }

                $("#continue").val("Please wait..")

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
                            "email": $("#email_id").val(),
                            "time": Date.now(),
                            "sendLeadSms": "true",
                            "partnerName": 'RIGO',
                            "title": 'RIGO',
                            "category": "CAB",
                            "drop_location": $("#pac-input").val().substring(0, 100),
                            "pickup_time": pickup_time,
                            "cab_type": CabBookingType,
                            "cab_id": 0,
                            "fare_price": localStorage["partnerFare"],
                            "total_kilometers": totalkm,
                            "terminalCode": cityCODE.trim() == "DEL" ? $("#cabPickupTerminal :selected").text().trim().split("-")[1] : TerminalCode,
                            "msgUniqueId": getRandom(10),
                            "host_id": "Website",
                            "from_city": cityCODE.trim(),
                            "to_city": cityCODE.trim(),
                            "source": $("#cabPickupTerminal :selected").text().trim(),
                            "destination": $("#pac-input").val().substring(0, 100).trim(),
                            "latitude": source_latitude,
                            "longitude": source_longitude,
                            "isDeparture": 2,
                            "pnr": localStorage["booking_id"],
                            "source_city": SourceCityName.trim(),
                            "source_latitude": source_latitude,
                            "source_longitude": source_longitude,
                            "source_name": $("#cabPickupTerminal :selected").text().trim(),
                            "destination_city":  SourceCity.trim(),
                            "destination_latitude": pickup_lat,
                            "destination_longitude": pickup_long,
                            "destination_name": $("#pac-input").val().substring(0, 100),
                            "status": "CAB",
                            "card_type": 'Rigo',
                            "content_id": localStorage["partnerFare"],
                            "mojoPartner": "RIGO",
                            "order_reference_number": "RGC" + Math.floor(10000000000 + Math.random() * 9000000000),
                            "refer_Code": '',
                            "fixedFareId": "",
                            "website_url": "Fromairport",
                            "user_agent": localStorage["userAgent"],
                            "service_charge": 0,
                            "pay_type": 'post',
                            'paymentMethod': 'PAYBYCASH',
                            'state': stateforinvoice,
                            'advance_amount': localStorage["partnerFare"],
                            'discount_type': 'cahsback',
                            'discount_amount': 0
                        
                        }]
                };
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
                            $("#cmmsg").html("Booking failed");
                            $(".spinner").css("display", "none")
                            $(".spinnerBack").css("display", "none")
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
                $(".titleLeft img").removeClass("active_cab");
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
        // console.log(times)


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
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }
            if ($("#cabPickupCity").val() == "Select City") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Select City")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
                $("#pac-input").val("");
                return;
            }
            if ($("#pac-input").val() == "") {
                $("#mandatory").css("display", "block")
                $("#mandatory").html("* Please Enter Drop Location")
                setTimeout(() => {
                    $("#mandatory").css("display", "none")
                }, 2000);
                // $("#cabPickupCity").val($("#cabPickupCity option:first").val());
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
                updateTime()
            }

        })
        $("#timepm").click(() => {
            $("#timepm").addClass("activeClass");
            $("#timeam").removeClass("activeClass");
            if ($(".dispTime").hasClass("activeClass")) {
                TimeFormat = localStorage["depttime"] + " " + $("#timepm").html();
                numberValue = moment(localStorage["depttime"] + " " + $("#timepm").html(), ["h:mm A"]).format("HH:mm");
                updateTime()
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
            var city_code = $("#cabPickupCity").val()
         //   console.log(city_code);
            if (city_code == "DEL") {

                today = new Date(today.getTime() + (10 * 60 * 1000));
                console.log(city_code);
            }

            else if (city_code == "CCU") {
                today = new Date(today.getTime() + (60 * 60 * 1000));
            }
            else {
                today = new Date(today.getTime() + (60 * 60 * 1000));
            }

            var timeToday = today.getHours();
            var getMin = today.getMinutes();
            if (String(timeToday).length == 1) {
                timeToday = "0" + timeToday
            }
            if (String(getMin).length == 1) {
                getMin = "0" + getMin;
            }
            var ZeroHour = timeToday + ":" + getMin;
            let todayDate = new Date().toISOString().slice(0, 10)

            var Timevalue = moment(TimeFormat, ["h:mm A"]).format("HH:mm");

            Track_LoadAnalytics(localStorage["mobileNum"], "arrival", "RIGOCAB", "null", SourceCityName, cityCODE, TerminalCode, SourceCity, source_latitude, source_longitude, pickup_lat, pickup_long, moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD"), Timevalue)

            if (moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD") < todayDate) {
                $("#cmmsg").html("You have selected an invalid pickup Date & Time.");
                $(".thank_msg i").removeClass("fa-check-circle");
                $(".confirmation_boxCabDiv").css("display", "block");
                $(".confirmation_boxCab").css("display", "block");
                $(".timepicker").val("Pick up Time");
            }

            if (todayDate == moment($("#datepicker").val(), ["DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("YYYY-MM-DD")) {
                if (Timevalue < ZeroHour) {
                    if (city_code == "DEL") {
                        $("#cmmsg").html("You are advised to select a time, 10 minutes later than current Time.");
                    }
                    else if (city_code == "CCU") {
                        $("#cmmsg").html("You are advised to select a time, 30 minutes later than current Time.");
                    }
                    else {
                        $("#cmmsg").html("You are advised to select a time, 30 minutes later than current Time.");
                    }

                    $(".thank_msg i").css("display", "none");
                    $(".confirmation_boxCabDiv").css("display", "block");
                    $(".confirmation_boxCab").css("display", "block");
                    $(".timepicker").val("Pick up Time");
                }
            }

            if (!localStorage["LoadTIMEUI"]) {
                if (ShowSelfDrive != "yes") {
                    if (($("#cabPickupCity").val() != null) && ($("#cabPickupTerminal").val() != null) && ($("#pac-input").val() != '') && ($("#datepicker").val() != '') && ($(".timepicker").val() != "Pick up Time")) {
                        LoadCardData(PaymentMethod)
                    }
                }
            }
        }
    }
}