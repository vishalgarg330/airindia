if((localStorage["booking_id"] != null) || (localStorage["booking_id"] != "null"))
{
    console.log(".")
}
else{   
    function getURLParameter(url, name) {
        return (RegExp(name + '=' + '(.+?)(&|$)').exec(url) || [, null])[1];
    }
    localStorage["booking_id"] = getURLParameter(location.href, 'pnr');
}

// function showdate() {
//     $("#datepicker").datepicker({
//         startDate: '-0m', dateFormat: "dd-mm-yy",
//         // endDate: '+2d');
//     });
// }
// $("#datepicker").datepicker({ // dateFormat: "yy-mm-dd",
//         dateFormat: "dd-mm-yy",
//         startDate: '-0m'
//  });

//  document.getElementById("departureLoad").onclick = function(e){
//     e.preventDefault();
//     window.open(this.href+"?pnr="+localStorage["booking_id"],"_self");
//   }

function init() {
    localStorage.setItem("PageReload", true);
    localStorage.setItem("loadPagevalue", "ride")
    // document.getElementById("ctn").reset();
    location.reload();
}
function initoutstation() {
    localStorage.setItem("loadPagevalue", "outstation")
    location.reload();
    localStorage.setItem("PageReload", true);
}

function initselfdrive() {
    localStorage.setItem("loadPagevalue", "selfdrive")
    location.reload();
    localStorage.setItem("PageReload", true);
}
function initRental() {
    localStorage.setItem("loadPagevalue", "rental")
    location.reload();
    localStorage.setItem("PageReload", true);
}



// init()

var BookingTrip_Type = "City Ride"
var ShowSelfDrive = "no";
$(".TripOption").click(async function () {
    $(".TripOption").removeClass("selectedTrip")
    $(this).addClass('selectedTrip');

    if ($(this).text() == "Rental") {
        // ShowSelfDrive = "no";
        // OutstationShow = "no";
        // $("#ctn").css("display", "none")
        // $(".coming_soon2").css("display", "block")
        // $(".selfType").css("display", "none")

        // uncomment this 
        ShowSelfDrive = "no";
        OutstationShow = "no";
        $("#BydefaultShow").empty()
        $("#outstationBox").empty()
        $(".journeyInfo").css("display", "none")
        initRental()
    } else if ($(this).text() == "Outstation") {
        localStorage.setItem("Outstation", true)

        initoutstation()

    } else if ($(this).text() == "Self Drive") {
        initselfdrive()

    } else {
        init()
        
        loadRidehtml()
        loadMainjs();
        OutstationShow = "no";
        ShowSelfDrive = "no";
        $("#ctn").css("display", "block")
        $(".selfType").css("display", "none")
        $(".coming_soon2").css("display", "none")
        $(".ForNon-pnrLoad").css("display", "block")
        $(".pnr_pickup").css("display", "block")
        $("#etaDiv").css("display", "block")
        $("#tym2").css("display", "block")
        $("#pickupDiv").css("width", "49%");
        // $(".fa-sort-down").css("right", "3%")
        $("#pickupDiv2").css("display", "block");
        $("#OutstationLoad").css("display", "none")

        $("#cabPickupTerminal").empty();

        let optionCreate = document.createElement("option")
        optionCreate.setAttribute("selected", true)
        optionCreate.setAttribute("disabled", true)
        optionCreate.innerHTML = "Select Terminal"
        document.getElementById("cabPickupTerminal").appendChild(optionCreate)

        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";
        BookingTrip_Type = "City Ride"
        localStorage["rideType"] = "City"
        $("#notePoint").css("display", "none")
        $(".titleLeft").each(function () {
            $(".titleLeft img").removeClass("active_cab");
        });
        $(".sedan img").addClass("active_cab");

        $(".auto_btn").removeClass("btn_enable");
        $("#continue").removeAttr('enabled');
        $("#continue").css("color", "#828282");
        localStorage.removeItem("cab_response")
        $("#pac-input").val('');
        $("#makeSerIconI").addClass("fas fa-map-marker-alt");
        $("#makeSerIconI").removeClass("fa-times");
    }
})


loadData()

function loadData() {
    if (localStorage["loadPagevalue"] == "outstation") {
        $(".TripOption").removeClass("selectedTrip")
        $(".outstationtxt").addClass('selectedTrip');
        OutstationShow = "yes";
        loadOutstationhtml()
        loadOutstationData()
    }
    else if (localStorage["loadPagevalue"] == "rental") {
        // alert()
        $(".TripOption").removeClass("selectedTrip")
        $(".rentaltxt").addClass('selectedTrip');
        OutstationShow = "no";
        rentalShow = "yes";
        loadRentalhtml()
        loadRentalData()
    }    
    else if (localStorage["loadPagevalue"] == "selfdrive") {
        ShowSelfDrive = "yes";
        OutstationShow = "no";
        loadRidehtml()
        loadMainjs();

        $(".TripOption").removeClass("selectedTrip")
        $(".selfdrivetxt").addClass('selectedTrip');

        $("#ctn").css("display", "block")
        $(".RideTypeBox").css("display", "none")
        $(".coming_soon2").css("display", "none")
        $(".selfType").css("display", "flex")
        $(".ForNon-pnrLoad").css("display", "none")
        $(".pnr_pickup").css("display", "none")
        $("#OutstationLoad").css("display", "none")
        $("#etaDiv").css("display", "none")
        $("#tym2").css("display", "none")
        localStorage.setItem("trip_type", 'Airport Round Trip');
        BookingTrip_Type = "SELF_DRIVE"
        localStorage["rideType"] = "SELF_DRIVE"
        document.getElementsByClassName("swiper-slide").innerHTML = "";
        document.getElementById("swiper-wrapper").innerHTML = "";

        let optionCreate = document.createElement("option")
        optionCreate.setAttribute("selected", true)
        optionCreate.setAttribute("disabled", true)
        optionCreate.innerHTML = "Select Terminal"
        document.getElementById("cabPickupTerminal").appendChild(optionCreate)

        $(".auto_btn").removeClass("btn_enable");
        $("#continue").removeAttr('enabled');
        $("#continue").css("color", "#828282");
        localStorage.removeItem("ArrivalStation")
        if (localStorage["PNR_Data"] == "Found") {
            let pnrD = JSON.parse(localStorage["pnrData"]);
            Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PNR_SelfDriveClick");
        } else {
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNR_SelfDriveClick");
        }
    } else {
        loadMainjs();
    }
}

