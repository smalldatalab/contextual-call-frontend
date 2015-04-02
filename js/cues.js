/**
 * Created by changun on 4/1/15.
 */

function place (places, beforeSleep){
    var place = beforeSleep ? places[places.length-1] : places[0];
    var html = "";
    if(place){
        var div = $("<div>");
        $("<span>").html(beforeSleep? "Stayed " : "Arrived ").appendTo(div);
        $("<a>")
            .attr('href', place["googleMapUrl"])
            .attr('target', "_blank")
            .html([place["street"], place["area"][0]].join(" "))
            .appendTo(div);
        if(beforeSleep) {
            var time = " until " + moment(place["end"]).format('h:mm a');
        }else{

            var time = " at " + moment(place["time"]).format('h:mm a');
        }
        $('<span>').html(time).appendTo(div);
        return div;

    }
    console.log(places, beforeSleep, html);
    return html;
}

function app (apps, beforeSleep){
    var app = beforeSleep ? apps[apps.length-1] : apps[0];
    var html = "";
    if(app){
        var div = $("<div>");
        $("<span>").html("Used ").appendTo(div);
        $("<a>")
            .attr('href', app["app"])
            .attr('target', "_blank")
            .html(app["app_name"])
            .appendTo(div);
        $("<span>").html(" for " + moment.duration( app["minutes"], "minutes").humanize() + " at " + moment(app["time"]).format('h:mm a')).appendTo(div);

        return div;

    }
    console.log(apps, beforeSleep, html);
    return html;
}

function webpage (webpages, beforeSleep){
    var webpage = beforeSleep ? webpages[webpages.length-1] : webpages[0];
    var html = "";
    if(webpage){
        var div = $("<div>");
        $("<span>").html("Browse ").appendTo(div);
        $("<em>").append($("<a>").html(webpage["title"])
                                 .attr('target', "_blank")
                                 .attr("href", webpage["url"]))

                 .appendTo(div);
        $("<span>").html(" at " + moment(webpage["time"]).format('h:mm a')).appendTo(div);

        return div;

    }
    console.log(webpages, beforeSleep, html);
    return html;
}

function sms (msgs, beforeSleep){
    var msg = beforeSleep ? msgs[msgs.length-1] : msgs[0];
    var html = "";
    if(msg){
        var div = $("<div>");
        $("<span>").html(msg["type"] == "Send" ?  "Sent " : "Received ").appendTo(div);
        $("<em>")
            .html(msg["body"])
            .appendTo(div);
        $("<span>").html((msg["type"] == "Send" ?  " from " : " to ") + (msg["name"] || msg["phone"])).appendTo(div);
        $("<span>").html(" at " + moment(webpage["time"]).format('h:mm a')).appendTo(div);


        return div;

    }
    console.log(msgs, beforeSleep, html);
    return html;
}

function phoneCall (calls, beforeSleep){
    var call = beforeSleep ? calls[calls.length-1] : calls[0];
    var html = "";
    if(call){
        var div = $("<div>");
        var diff = moment(call["end"]).diff(moment(call["time"]));
        $("<span>").html(call["type"] == "Call" ?  "Called " : "Received call from ").appendTo(div);

        $("<span>").html(call["name"] || call["phone"]).appendTo(div);
        $("<span>").html(" at " + moment(call["time"]).format('h:mm a')).appendTo(div);
        $("<span>").html(" for " + moment.duration( diff).humanize()).appendTo(div);


        return div;

    }
    console.log(calls, beforeSleep, html);
    return html;
}