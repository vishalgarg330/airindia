function onScriptLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const cabOrderId = urlParams.get("cabOrderId");
    const cancelPage = urlParams.get("cancelPage");
    const bookingData = JSON.parse(localStorage["initaiteJSPayment"]);
    let registerClubMember = JSON.parse(localStorage.cabbookingData);

    console.log(bookingData);
    var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
            "orderId": bookingData.paytmTransId, /* update order id */
            "token": bookingData.txnToken, /* update token value */
            "tokenType": "TXN_TOKEN",
            // "amount": 3,/* update amount */
            "amount": Number(bookingData.totalAmount),/* update amount */
            "userDetail": {
                "mobileNumber": registerClubMember.clubMember[0].mobile,
                "name": "RIGOCAB"
            }
        },
        "handler": {
            "notifyMerchant": function (eventName, data) {
                console.log("notifyMerchant handler function called");
                console.log("eventName => ", eventName);
                console.log("data => ", data);
                if (data.message == "App closed from the header icon") {
                   const returnUrl = cabOrderId!=undefined?`${cancelPage}.html?orderId=${cabOrderId}`:`${cancelPage}.html`;
                    window.location = returnUrl;
                }
            }
        }
    };

    console.log(config.data)
    document.getElementById("loader").style.display = "none";
    if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
            // initialze configuration using init method 
            window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
                // after successfully updating configuration, invoke JS Checkout
                window.Paytm.CheckoutJS.invoke();
            }).catch(function onError(error) {
                console.log("error => ", error);
               window.location = "index.html"
            });
        });
    }
}