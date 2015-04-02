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
            .attr('href', "https://play.google.com/store/search?q=" + app["app_name"])
            .attr('target', "_blank")
            .html(app["app_name"])
            .appendTo(div);
        $("<span>").html(" for " + app["minutes"].toFixed(0) + " minutes at " + moment(app["time"]).format('h:mm a')).appendTo(div);

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
        $("<em>")
            .html(webpage["title"])
            .appendTo(div);
        $("<span>").html(" at " + moment(webpage["time"]).format('h:mm a')).appendTo(div);

        return div;

    }
    console.log(webpages, beforeSleep, html);
    return html;
}