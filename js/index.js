/*----------------------------- RETRIEVING INFO FROM LOGIN -----------------------------*/

try{

    var loginInfo = $.parseUrl(window.location).query;
    // use either id (manually input by the user) or uid (returned by googld sign-in)
    var id = loginInfo.id ? loginInfo.id : loginInfo.uid;
    var start = moment(loginInfo.start, "MM-DD-YYYY");
    var end = moment(loginInfo.end, "MM-DD-YYYY");
    // make sure we have received these parameters.
    if(!(id && loginInfo.start && loginInfo.end && start && end)){
        window.location.href = "login.html";
    }
}catch(e){
    alert("Configuration Error.");
    window.location.href = "login.html";
}


var contextModels = [];
var recallModels = [];

var cur = moment(loginInfo.start, "MM-DD-YYYY");
var next = moment(loginInfo.start, "MM-DD-YYYY").add(1, 'days');
var index = 0;
var range = end.diff(start, 'days');

var cuesPromises = [];
for (var i = 0; i < range; i++) {
    var date = moment(loginInfo.start, "MM-DD-YYYY").add(i, 'days')
    recallModels[i] = {
        date : date.format("MM/DD/YYYY"),
        sleepTimeResponse : false,
        wakeTimeResponse : false,
        sleepQualityResponse : false,
        sleepTime : "",
        wakeTime : "",
        sleepQuality : 0
    };
    // push the Promise that return the contextual cue for the date
    cuesPromises.push(getCues(date));
}

// Only initializing UI when we have received cues for everyday
RSVP.all(cuesPromises).then(function(contextModels){
/*----------------------------- FOR SETUP PURPOSES -----------------------------*/

        var resetContext = function() {

            $('#date').html(cur.format("dddd, MMMM Do YYYY") + ' to ' + next.format("dddd, MMMM Do YYYY"));

            if (index == 0)
                $('#prev').addClass('disabled')
            else
                $('#prev').removeClass('disabled')

            if (range - index - 1 == 0)
                $('#next').addClass('disabled')
            else
                $('#next').removeClass('disabled')

            $("#before #loc").html(contextModels[index].locStr);
            $("#before #move").html(contextModels[index].moveStr);
            $("#before #app").html(contextModels[index].appStr);
            $("#before #call").html(contextModels[index].callStr);
            $("#before #msg").html(contextModels[index].msgStr);
            $("#before #net").html(contextModels[index].netStr);

            $("#after #loc").html(contextModels[index + 1].locStr);
            $("#after #move").html(contextModels[index + 1].moveStr);
            $("#after #app").html(contextModels[index + 1].appStr);
            $("#after #call").html(contextModels[index + 1].callStr);
            $("#after #msg").html(contextModels[index + 1].msgStr);
            $("#after #net").html(contextModels[index + 1].netStr);
        }

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
        }

// Setting up context
        var setup = function() {
            resetContext()
            resetRecall()
        }

// Saving the recall
        var saveRecall = function() {

            if (recallModels[index].sleepTimeResponse)
                recallModels[index].sleepTime = $("#sleep-time").val();
            if (recallModels[index].wakeTimeResponse)
                recallModels[index].wakeupTime = $("#wakeup-time").val();
        }

        setup();

        /*----------------------------- SETTING UP HANDLERS -----------------------------*/

// Handling sleep quality clicks
        var sqButtons = [1,2,3,4,5]
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
            cur.subtract(1, 'days');
            next.subtract(1, 'days');
            index--;
            setup();
        })

        $('#next').click(function () {
            saveRecall();
            cur.add(1, 'days');
            next.add(1, 'days');
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
);
