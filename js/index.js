// parse query string
var start = $.url().param('start');
var end = $.url().param('end');
var key = $.url().param('key');
if(!(start && end && key)){
    window.location.href = "./login.html";
}
var contextQueryUrl = "https://lifestreams.smalldata.io/context/"+start+"/"+end+"?key=" + key;


var spinner = new Spinner({
    lines: 13, // The number of lines to draw
    length: 100, // The length of each line
    width: 10, // The line thickness
    radius: 100, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#FFFFFF', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
}).spin();
$('.modal').modal('show');
$('.modal').append(spinner.el);
$.getJSON(contextQueryUrl,
    function(recallModels){
        $('.modal').modal('hide');
        var index = 0;
        /*----------------------------- FOR SETUP PURPOSES -----------------------------*/
        var resetContext = function() {
            var dailyCues = recallModels[index];
            var cur = moment(dailyCues["date"]);
            $('#date').html(cur.format("dddd, MMMM Do YYYY") + ' to ' + cur.add(1, 'days').format("dddd, MMMM Do YYYY"));

            if (index == 0)
                $('#prev').addClass('disabled');
            else
                $('#prev').removeClass('disabled');

            if (recallModels.length - index - 1 == 0)
                $('#next').addClass('disabled');
            else
                $('#next').removeClass('disabled');

            var beforeWindow = $("#before");
            var beforeSleepCues= dailyCues["before-sleep"];
            beforeWindow.find("#loc").html(place(beforeSleepCues["places"], true));
            //beforeWindow.find("#move").html(cur);
            beforeWindow.find("#app").html(app(beforeSleepCues["apps"], true));
            beforeWindow.find("#call").html(phoneCall(beforeSleepCues["calls"], true));
            beforeWindow.find("#msg").html(sms(beforeSleepCues["sms"], true));
            beforeWindow.find("#net").html(webpage(beforeSleepCues["webpages"], true));


            var afterWindow = $("#after");
            var afterSleepCues= dailyCues["after-sleep"];
            afterWindow.find("#loc").html(place(afterSleepCues["places"], false));
            //afterWindow.find("#move").html(cur);
            afterWindow.find("#app").html(app(afterSleepCues["apps"], false));
            afterWindow.find("#call").html(phoneCall(afterSleepCues["calls"], false));
            afterWindow.find("#msg").html(sms(afterSleepCues["sms"], false));
            afterWindow.find("#net").html(webpage(afterSleepCues["webpages"], false));
        };

        var resetRecall = function() {

            if (recallModels[index].sleepTimeResponse) {
                $('#st-re').prop('checked', true);
                $("#sleep-time").val(recallModels[index].sleepTime);
            }
            else {
                $('#st-no-re').prop('checked', true);
                $("#sleep-time").val('');
            }

            if (recallModels[index].wakeTimeResponse) {
                $('#wt-re').prop('checked', true);
                $("#wakeup-time").val(recallModels[index].wakeupTime);
            }
            else {
                $('#wt-no-re').prop('checked', true);
                $("#wakeup-time").val('');
            }

            $('#recall .active').removeClass('active');
            if (recallModels[index].sleepQualityResponse && recallModels[index].sleepQuality > 0) {
                $('#sq-re').prop('checked', true);
                console.log(recallModels[index].sleepQuality);
                $('#sq'+recallModels[index].sleepQuality).addClass('active');
            }
            else
                $('#sq-no-re').prop('checked', true);
        };

        // Setting up context
        var setup = function() {
            resetContext();
            resetRecall();
        };

        // Saving the recall
        var saveRecall = function() {

            if (recallModels[index].sleepTimeResponse)
                recallModels[index].sleepTime = $("#sleep-time").val();
            if (recallModels[index].wakeTimeResponse)
                recallModels[index].wakeupTime = $("#wakeup-time").val();
        };

        setup();

        /*----------------------------- SETTING UP HANDLERS -----------------------------*/

        // Handling sleep quality clicks
        var sqButtons = [1,2,3,4,5];
        sqButtons.forEach(function (i) {
            $('#sq'+i).click(function () {

                var curActive = $('#recall .active');
                curActive.removeClass('active');

                if (curActive[0] != this) {
                    $(this).addClass('active');
                    recallModels[index].sleepQuality = i;
                    recallModels[index].sleepQualityResponse = true;
                    $('#sq-re').prop('checked', true);
                }
                else {
                    recallModels[index].sleepQuality = 0;
                    recallModels[index].sleepQualityResponse = false;
                    $('#sq-no-re').prop('checked', true);
                }
            })
        })

        // Handling radio button clicks
        $('#st-no-re').click(function () {
            recallModels[index].sleepTimeResponse = false;
        })
        $('#st-re').click(function () {
            recallModels[index].sleepTimeResponse = true;
        })
        $('#wt-no-re').click(function () {
            recallModels[index].wakeTimeResponse = false;
        })
        $('#wt-re').click(function () {
            recallModels[index].wakeTimeResponse = true;
        })
        $('#sq-no-re').click(function () {
            var curActive = $('#recall .active');
            curActive.removeClass('active');
            recallModels[index].sleepQuality = 0;
            recallModels[index].sleepQualityResponse = false;
        })
        $('#sq-re').click(function () {
            recallModels[index].sleepQualityResponse = true;
        })

        // Handling previous/next day
        $('#prev').click(function () {
            saveRecall();
            index--;
            setup();
        })

        $('#next').click(function () {
            saveRecall();
            index++;
            setup();
        })

        $('#submit').click(function () {

            // POST all of the information stored in recallModels here
            var data = JSON.stringify(recallModels);
            var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
            window.open(url, '_blank');
            window.focus();

            //window.name = ""
            //window.location.href = '/C:/Users/Bobby/Downloads/client/login.html' // Replace with routing
        })

    }

)