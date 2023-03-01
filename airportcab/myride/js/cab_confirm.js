window.onload = async function () {

    var MultiplierAmount;

    // $(".spinner").css("display", "block")
    // $(".spinnerBack").css("display", "block")

    document.getElementById("arrivalpageopen").addEventListener("click", () => {
        location.href = "fromairport.html";
    })

    await loadBookingData();



    ///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////
    var BookigInnerLoad;
    async function loadBookingData() {

        var BookingData = JSON.parse(localStorage["cabbookingData"])
        BookigInnerLoad = BookingData.clubMember[0];

        localStorage.setItem("arrival_Airport", BookigInnerLoad.from_city);
        localStorage.setItem("terminalCode", BookigInnerLoad.terminalCode);
        localStorage.setItem("KMNum", BookigInnerLoad.total_kilometers);

        localStorage.setItem("destination_name", BookigInnerLoad.source_name);
        localStorage.setItem("destination_city", BookigInnerLoad.source_city);
        localStorage.setItem("destination_latitude", BookigInnerLoad.source_latitude);
        localStorage.setItem("destination_longitude", BookigInnerLoad.source_longitude);
        localStorage.setItem("source_name", BookigInnerLoad.destination_name);
        localStorage.setItem("source_city", BookigInnerLoad.from_city);
        localStorage.setItem("source_latitude", BookigInnerLoad.destination_latitude);
        localStorage.setItem("source_longitude", BookigInnerLoad.destination_longitude);

        if (BookigInnerLoad.email != "" && BookigInnerLoad.email != "undefined") {

            sendEmail(BookigInnerLoad.email, BookigInnerLoad.order_reference_number, BookigInnerLoad.mobile, "BAC_box")
        }

        $("#cabType").html(BookigInnerLoad.cab_type);
        if (BookigInnerLoad.cab_type.toLowerCase() == "hatchback") {
            $("#cabType").html("mini");
        }

        var fare = BookigInnerLoad.content_id

        var splitFare = parseInt(fare) + 50;
        var fareVal = parseInt(fare);

        if (BookigInnerLoad.to_city == "DXB") {
            $("#bfp").html(localStorage["DubaiFare"]);
            $("#tobfp").html(localStorage["DubaiFare"]);
            $("#discount_amount").html("₹" + 0);
        }
        else {
            $("#bfp").html("₹" + splitFare);
            $("#tobfp").html("₹" + fareVal);
            $("#discount_amount").html("₹" + 50);
        }
        $(".spinner").css("display", "none")
        $(".spinnerBack").css("display", "none")

        $("#epr").html(BookigInnerLoad.fare_price);
        $("#bfp").html("₹" + (Number(BookigInnerLoad.fare_price) + Number(50)));
        $("#tobfp").html("₹" + ((Number(BookigInnerLoad.fare_price) + Number(50)) - Number(50)));

        // $("#cabPartner").html(BookigInnerLoad.partnerName);
        $("#eprk").html(BookigInnerLoad.total_kilometers + "Km");
        $("#pickUpLock").html(BookigInnerLoad.source_name)
        if (BookigInnerLoad.source_name.length > 30) {
            $("#tolocation").html(BookigInnerLoad.source_name.substring(0, 27) + "...")
        }
        else {
            $("#tolocation").html(BookigInnerLoad.source_name)
        }
        $("#dropLoc").html(BookigInnerLoad.destination_name);
        $("#fromlocation").html(BookigInnerLoad.destination_name);
        $("#MobileNo").html(BookigInnerLoad.mobile);
        $("#mobile").html(BookigInnerLoad.mobile);
        $("#picTym").html((BookigInnerLoad.pickup_time).split(" ")[1] + " Hrs");
        $("#picTime").html(moment((BookigInnerLoad.pickup_time).split(" ")[0], ["YYYY-MM-DD", 'DD-MM-YYYY']).format('DD-MM-YYYY'));
        function getRandom(length) {
            return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
        }
    }
        $("#cmmsg1").html("Your booking request is submitted successfully.");
        $("#cmmsg2").append(`You will receive confirmation details shortly through SMS & Whatsapp.<br>For any assistance, call 011-46514254.`);


        $(".confirmation_boxCabDiv2").css("display", "block");
        $(".confirmation_boxCab2").css("display", "block");
        // $("#cmmsg3").append(`Don't forget to take your cashback ,after successful payment through payment link.`);
        $("#arrVAL").html("Okay")
        $("#referclose").css("display", "block");
        $("#popupvalue").addClass("hide");
        $("#arrivalBook2").html("Okay");
}
///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////


