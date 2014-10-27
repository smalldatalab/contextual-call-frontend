var endpoint = "http://lifestreams.smalldata.io/oauth/query";
var uid = $.parseUrl(window.location).query["uid"];
var user = uid ? uid : "ba99e7fe-2914-4581-ace5-b0eef52391c2";
var get = function(url, params){
    return new RSVP.Promise(function(resolve, reject) {

        $.get(url, params,
            function(data){
                // succeed
                resolve(data);
            }).fail(
            function(error){
                console.error(error);
                // or reject
                reject(error);
            });
    });
};
var postJSON =function(url, params){
    return new RSVP.Promise(function(resolve, reject) {

        $.post(url, params,
            function(data){
                // succeed
                resolve(data);
            }, "json").fail(
            function(error){
                console.error(error);
                // or reject
                reject(error);
            });
    });
};
var fetchAddrs = function(lat, lng){
    return new RSVP.Promise(function(resolve, reject) {
        var params =  {
            "format": "json",
            "lat": lat,
            "lon": lng,
            "zoom": 18,
            "addressdetails": 1
        };
        $.get("http://nominatim.openstreetmap.org/reverse",
            params,
            function(osm_data){
                // succeed
                resolve(osm_data);
            }).fail(
            function(error){
                console.error(error);
                // or reject
                reject(error);
            });
    });
};
var fetchData = function(date, query){
    return get(query)
        .then(function(data){
        return postJSON(endpoint,
               {"cmd": data,
                "start": date.format('YYYY-MM-DD'),
                "end": moment(date).add(1, 'days').format('YYYY-MM-DD'),
                "types": ["StayAction", "TravelAction", "UseAction"],
                "user" : user}
        )})
        .then(function(data){
            return new RSVP.Promise(function(resolve, reject) {
                resolve(data["results"][0]);
            })
        })
    };
var getPlaceName = function(addrs){
    if(addrs["suburb"]) {
        return addrs["suburb"];
    }
    else if (addrs["street"]) {
        return addrs["street"];
    }
    else if(addrs["road"]) {
        return addrs["road"];
    }
};

// Get context cues for a day
var getCues = function(date) {
    var commonGetFn = function(sparql, k, strFn){

        return fetchData(date, sparql)
            .then(function(data){
                return new RSVP.Promise(function(resolve, reject) {
                    var obj = {};
                    obj[k] = data ? strFn(data) : "";
                    resolve(obj);
                });
            });
    };
    var app = commonGetFn("js/sparql/last-app.sparql", "appStr",
        function(data){
            return sprintf("%s is the last app that you used.", data["app_name"])
        });

    var net = commonGetFn("js/sparql/last-webpage.sparql", "netStr",
        function(data){
            return sprintf("%s is the last webpage.", new URL(data["webpage"]).hostname)
        });
    var call = commonGetFn("js/sparql/last-call.sparql", "callStr",
        function(data){
            return sprintf("You had phone call with %s at %s for %d minutes.",
                data["name"] ? data["name"] : data["telephone"],
                moment(data["last"]).format('h:mm a'),
                Math.ceil(data["minutes"]))
        });
    var msg = commonGetFn("js/sparql/last-sms.sparql", "msgStr",
        function(data){
            return sprintf("You %s message %s %s at %s: \"%s\"",
                data["type"],
                    data["type"] == "Receive" ? "from" : "to",
                data["name"] ? data["name"] : data["telephone"],
                moment(data["last"]).format('h:mm a'),
                data["body"]
            )});

    var loc = fetchData(date, "js/sparql/last-place.sparql")
        .then(function(data){
            return new RSVP.Promise(function(resolve, reject) {
                if(data){
                    fetchAddrs(data["lat"], data["lng"])
                        .then(function(osmData){
                            resolve($.extend({}, data, osmData));
                        })
                }else{
                    resolve(undefined);
                }

            });
        })
        .then(function(data){

            return new RSVP.Promise(function(resolve, reject) {
                if(data){
                    var str = sprintf(" You were at %s til %s before you went home",
                        getPlaceName(data["address"]),
                        moment(data["end"]).format('h:mm a')
                    );
                    resolve({"locStr": str});
                }else{
                    resolve({"locStr": ""})
                }
            });

        });
    var move = fetchData(date, "js/sparql/last-travel.sparql")
        .then(function(data){
            return new RSVP.Promise(function(resolve, reject) {
                if(data) {
                    RSVP.all([fetchAddrs(data["from_lat"], data["from_lng"]),
                        fetchAddrs(data["to_lat"], data["to_lng"])])
                        .then(function (osmDataset) {
                            resolve($.extend({}, data,
                                {
                                    "fromAddr": osmDataset[0]["address"],
                                    "toAddr": osmDataset[1]["address"]
                                }))
                        });
                }else{
                    resolve(undefined);
                }
            });
        })
        .then(function(data){

            return new RSVP.Promise(function(resolve, reject) {
                if(data){
                    var str =
                        sprintf("You traveled from %s (%s) to %s (%s)",
                            getPlaceName(data["fromAddr"]),
                            moment(data["last_travel_start"]).format('h:mm a'),
                            getPlaceName(data["toAddr"]),
                            moment(data["end"]).format('h:mm a')

                        );
                    resolve({"moveStr": str});
                }else{
                    resolve({"moveStr": ""});
                }
            });
        });
    return RSVP.all([msg, loc, move, app, call, net]).then(
        function (rets){
            console.log(rets);
            return new RSVP.Promise(function(resolve, reject) {
                resolve($.extend.apply(null, rets));
            });

        }
    )

};
RSVP.on('error', function(reason) {
    console.assert(false, reason);
});
