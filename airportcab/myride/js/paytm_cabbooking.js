const addPaymentType = (payType, orderId, order_reference_number, payment_Typ, AmountPaidbyusr) => {
    return new Promise(async function (resolve, reject) {
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        // let status= {statusCode:200};
        // resolve(status)
        var order_reference_number = order_reference_number;
        // console.log(order_reference_number)
        if(order_reference_number == undefined || order_reference_number.length < 1 || order_reference_number.length == '')
        {
          order_reference_number = "BAC" + Math.floor(10000000000 + Math.random() * 9000000000);
        }
        if(payType == "RAZORPAY" )
        {
            RazorpayBookingId = "BAC" + Math.floor(10000000000 + Math.random() * 9000000000);
            order_reference_number = RazorpayBookingId
        }

        const final_data = JSON.parse(localStorage["RigoToairport"])

        function getRandom(length) {
            return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
        }

        if(payType == "PAYTM")
        {
            final_data.clubMember[0].msgUniqueId = getRandom(10)
        }
        // final_data.clubMember[0].fare_price = String(AmountPaidbyusr).replace(/ /g, '');
        final_data.clubMember[0]["paymentMethod"] = payType;
        final_data.clubMember[0]["order_reference_number"] = order_reference_number != undefined ? order_reference_number : '';
        if (payType == "PAYTM" && payment_Typ == "partial_pay") {
            final_data.clubMember[0]["pay_type"] = "partial_paytm";
            final_data.clubMember[0]["advance_amount"] = 50;
            final_data.clubMember[0]["content_id"] =(Number(final_data.clubMember[0]["service_charge"]) + Number(50))
        } else if (payType == "PAYTM" && payment_Typ == "full_pay") {
            final_data.clubMember[0]["pay_type"] = "full_paytm";
        } else if (payType == "SIMPL" && payment_Typ == "partial_pay") {
            final_data.clubMember[0]["pay_type"] = "partial_simpl";
        } else if (payType == "SIMPL" && payment_Typ == "full_pay") {
            final_data.clubMember[0]["pay_type"] = "full_simpl";
        } else if(payType == "RAZORPAY" && payment_Typ == "partial_pay"){
            final_data.clubMember[0]["pay_type"] = "partial_razor";
            final_data.clubMember[0]["advance_amount"] = 50;
            final_data.clubMember[0]["content_id"] =  (Number(final_data.clubMember[0]["service_charge"]) + Number(50))
        } else if(payType == "RAZORPAY" && payment_Typ == "full_pay") {
            final_data.clubMember[0]["pay_type"] = "full_razor";
        } else {
            final_data.clubMember[0]["pay_type"] = "post";
            final_data.clubMember[0]["content_id"] = AmountPaidbyusr;
            final_data.clubMember[0]["advance_amount"] = 0;
            final_data.clubMember[0]["fare_price"] = AmountPaidbyusr;
            final_data.clubMember[0]["discount_type"] = 'cashback';
            final_data.clubMember[0]["discount_amount"] = 0;
            if ((final_data.clubMember[0]["isDeparture"] != 2 && final_data.clubMember[0]["cab_category"] != "Rental") && (final_data.clubMember[0]["isDeparture"] != 1 && final_data.clubMember[0]["cab_category"] != "Outstation")) {
                final_data.clubMember[0]["partnerName"] = localStorage["cashpartnerName"]
                 final_data.clubMember[0]["title"] = localStorage["cashpartnerName"]
             }  
        }

        var UserName = final_data.clubMember[0]["user_name"] 
        localStorage.setItem("TripEND", JSON.stringify(final_data));
        localStorage.setItem("cabbookingData", JSON.stringify(final_data));
        // console.log(final_data.us)
        var dataJ = final_data;
        console.log(dataJ);

        return $.ajax({
            contentType: 'application/json',
            Accept: 'application/json',
            data: JSON.stringify(dataJ),
            dataType: 'json',
            success: function (response) {
                // console.log(response);
                resolve(response);
                window.location = 'confirmation.html';

                // if (payType == "PAYTM") {
                    
                //     $(".spinner").css("display", "none")
                //     $(".spinnerBack").css("display", "none")
                //     paymentUpi('PAYTMPAY', payment_Typ, AmountPaidbyusr , order_reference_number != undefined ? order_reference_number : '');
                // }
                // if(payType == "RAZORPAY"){
                //     check_razorpay(sessionStorage["MobileNum"],UserName,AmountPaidbyusr, payment_Typ);
                // }
                // if(payType == "PAYBYCASH"){
                //     window.location = 'cab_confirm.html';
                // }
                return JSON.stringify(response);
            },
            error: function (err) {
                console.log(err)
                reject(err);
            },
            type: 'POST',
            url: BaseAPIURL+domain+'/webapi/cabRegistration'
        });
    })

}


    /////////////RazorPay code start ///////////////////////////

    var razor_paydata,
    user_data,
    options,
    rzp1;

   function check_razorpay(userMobile, UserName,AmountPaidbyusr, payment_Typ) {

    // if(payment_Typ == 'partial_pay'){
    //     AmountPaidbyusr = "249";
    // }
       var user_amount = {
           "bookingId": RazorpayBookingId,
           "userId": '',
           "userName": UserName,
           "mobileNo": userMobile,
           "email": "cabquery@rigocab.com",
           "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
           "success": true
       }
       console.log(user_amount);
       $.ajax({
           url: BaseURL+domain+"/webapi/initiateRazorPayTrans",
           type: "POST",
           crossDomain: true,
           dataType: "json",
           data: user_amount,
           success: function (response, textStatus, jqXHR) {
               localStorage.setItem("razor_pay", JSON.stringify(response));
               // RazorpayBookingId = response.data["booking_id"];
               abc(UserName,userMobile,AmountPaidbyusr,RazorpayBookingId);
           },
           error: function (jqXHR, textStatus, errorThrown) {
               console.log(jqXHR);

               $("#cmmsg").html("Something went wrong");
               $(".confirmation_boxCabDiv").css("display", "block");
               $(".confirmation_boxCab").css("display", "block");
               $(".spinner").css("display", "none")
               $(".spinnerBack").css("display", "none")
               // console.log(textStatus);
               // console.log(errorThrown);
           }
       });

   }

   function abc(UserName,userMobile,AmountPaidbyusr,RazorpayBookingId) {
       $("#methodPayment").val('RAZORPAY')
       razor_paydata = JSON.parse(localStorage["razor_pay"]);

       options = {
           "key": "rzp_live_NoKgpIbnNwruii", // Add razorpay key
           "amount": String(AmountPaidbyusr).replace(/ /g, '') * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
           "currency": "INR",
           "name": "RIGOCAB",
           "description": "Cab Payment",
            "image": "RIGO cab",
           "order_id": razor_paydata["data"]["id"],
           "handler": function (response) {
               // console.log(response);
               localStorage.setItem("ordr_id", response.razorpay_order_id)
               localStorage.setItem("pymt_id", response.razorpay_payment_id)

              
               // console.log(RazorpayBookingId)
               var pay_success = {
                   "bookingId": RazorpayBookingId,
                   "checkout_logo": "https://cdn.razorpay.com/logo.png",
                   "custom_branding": false,
                   "org_logo": "",
                   "org_name": "RIGO CAB",
                   "userName": UserName,
                   // "date": "25-05-2022 12:30",
                   "date": moment().format('DD-MM-YYYY HH:mm'),
                   "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
                //    "transAmt": 100,
                   "razorpay_order_id": response.razorpay_order_id,
                   "razorpay_payment_id": response.razorpay_payment_id,
                   "razorpay_signature": response.razorpay_signature,
                   "status": "success",
                   "type": 'RIDEPAYMENT',
                   "user_mobile": userMobile,
                   "cab_patner_name": localStorage["ptnr"]
               }
               // console.log(pay_success);
               $.ajax({
                   url: BaseURL+domain+"/webapi/razorPayTransStatus",
                   type: "POST",
                   dataType: "json",
                   data: pay_success,
                   success: function (response, textStatus, jqXHR) {
                       // console.log(response);
                       $(".spinner").css("display", "none")
                       $(".spinnerBack").css("display", "none")

                       var BookingDetails = JSON.parse(localStorage["TripEND"])

                       location.href = "payendBooking.html?payMethod=RAZORPAY"

                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                       console.log(jqXHR);
                       $(".spinner").css("display", "none")
                       $(".spinnerBack").css("display", "none")
                       $("#cmmsg").html("Payment Failed :" + textStatus);
                       $(".confirmation_boxCabDiv").css("display", "block");
                       $(".confirmation_boxCab").css("display", "block");
                   }
               });
           },
           "modal": {
               "ondismiss": function () {
                   window.location = "payment.html"
               }
           },
           "prefill": {
               "name": UserName,
               "email": "cabquery@rigocab.com",
               "contact": userMobile
           },
           "notes": {
               "address": "Rigo cab"
           },
           "theme": {
               "color": "#3399cc"
           }
       };
       rzp1 = new Razorpay(options);
       rzp1.open();
       rzp1.on('payment.failed', function (response) {
           console.log(response)
           localStorage.setItem("error_reason", JSON.stringify(response));
           $("#cmmsg").html(response.error.reason);
           $(".confirmation_boxCabDiv").css("display", "block");
           $(".confirmation_boxCab").css("display", "block");

           var pay_fail = {
               "bookingId": RazorpayBookingId,
               "userName": UserName,
               "date": moment().format('DD-MM-YYYY HH:mm'),
               "transAmt": String(AmountPaidbyusr).replace(/ /g, '') * 100,
            //    "transAmt": 100,
               "razorpay_order_id": razor_paydata["data"]["id"],
               "razorpay_payment_id": response.error.metadata["payment_id"],
               "status": "fail",
            //    "type": 'CAB',
               "type": 'RIDEPAYMENT',
               "user_mobile": userMobile,
               "cab_patner_name": localStorage["ptnr"]
           }
           console.log(pay_fail);
           $.ajax({
               url: BaseURL+domain+"/webapi/razorPayTransStatus",
               type: "POST",
               dataType: "json",
               data: pay_fail,
               success: function (response, textStatus, jqXHR) {
                   // console.log(response);
                   var fail_reason = JSON.parse(localStorage["error_reason"])
                   // console.log(fail_reason);
                   $(".spinner").css("display", "none")
                   $(".spinnerBack").css("display", "none")
                   $("#cmmsg").html("Payment Failed");
                   $(".confirmation_boxCabDiv").css("display", "block");
                   $(".confirmation_boxCab").css("display", "block");
               },
               error: function (jqXHR, textStatus, errorThrown) {
                   console.log(jqXHR);
                   // console.log(textStatus);
                   // console.log(errorThrown);
                   $(".spinner").css("display", "none")
                   $(".spinnerBack").css("display", "none")
                   $("#cmmsg").html("Payment Failed :" + textStatus);
                   $(".confirmation_boxCabDiv").css("display", "block");
                   $(".confirmation_boxCab").css("display", "block");
               }
           });
       });
   }

   /////////////RazorPay code end  ///////////////////////////

   const paymentUpi = async (UPI_PAYMNET_TYPE, payment_Typ, amountfare, order_reference_number) => {
    let registerClubMember = JSON.parse(localStorage.cabbookingData);
    const RegisterClubMember = registerClubMember;
    const final_data = registerClubMember.clubMember

    // if(payment_Typ == 'partial_pay'){
    //     amountfare = "249";
    // }

    const dataR = JSON.stringify({
        "amount": amountfare,
        "custId": "CUST_001",
        "mobileNo": final_data[0].mobile,
        "email": final_data[0].email,
        "bookingId": order_reference_number, // random()
        "type": "cab",
        "pnr": order_reference_number, // same as bookingId
        "partnerName": final_data[0].partnerName,
        "source_name": final_data[0].isDeparture == 0 ? final_data[0].source_name + ', ' + final_data[0].source_city : final_data[0].destination_name,
        "source_city": localStorage["SourceCity"],
        "source_latitude": final_data[0].isDeparture == 0 ? final_data[0].source_latitude : final_data[0].latitude,
        "source_longitude": final_data[0].isDeparture == 0 ? final_data[0].source_longitude : final_data[0].longitude,
        "destination_name": final_data[0].isDeparture == 1 ? final_data[0].source_name + ', ' + registerClubMember.clubMember[0].source_city : final_data[0].destination_name,
        "start_time": final_data[0].pickup_time,
        "cab_type": localStorage["partnercabType"],
        "URL_open": "RIGOCAB_departure",
        "fare_price": amountfare,
        "total_kilometers": final_data[0].total_kilometers
    });
    console.log(dataR)
    const rawResponse = await fetch(BaseURL+domain+"/webapi/initaiteJSPayment", {
        method: 'POST',
        headers: {
            "Authorization": "Basic TUAwSjBib1hYODZHIzpWVSYjKFMmI0pEIyRJWA==",
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: dataR
    });
    const content = await rawResponse.json();
    console.log(content);
    const initaiteJSPayment = { paytmTransId: content.paytmTransId, txnToken: content.data.txnToken, totalAmount: amountfare }
    localStorage.setItem('initaiteJSPayment', JSON.stringify(initaiteJSPayment))
    // window.location = "paytm.html?cancelPage=Payment_booking"
    window.location = "paytm.html?cancelPage=payment"
}

/////////////////////////// UPI payment method end ///////////////////////////////

///////////////////////////// Status Show after payment start ////////////////////////

const ShowStatus = (statusCode) => {

    if (statusCode == 101) {
        $("#reserve4").html("Something went wrong, Please choose another method");
        $(".confirmation_boxCabDiv4").css("display", "block");
        $(".confirmation_boxCab4").css("display", "block");
    }

    if (statusCode == 200) {
        $("#methodPayment").val('Cash')
        $(".confirmation_boxCabDiv3").css("display", "block");
        $(".confirmation_boxCab3").css("display", "block");
    }
}

///////////////////////////// Status Show after payment end ////////////////////////
