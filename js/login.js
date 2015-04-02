var rootUrl = window.location.href.substr(0, window.location.href.lastIndexOf("/")+1);
var loginInfo = {"mainUrl" : rootUrl + "index.html",
                 "loginUrl" : "http://lifestreams.smalldata.io/contextual-recall/login.html",
                 "lifestreamsLoginUrl": "http://lifestreams.smalldata.io/login"};
var datePickerToISO8601 = function(str){
  var eles = str.split("/");
  return  [eles[2], eles[0], eles[1]].join("-")
};

function getURL(){
    return loginInfo.mainUrl + "?" + $.param({
        "start": datePickerToISO8601($('#fromdatepicker').val()),
        "end": datePickerToISO8601($('#todatepicker').val())
    });
}

$('#login').click(function () {
	window.location.href = getURL();
});

$("#sign-in").click(function(e){
    // redirect user to the ora sign-in page with redirect parameter set as myUrl
    window.location = loginInfo.lifestreamsLoginUrl + "?redirect=" + encodeURIComponent(getURL());
});