////////////////////PDF DOWNLOAD CODE START ///////////////////////////////  
$('#cmcb').on('click', function (e) {
    e.preventDefault();
    $('#cmcb').css('display', 'none')
    // setTimeout(pdfFun, 3000);
    setTimeout(() => {
        pdfFun()
    }, 1000);
})


function pdfFun() {
    localStorage.setItem("moveHere", true)
    e.preventDefault();
    var x, y;
    if (sessionStorage["delivery"]) {
        var a = 500;
        y = 270 + a;
    } else {
        var a = 300;
        y = 350 + a;
    }

    var HTML_Width = $("#cabForm ").width();
    var HTML_Height = $("#cabForm ").height() + 300;
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = HTML_Height;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    var body = document.body,
        html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    html2canvas($("body ")[0], {
        // allowTaint: true,
        useCORS: true
    }).then(function (canvas) {
        canvas.getContext('2d');

        // console.log(canvas.height + " " + canvas.width);

        var imgData = canvas.toDataURL("image/jpeg ", 1.0);

        // window.location.href = imgData;

        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height + a]);
        pdf.addImage(imgData, 'JPEG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.setFillColor(0, 0, 0);

        var textX, textY;
        // if (coupon_card == " " || coupon_card == "null ") {
        textX = 225, textY = 530;

        if (localStorage["PNR_Data"] == "Found") {
            let pnrD = JSON.parse(localStorage["pnrData"]);
            Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "PDF DOWNLOAD");
        }
        else {
            Track_analytics(localStorage["booking_id"], "C2ACustomer", "Null", "Null", "Null", "Null", "NULL", "NULL", "PDF DOWNLOAD Non-PNR");
        }
        pdf.save("cabConfirmationInfo.pdf");

        setTimeout(function () {
            //$(".confirmation_box ").fadeIn(1000);
            $(".confirmation_boxCabDiv").fadeIn(1000);
            $(".confirmation_boxCab").fadeIn(1000);
            // localStorage.setItem("PDF_download",true);
        }, 2000);

        myFunction();
    });
    function myFunction() {
        var x = document.getElementById("snackbarCab");
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", " ");
        }, 5000);
    }

    $('#cmcb').css('display', 'block')

};

function searchRandom(length) {
    return "sch" + Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}
var random_serchNum = searchRandom(18);
////////////////////PDF DOWNLOAD CODE END /////////////////////////////// 

/////////////////////////Refer & win code start //////////////////////////

// function refernow() {
//     $(".referMain").css("display", "block");
//     $(".referBlock").css("bottom", "-1px");
//     $("#refernow").css("display", "block");
//     $("#passenger_name").addClass("Adrefer")
//     Getcode();
// }

$("#referclose").click(function () {
    $(".confirmation_boxCabDiv2").css("display", "none");
    $(".confirmation_boxCab2").css("display", "none");

})
$("#close5").click(function () {
    $("#confirmation_boxCabDiv5").css("display", "none");
    $("#confirmation_boxCab5").css("display", "none");

})
$("#close6").click(function () {
    $("#confirmation_boxCabDiv5").css("display", "none");
    $("#confirmation_boxCab5").css("display", "none");

})
$("#referclose2").click(function () {
    $(".confirmation_boxCabDiv").css("display", "none");
    $(".confirmation_boxCab").css("display", "none");

})
$("#referDivClose").click(function () {
    $("#passenger_name").removeClass("Adrefer")
    $(".referBlock").css("bottom", "-150%");
    $(".referMain").css("display", "none");
})

function refernow() {
    $(".referMain").css("display", "block");
    $(".referBlock").css("bottom", "-1px");
    $("#refernow").css("display", "block");
    $("#passenger_name").addClass("Adrefer")
    Getcode();
}

