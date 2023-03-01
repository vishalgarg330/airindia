var BookigInnerLoad;
window.onload = async function () {

    $(".spinner").css("display", "block")
    $(".spinnerBack").css("display", "block")

    await loadBookingData();
    ///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////

    async function loadBookingData() {
        var BookingData = JSON.parse(localStorage["RigoToairport"])
        BookigInnerLoad = BookingData.clubMember[0];

        let cal = Number(BookigInnerLoad.content_id)+Number(50)
        $("#extraAmount").html("₹" + cal)

        $("#pricemoney").html("₹" + BookigInnerLoad.content_id)
        $("#currentmobile").text(BookigInnerLoad.mobile)
        $("#cab_type").text(BookigInnerLoad.cab_type)
        $("#currenttime").html((BookigInnerLoad.pickup_time).split(" ")[1] + " Hrs");
        $("#currentdate").html(moment((BookigInnerLoad.pickup_time).split(" ")[0], ["YYYY-MM-DD", 'DD-MM-YYYY']).format('DD-MM-YYYY'));
        $("#mobileauto").val(BookigInnerLoad.mobile)
        $("#currentpick").html(BookigInnerLoad.source_name)
        $("#currentdrop").html(BookigInnerLoad.destination_name);

        $("#cabType").html(BookigInnerLoad.cab_type)
       
        // if (BookigInnerLoad.cab_type.toLowerCase() == "sedan") {
        //     $("#typImg img").prop("src", "img/sedan2.png")
        // }
        // else if (BookigInnerLoad.cab_type.toLowerCase() == "suv") {
        //     $("#typImg img").prop("src", "img/suv2.png")
        // }
        // else {
        //     $("#typImg img").prop("src", "img/mini2.png")
        //     $("#cabType").html("mini");
        // }
      
        $(".spinner").css("display", "none")
        $(".spinnerBack").css("display", "none")

    }
}


///////////////////// DATA FILL ON PAGE LOAD CODE START ////////////////

////////////////////PDF DOWNLOAD CODE START ///////////////////////////////  
$('#cabForm').on("submit", async function (e) {
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


});

function searchRandom(length) {
    return "sch" + Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}
var random_serchNum = searchRandom(18);
////////////////////PDF DOWNLOAD CODE END /////////////////////////////// 

var BookingData = JSON.parse(localStorage["RigoToairport"])
BookigInnerLoad = BookingData.clubMember[0];
var amount = BookigInnerLoad.content_id;

//////////////////// Payment calling functions /////////////////////////
    
    // addPaymentType('RAZORPAY', '', '', 'full_pay', amount);
    // addPaymentType('PAYTM', '', '', 'partial_pay', (Number(BookigInnerLoad.service_charge) + Number(50)));
    // addPaymentType('RAZORPAY', '', '', 'partial_pay', (Number(BookigInnerLoad.service_charge) + Number(50)));
    // addPaymentType('PAYBYCASH', '', '', '', amount);


$("#status22").click(function () {
    addPaymentType('PAYTM', '', '', 'full_pay', amount);
});

$("#button2").click(function () {
    $(".mobileauto").css("display", "block");
})

$('#crossicon').click(function () {
    $(".confirmation_boxCabsimpl").css("display", "none");
    $(".confirmation_boxCabDiv").css("display", "none");
})