// ///////////////////////Refer & win code start //////////////////////////////////

$("#okay").click(function () {
    localStorage.setItem('fullData', "FullData")
    $(".popupDiv").css("display", "none")
    $(".popupBox").css("display", "none")
})

function refernow() {
    $(".referMain").css("display", "block");
    $(".referBlock").css("bottom", "-1px");
    $("#refernow").css("display", "block");
    $("#passenger_name").addClass("Adrefer")
    Getcode();
}

$("#referclose").click(function () {
    $("#passenger_name").removeClass("Adrefer")
    // $(".referBlock").css("bottom", "-150%");
    $(".referMain").css("display", "none");
    $(".referBlock").css("display", "none");
})


function infoBox(payType) {
    $(".infoPara").empty()
    payType == "prepaid"?$(".infoPara").append(`To provide you a 100% confirmed cab, in case of any change in fare, we pay the difference.`):$(".infoPara").append(`To receive cab driver details, Pay via the online payment link received on whatsapp after booking confirmation within 60 mins before the pickup time.`)
    $(".referMain").css("display", "block");
    $(".referPara i").css("display","block")
    $(".important").css("display","block")
    $(".referBlock").css("display", "block");
}
$("#closePay").click(() => {
    $(".referMain").css("display", "none");
    $(".referBlock").css("display", "none");

})

// console.log(localStorage['couponPara_val']);
// if((localStorage['couponPara_val'] != null) && ( localStorage['couponPara_val'] != "null" ) && ( localStorage['couponPara_val'] != "")){
//     $("#coupon").val(localStorage['couponPara_val']);
//     if(localStorage['fullData'] !='FullData'){
//         applyCoupon()
//     }else{
    
//         $("#CouponCode").val($("#coupon").val());
//         localStorage.setItem("CouponCode", $("#coupon").val());
//         $("#coupon").val("Congrats! you'll get a cashback link on trip start")
//         $("#coupon").attr("disabled", "true").css({ "width": "95%", "color": "#828282" });
//         $("#applyCoupon").css("display", "none")
//         $(".infoBox").css("display", "none")
//         $("#couponSuccessMsg").css("display", "none")
//     }
    
   
// }

async function Getcode() {
    const Refercode = await fetch(BaseAPIURL+domain+"/webapi/get_DetailsOfReferalCode", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {"mobile": document.getElementById("mb_number").value}
        )
    });
    const ReferResponse = await Refercode.json();
    // console.log(ReferResponse);
    $("#codevalue").val(ReferResponse.data.Coupon_Code);
}

setInterval(() => {
    if ($("#coupon").val() != '') {
        $("#applyCoupon").css("color", "blue");
    } else {
        $("#applyCoupon").css("color", "grey");
    }
}, 500);

// ///////////////////////Refer & win code end //////////////////////////////////

$("#okay").click(function () {
    localStorage.setItem('fullData', "FullData")
    $(".popupDiv").css("display", "none")
    $(".popupBox").css("display", "none")
    
})


var tripType
function printHour(id) {
    $(".time").click(function (id) {
        $(".time").removeClass("selectedItem")
        $(this).addClass('selectedItem')
        // document.getElementById("mb_number").value = "";
        document.getElementById("pac-inputOutstation").value = "";
        document.getElementById("Drop-input").value = "";
        // document.getElementById("timepicker").value = "";
        // document.getElementById("cabPickupCity").value = "Select pickup city";
        $("#ConfirmButton").css("display","none")
        $("#swiperDiv").css("display","none")
        $("#searchI").addClass("fa-map-marker-alt");
        $("#searchI").removeClass("fa-times");
        $("#searchII").removeClass("fa-times");
        $("#searchII").addClass("fa-search");
        localStorage.removeItem("depttime")
    })
    tripType = id
    console.log(id)
    localStorage.setItem("tripType",tripType)
}
//////////////////// Open Page on option choose code start ////////////////////////

$('input[type=radio][name=RideType]').change(function () {
    if (this.value == 'Departure') {
        location.href="toairport.html"
    } else if (this.value == 'Arrival') {
        console.log(' ')        
    }
});


//////////////////// Open Page on option choose code end  /////////////////////////