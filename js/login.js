var loginInfo = {"mainUrl" : "http://lifestreams.smalldata.io/contextual-recall/",
                 "loginUrl" : "http://lifestreams.smalldata.io/contextual-recall/login.html",
                 "lifestreamsLoginUrl": "http://lifestreams.smalldata.io/login"}

function getURL(){
    return loginInfo.mainUrl + "?" + $.param({
        "id": $('#userid').val(),
        "start": $('#fromdatepicker').val().replace(new RegExp('/', 'g'), "-"),
        "end": $('#todatepicker').val().replace(new RegExp('/', 'g'), "-")
    });
}

$('#login').click(function () {
	window.location.href = getURL();
})

$("#sign-in").click(function(e){
    // redirect user to the ora sign-in page with redirect parameter set as myUrl
    window.location = loginInfo.lifestreamsLoginUrl + "?redirect=" + encodeURIComponent(getURL());
});