async function Getcode() {
    const Refercode = await fetch(BaseAPIURL+domain+"/webapi/get_DetailsOfReferalCode", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { "mobile": localStorage["mobileNum"] }
        )
    });
    const ReferResponse = await Refercode.json();
    // $("#codevalue").val(ReferResponse.data.Coupon_Code);
    sessionStorage.setItem("codevalue", ReferResponse.data.Coupon_Code);
    // await refercode();
}

function infoBox() {
    $(".referMain").css("display", "block");
    $(".referBlock").css("bottom", "-1px");
    $("#refernow").css("display", "none");

}
// ///////////////////////Refer & win code end //////////////////////////////////

$("#status6").click(function () {
    localStorage.setItem("discount", document.getElementById("couponapi").innerText);
    $(".confirmation_boxCabDiv2").css("display", "none");
    $(".confirmation_boxCab2").css("display", "none");
})

$('#returnArrival').click(function () {
    location.href = "arrival.html?loadData";
})

document.getElementById("arrivalBook").onclick = function () {
        $(".confirmation_boxCabDiv2").css("display", "none");
        $(".confirmation_boxCab2").css("display", "none");
}
document.getElementById("arrivalBook2").onclick = function () {
        $(".confirmation_boxCabDiv").css("display", "none");
        $(".confirmation_boxCab").css("visibility", "hidden");
}
///////////////////////Book arrival cab code end /////////////////////////////

///////////////////////Book arrival cab code start ///////////////////////////
$("#status6").click(function () {
    localStorage.setItem("discount", document.getElementById("couponapi").innerText);
    $(".confirmation_boxCabDiv5").css("display", "none");
    $(".confirmation_boxCab5").css("display", "none");
    location.href = "arrival.html";
})

///////////////////////Book arrival cab code end /////////////////////////////

/////////////////////Check Arrival cab availability code start //////////////
async function CheckArrivalCity() {
    $.ajax({
        type: 'GET',
        url: BaseAPIURL+domain+'/webapi/getCityList',
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            console.log(data)
            let dynamicOption = '';
            var cityArray = [];
            data.forEach(element => {
                if (element.is_arrival == "1") {
                    cityArray.push(element);
                }
            })
            // console.log(cityArray);
            var arrItem = cityArray.filter(item => {
                if (item.code == localStorage["arrival_Airport"]) {
                    return item;
                }
            })
            // console.log(arrItem)
            if (arrItem.length >= 1) {
                $("#popupvalue").addClass("show");
                $("#arrivalBook2").html("Book Now");
            }
            else {
                $("#popupvalue").addClass("hide");
                $("#arrivalBook2").html("Okay");
                $("#referclose2").css("display", "none");
                $("#reserve").html(" ");

                let pnrD = JSON.parse(localStorage["pnrData"]);
                Track_analytics(localStorage["booking_id"], pnrD[0]["FirstName"], pnrD[0]["ArrivalStation"], pnrD[0]["DepartureStation"], pnrD[0]["STA"], pnrD[0]["STD"], pnrD[0]["PassengerNumber"], "NULL", "ArrivalStation_notAvail");

            }
            departure_Ads();
        },
        error: function (e) {
            console.log(e)
        }
    });


}

/////////////////////Check Arrival cab availability code end ///////////////

////////////////////////////////////////email button/////////////////////////////////////////////
var BookingData = JSON.parse(localStorage["cabbookingData"])
var BookigInnerLoad;
BookigInnerLoad = BookingData.clubMember[0];
$("#icon").click(function () {

    var emailVal = $("#typemail").val()
    if (emailVal == "") {
        alert("Please enter your email id")
        return false
    }
    else {
        $('#cmcb').css('display', 'block')
        $('#icon').css('display', 'none')
        $('#typemail').css('display', 'none')
        $('#line').css('display', 'none')
        $('#sentmail').css('display', 'block')
        console.log(BookigInnerLoad);
        sendEmail($("#typemail").val(), BookigInnerLoad.order_reference_number, BookigInnerLoad.mobile, "BAC")

    }

})




//////////////////////////////////Send Email///////////////////////////////

function sendEmail(email, bookingId, phoneNumber, name) {
    // console.log("hey");
    // console.log(email, bookingId, phoneNumber);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "email": email,
        "name": name,
        "bookingId": bookingId,
        "urlType": "CAB",
        "phoneNumber": phoneNumber,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(BaseAPIURL+domain+"/webapi/sendEmailOfInvoice", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
