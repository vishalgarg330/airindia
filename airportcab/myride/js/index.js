// $(document).ready(function () { // $('.timepicker').mdtimepicker(); // Initializes the time picker

//     $("#datepicker").datepicker({ // dateFormat: "yy-mm-dd",
//         dateFormat: "dd-mm-yy",
//         startDate: '-0m'
//     });

// });
// function showdate() {
//     $("#datepicker").datepicker({
//         startDate: '-0m', dateFormat: "dd-mm-yy",
//     });
// }


function init() {
    localStorage.setItem("PageReload", true);
    localStorage.setItem("loadPagevalue", "ride")

    // document.getElementById("ctn").reset();
    location.reload();

}
function initRental() {
    localStorage.setItem("loadPagevalue", "rental")
    location.reload();
    localStorage.setItem("PageReload", true);
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

// init()


var OutstationShow = "no";

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
    }
    else if ($(this).text() == "Outstation") {
        localStorage.setItem("Outstation", true)

        initoutstation()

    } else if ($(this).text() == "Self Drive") {
        initselfdrive()

    } else {
        init()

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
    } else if (localStorage["loadPagevalue"] == "rental") {
        // alert()
        $(".TripOption").removeClass("selectedTrip")
        $(".rentaltxt").addClass('selectedTrip');
        OutstationShow = "no";
        rentalShow = "yes";
    }
    else if (localStorage["loadPagevalue"] == "selfdrive") {
        ShowSelfDrive = "yes";
        OutstationShow = "no";
        loadMainjs();

        $(".TripOption").removeClass("selectedTrip")
        $(".selfdrivetxt").addClass('selectedTrip');

        $("#ctn").css("display", "block")
        $(".coming_soon2").css("display", "none")
        $(".RideTypeBox").css("display", "none")
        $(".selfType").css("display", "flex")
        $(".ForNon-pnrLoad").css("display", "none")
        $(".pnr_pickup").css("display", "none")
        $("#OutstationLoad").css("display", "none")
        $("#etaDiv").css("display", "none")
        $("#tym2").css("display", "none")
        TripType = 'Airport Round Trip';
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
        Track_analytics(localStorage["booking_id"], "C2ACustomer", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NON-PNR_SelfDriveClick");
    } else {
        loadMainjs();
    }
}


// /////////////////////////// New time Ui slot code Start //////////


// /////////////////////////// New time Ui slot code End //////////

// ///////////////////////Refer & win code start //////////////////////////////////

$("#okay").click(function () {
    localStorage.setItem('fullData', "FullData")
    $(".popupDiv").css("display", "none")
    $(".popupBox").css("display", "none")
})
// localStorage.clear('fullData', "FullData")

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
    console.log(payType)
    payType == "prepaid" ? $(".infoPara").append(`To provide you a 100% confirmed cab, in case of any change in fare, we pay the difference.`) : $(".infoPara").append(`To receive cab driver details, Pay via the online payment link received on whatsapp after booking confirmation within 60 mins before the pickup time.`)
    $(".referMain").css("display", "block");
    $(".referPara i").css("display", "block")
    $(".important").css("display", "block")
    $(".referBlock").css("display", "block");
}
$("#closePay").click(() => {
    $(".referMain").css("display", "none");
    $(".referBlock").css("display", "none");

})


async function Getcode() {
    const Refercode = await fetch(BaseAPIURL + domain + "/webapi/get_DetailsOfReferalCode", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { "mobile": document.getElementById("mb_number").value }
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

//////////////////// Open Page on option choose code start ////////////////////////

$('input[type=radio][name=RideType]').change(function () {
    if (this.value == 'Departure') {
        console.log(' ')
    } else if (this.value == 'Arrival') {
        location.href = "fromairport.html"
    }
});

//////////////////// Open Page on option choose code end  /////////////////////////

$("#close5").click(function () {
    $(".confirmation_boxCabDiv5").css("display", "none");
    $(".confirmation_boxCab5").css("display", "none");
    location.href = "payendBooking.html?payMethod=RAZORPAY"
})

$("#status6").click(function () {
    $(".confirmation_boxCabDiv5").css("display", "none");
    $(".confirmation_boxCab5").css("display", "none");
    location.href = "fromairport.html"
})



