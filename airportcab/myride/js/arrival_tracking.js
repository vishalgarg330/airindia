var msgUniqueIdvalue = ''
// console.log(msgUniqueIdvalue)

var secondsCounter = 0;

function incrementSeconds() {
    secondsCounter += 1;
    localStorage.setItem("totaltime", secondsCounter);
}

var cancel = setInterval(incrementSeconds, 1000);



//////////////////Cookie create start////////////////////

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 10 * 60 * 60 * 1000);
    var expires = "expires=" + d.toGMTString();
    const setCookiesData = cname + "=" + cvalue + ";" + expires + ";path=/";
    document.cookie = setCookiesData + "secure";
    return setCookiesData;
  }
  
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function checkCookie() {
    var user = getCookie("client_Unique_Id");
    if (user != "" && user != null) {
      return user;
    } else {
      user =
        "SJSS" +
        Math.floor(100000 + Math.random() * 900000) +
        new Date().getTime();
      return setCookie("client_Unique_Id", user, 1);
    }
  }

/////////////////cookie create end //////////////////////

// var client_unq_mac = getCookie("client_Unique_Id");
var client_unq_mac = checkCookie();
if(client_unq_mac.includes(";"))
{
    // console.log(client_unq_mac)
    let splitcookie = client_unq_mac.split(";");
    // console.log(splitcookie)
    let splitcookie2 = splitcookie[0];
    // console.log(splitcookie2)
    let splitcookie3 = splitcookie2.split("=")
    // console.log(splitcookie3)
    var splitcookie4 = splitcookie3[1]
    // console.log(splitcookie4);
    client_unq_mac = splitcookie4;
}

function analyticTracking(adid, admenu, adtype) {
    let url2 = adid;
    let advtype = adtype;
    let menutype = admenu;
    // var tempId = parseInt(getIdTemp());
    var id = parseInt(url2);
    var type = advtype;
    var timeDuration = new Date().getTime();
    let msisdn = ""
    dataJ = {
        "tracking": [{
            "id": id,
            "dataLimitReached": false,
            "destination": "WEB",
            "duration": 0,
            "eventId": timeDuration,
            "ip": "WEB",
            "journeyId": "WEB",
            "latitude": "WEB",
            "longitude": "WEB",
            "mac": client_unq_mac,
            // "mac": "WEB",
            "menu": menutype,
            "model": "WEB",
            "msisdn": "WEB",
            "platform_duration": localStorage['totaltime'],
            "play_duration": "N/A",
            "reg_id": "WEB",
            "session_id": "WEB",
            "source": "RIGOCAB",
            "timestamp": timeDuration,
            "trackingDetails": "click",
            "type": type,
            "user_agent": navigator.userAgent.toLowerCase(),
            "platform": "RIGOCAB"
        }],
        "_interface": "AN",
        "deviceId": "8e9082ae95135228",
        "model": "XIAOMIREDMINOTE7S",
        "package": "com.vuscreen.IFE.hosta",
        "partner": "dbrovmhalfs83i130k6u9fh0sj",
        "reg_id": "b6e0c866c81a9aa73b01b8c80c46b65498dedfd3f8e1e53e7359aba29c268499",
        "serverDeviceId": "",
        "sync_type": "WEB",
        "version": "1.7",
        "versionCode": 7
    };

    $.ajax({
        contentType: 'application/json',
        Accept: 'application/json',
        data: JSON.stringify(dataJ),
        dataType: 'json',
        success: function(res) {
            // console.log(res)
          },
          error: function() {
            console.log("menuTracking failed");
          },
        type: 'POST',
        url: BaseAPIURL+domain+'/webapi/vuscreen/spicejetTrack'
    });
}

function getRandom(length) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
}

function Track_analytics(PNR, Name, Dest, source, STA, STD, mobile, OTP, title) {
    dataJ = {
        "clubMember": [{
            "type": "",
            "type": "RIGO Analytics",
            "user_name": Name,
            "last_name": "Customer",
            "mobile": mobile,
            "email": "cabquery@rigocab.com",
            "time": Date.now(),
            "sendLeadSms": "true",
            "title": title,
            "mac_address": client_unq_mac,
            "category": "CAB",
            "msgUniqueId": getRandom(10),
            "source": source,
            "destination": Dest,
            "latitude": "",
            "longitude": "",
            "isDeparture": 1,
            "STD": STD,
            "STA": STA,
            "OTP": OTP,
            "pnr": PNR,
            "status": title
        }]
    };

    $.ajax({
        contentType: 'application/json',
        Accept: 'application/json',
        data: JSON.stringify(dataJ),
        dataType: 'json',
        success: function(response) {
            // console.log(response);
        },
        error: function() {
            console.log("Cab Tracking failed");
        },
        type: 'POST',
        // url: BaseAPIURL+domain+'/webapi/departureAnalytics'
        url: BaseURL+domain+'/webapi/departureAnalytics'
    });
}


async function Track_LoadAnalytics(mobile, pageName, title, Name, source_city, citycode, Terminal, Dest_city, source_lat,
   source_long, dest_lat, dest_long, pickup_date, pickuptime, coupon_code='') {
  console.log(msgUniqueIdvalue)
  msgUniqueIdvalue != ''?msgUniqueIdvalue = msgUniqueIdvalue : msgUniqueIdvalue = String(getRandom(10))
  console.log(msgUniqueIdvalue)
  
  dataJ = {
          "mobile": mobile,
          "category": "cab",
          "pagename": pageName,
          "title": title,
          "type": "RIGO Analytics",
          "user_name": Name,
          "last_name": "Customer",
          "source_city": source_city,
          "city_code": citycode,
          "terminal": Terminal,
          "destination_city": Dest_city,
          "source_lat": source_lat,
          "source_long": source_long,
          "destination_lat": dest_lat,
          "destination_long": dest_long,
          "pickup_date": pickup_date,
          "pickup_time": pickuptime,
          "cabcard_show": "",
          "msgUniqueId": msgUniqueIdvalue,
          "mac_address": client_unq_mac,
          "sendLeadSms": "", 
           "coupon_code": coupon_code
  };

  $.ajax({
      contentType: 'application/json',
      Accept: 'application/json',
      data: JSON.stringify(dataJ),
      dataType: 'json',
      success: function(response) {
          // console.log(response);
      },
      error: function() {
          console.log("Cab Tracking failed");
      },
      type: 'POST',
      url: BaseAPIURL+domain+'/webapi/cab_analyticsApi'
  });
}