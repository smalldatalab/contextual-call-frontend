var loginInfo = {}

$('#login').click(function () {
	loginInfo.id = $('#userid').val()
	loginInfo.start = $('#fromdatepicker').val().replace(new RegExp('/', 'g'), "-")
	loginInfo.end = $('#todatepicker').val().replace(new RegExp('/', 'g'), "-")
	window.name = JSON.stringify(loginInfo)
	window.location.href = 'http://lifestreams.smalldata.io/contextual-recall/'
})