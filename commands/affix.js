var botFuncs = require('../bot.js')
var http = require('https');
var request = require('request')
var cheerio = require('cheerio')


module.exports = function (args, user, userID, channelID, bot) {

        var api = "https://mythicpl.us/#this_week"

        console.log(api)

        var options = {
            url: api,
            headers: {
                'Accept': 'application/json'
            }
        };
        function callback(error, response, body) {
            //console.log(error)
            //console.log($($.parseHTML(body)).find("#thisweekeu"))
            var $ = cheerio.load(body)
            var keyscore = $.html($(".title--large").contents())
            //var keyscore2 = $.html($("#thisweekeu"))
            console.log(keyscore)
            //console.log(keyscore2)
            //var otherData1 = $.html($(".gearscore")['1'])
            //var otherData2 = $.html($(".gearscore")['2'])
            //keyscore = keyscore.replace(/<(?:.|\n)*?>/gm, '');
            //ilvl = ilvl.replace(/<(?:.|\n)*?>/gm, '');

            bot.sendMessage({
                to: channelID,
                message: keyscore //+ '\n' + ilvl + '\n' + otherData2
            })
        }

        request(options, callback)

}