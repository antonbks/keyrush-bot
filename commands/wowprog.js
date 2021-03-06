var botFuncs = require('../bot.js')
var http = require('https');
var request = require('request')
var cheerio = require('cheerio')
var rankTable = {}

// require("jsdom").env("", function(err, window) {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     var $ = require("jquery")(window);
// });


module.exports = function (args, user, userID, channelID, bot) {

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    console.log(args)
    if (args === 'rankings') {
        var sortable = [];
        var sortedString = ''
        var keysSorted = Object.keys(rankTable).sort(function (a, b) { return rankTable[b] - rankTable[a] })
        // var keysSortedArray = keysSorted.split(",")
        for (i = 0; i < 10; i++) {
            sortedString += (i+1) + ') ' + keysSorted[i] + ' : ' + rankTable[keysSorted[i]] + ' score' + '\n'
            //console.log(keysSorted[i])
            //console.log(rankTable[keysSorted[i]])
        }
        //console.log(keysSorted)
        bot.sendMessage({
            to: channelID,
            message: sortedString
        })
    } else {
        argsArray = args.split(" ")
        var api = "https://www.wowprogress.com/character/eu/" + argsArray[1] + "/" + encodeURIComponent(argsArray[0]) + "/json_rank"

        console.log(api)

        var options = {
            url: api,
            headers: {
                'Accept': 'application/json'
            }
        };
        function callback(error, response, body) {
            //console.log(error)
            //console.log($($.parseHTML(body)).find(".gearscore"))
            var $ = cheerio.load(body)
            var keyscore = $.html($(".gearscore")['3'])
            var ilvl = $.html($(".gearscore")['0'])
            //var otherData1 = $.html($(".gearscore")['1'])
            var otherData2 = $.html($(".gearscore")['2'])
            keyscore = keyscore.replace(/<(?:.|\n)*?>/gm, '');
            ilvl = ilvl.replace(/<(?:.|\n)*?>/gm, '');
            //otherData1 = otherData1.replace(/<(?:.|\n)*?>/gm, '');
            otherData2 = otherData2.replace(/<(?:.|\n)*?>/gm, '');
            console.log(keyscore)
            if (otherData2.indexOf('dps error') >= 0) {
                otherData2 = otherData2.substring(0, otherData2.indexOf('dps error'))
            } else {
                var temp1 = keyscore
                var temp2 = otherData2
                keyscore = temp2
                otherData2 = "SimDPS: Unavailable for Healer/Tank"
            }

            scoreIndex = keyscore.match(/\d/)
            rankTable[capitalize(argsArray[0])] = parseInt(keyscore.substring(keyscore.indexOf(scoreIndex)))

            console.log(rankTable)


            bot.sendMessage({
                to: channelID,
                message: keyscore + '\n' + ilvl + '\n' + otherData2
            })
        }

        request(options, callback)
    }

}