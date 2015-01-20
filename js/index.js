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
var index = 0;
var range = end.diff(start, 'days');

var cuesPromises = [];
for (var i = 0; i <= range; i++) {
    var date = moment(loginInfo.start, "MM-DD-YYYY").add(i, 'days')
    recallModels[i] = {
        date : date.format("MM/DD/YYYY"),
        // sleepTimeResponse : false,
        // wakeTimeResponse : false,
        // sleepQualityResponse : false,
        sleepTimeConfidence : 0,
        wakeTimeConfidence : 0,
        sleepQualityConfidence : 0,
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

            $('#date').html(cur.format("dddd, MMMM Do YYYY"));

            if (index == 0)
                $('#prev').addClass('disabled')
            else
                $('#prev').removeClass('disabled')

            if (range - index == 0)
                $('#next').addClass('disabled')
            else
                $('#next').removeClass('disabled')

            $("#context #loc").html(contextModels[index].locStr);
            $("#context #move").html(contextModels[index].moveStr);
            $("#context #app").html(contextModels[index].appStr);
            $("#context #call").html(contextModels[index].callStr);
            $("#context #msg").html(contextModels[index].msgStr);
            $("#context #net").html(contextModels[index].netStr);
        }

        var resetRecall = function() {

            $("#sleep-time").val(recallModels[index].sleepTime);
            $("#wakeup-time").val(recallModels[index].wakeupTime);

            var resetButton = function(stem, value) {
                $('#'+ stem + ' .active').removeClass('active');
                if (recallModels[index][value] > 0) {
                    $('#'+stem+recallModels[index][value]).addClass('active');
                }
            }

            resetButton('sq', "sleepQuality");
            resetButton('sc', "sleepTimeConfidence");
            resetButton('wc', "wakeTimeConfidence");
            resetButton('sqc', "sleepQualityConfidence");
        }

// Setting up context
        var setup = function() {
            resetContext()
            resetRecall()
        }

// Saving the recall
        var saveRecall = function() {
            // if (recallModels[index].sleepTimeResponse)
            recallModels[index].sleepTime = $("#sleep-time").val();
            // if (recallModels[index].wakeTimeResponse)
            recallModels[index].wakeupTime = $("#wakeup-time").val();
        }

        setup();

        /*----------------------------- SETTING UP HANDLERS -----------------------------*/

        var setupButtons = function (stem, value) {
            var buttons = [1,2,3,4,5];
            buttons.forEach(function(i) {
                $('#'+stem+i).click(function () {
                    var curActive = $('#'+stem+' .active');
                    curActive.removeClass('active');

                    if (curActive[0] != this) {
                        $(this).addClass('active');
                        recallModels[index][value] = i;
                    }
                    else {
                        recallModels[index][value] = 0;
                    }
                })
            })
        }

        setupButtons('sq', "sleepQuality");
        setupButtons('sc', "sleepTimeConfidence");
        setupButtons('wc', "wakeTimeConfidence");
        setupButtons('sqc', "sleepQualityConfidence");

        // $('#st-no-re').click(function () {
        //     recallModels[index].sleepTimeResponse = false;
        // })
        // $('#st-re').click(function () {
        //     recallModels[index].sleepTimeResponse = true;
        // })
        // $('#wt-no-re').click(function () {
        //     recallModels[index].wakeTimeResponse = false;
        // })
        // $('#wt-re').click(function () {
        //     recallModels[index].wakeTimeResponse = true;
        // })
        // $('#sq-no-re').click(function () {
        //     var curActive = $('#recall .active');
        //     curActive.removeClass('active');
        //     recallModels[index].sleepQuality = 0;
        //     recallModels[index].sleepQualityResponse = false;
        // })
        // $('#sq-re').click(function () {
        //     recallModels[index].sleepQualityResponse = true;
        // })

// Handling previous/next day
        $('#prev').click(function () {
            saveRecall();
            cur.subtract(1, 'days');
            index--;
            setup();
        })

        $('#next').click(function () {
            saveRecall();
            cur.add(1, 'days');
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
