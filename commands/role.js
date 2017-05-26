var botFuncs = require('../bot.js')



module.exports = function (args, user, userID, channelID, bot) {

    var serverID = bot.channels[channelID].guild_id; // grab server id
    if (!args) {

        botFuncs.sendMsg(channelID, "Please specify a HEX color or select a role:\nDruid\nDeath Knight\nDemon Hunter\nHunter\nMage\nMonk\nPaladin\nPriest\nShaman\nRogue\nWarlock\nWarrior")
        return
    }

    args = args.split(" ")
    // check for valid role, return string
    if (args[0] == "remove" && args.length === 2) {
        var vRole = validateRole(args[1].toLowerCase()); // check for valid role, return string
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole);

        botFuncs.log("Removing role: " + vRole + " from " + user);
        bot.removeFromRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole.id });
        botFuncs.sendMsg(channelID, "Removing role: " + vRole + " from " + user)
        return
    } else if (args[0] == "remove" && args.length === 3) {
        var vRole = validateRole(args[1].toLowerCase()); // check for valid role, return string
        var vRole2 = validateRole(args[2].toLowerCase()); // check for valid role, return string
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole);
        var selectedRole2 = searchRoles(bot.servers[serverID].roles, vRole2);

        botFuncs.log("Removing role: " + vRole + " from " + user);
        botFuncs.log("Removing role: " + vRole2 + " from " + user);
        bot.removeFromRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole.id });
        bot.removeFromRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole2.id });
        botFuncs.sendMsg(channelID, "Removing role: " + vRole + " and " + vRole2 + " from " + user)
        return
    }

    var vRole = validateRole(args[0].toLowerCase());
    var vRole2 = validateRole(args[1])
    //var vRole2 = validateRole(args[1])
    if (args[1]) {
        
        if (args[0].toLowerCase() === 'demon' || args[0].toLowerCase() === 'death') {
            if (args[1] === 'Knight') {
                vRole = validateRole('dk')
            } else {
                vRole = validateRole('dh')
            }
            if (args[2]) {
                var vRole2 = validateRole(args[2].toLowerCase())
            }
        }
        //var vRole2 = validateRole(args[1].toLowerCase())

    }
    if (vRole && vRole2) {
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole.toLowerCase()); // validate role exists on server; return role Object
        var selectedRole2 = searchRoles(bot.servers[serverID].roles, vRole2.toLowerCase()); // validate role exists on server; return role Object
        if (selectedRole && selectedRole2) {
            botFuncs.log("Adding role: " + vRole + " and " + vRole2 + " to " + user);
            bot.addToRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole.id });
            bot.addToRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole2.id });
            botFuncs.sendMsg(channelID, "Adding role: " + vRole + " and " + vRole2 + " to " + user)
        }
    } else if (vRole || vRole2) {
        if (vRole) {
            var selectedRole = searchRoles(bot.servers[serverID].roles, vRole); // validate role exists on server; return role Object
            if (selectedRole) {
                botFuncs.log("Adding role: " + vRole + " to " + user);
                bot.addToRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole.id.toLowerCase() });
                botFuncs.sendMsg(channelID, "Adding role: " + vRole + " to " + user)
            }
        } else if (vRole2) {
            var selectedRole = searchRoles(bot.servers[serverID].roles, vRole2.toLowerCase()); // validate role exists on server; return role Object
            if (selectedRole) {
                botFuncs.log("Adding role: " + vRole + " to " + user);
                bot.addToRole({ "serverID": serverID, "userID": userID, "roleID": selectedRole.id.toLowerCase() });
                botFuncs.sendMsg(channelID, "Adding role: " + vRole + " to " + user)
            }
        }
        // else {
        //     var selectedRole = searchRoles(bot.servers[serverID].roles, vRole2); // validate role exists on server; return role Object
        //     if (selectedRole) {
        //         botFuncs.log("Adding role: " + vRole + " to " + user);
        //         bot.addToRole({"serverID": serverID, "userID": userID, "roleID": selectedRole.id.toLowerCase()});
        //         botFuncs.sendMsg(channelID, "Adding role: "+ vRole + " to " + user)
        //     }
        // }
    } else {
        var val = args[0];
        if ((val.length === 6) || (val[0] === '#' && val.length === 7)) {
            val = val.replace(/^#/, '');
            if (!/[^0-9a-fA-F]/.test(val)) {
                // valid hex
                //botFuncs.log("valid hex");
                var hex = parseInt(val, 16);
                //botFuncs.log("giving color: "+ hex.toString(16) + " to " + user);
                botFuncs.sendMsg(channelID, "Nope, NYI");
                //bot.createRole( serverID, function(err, response) {
                //if (err) return botFuncs.log(err);
                //bot.editRole( { 
                //roleID: response.id,
                //serverID: serverID,
                //name: user,
                //color: hex,
                //position: 0
                //});
                //bot.addToRole({"serverID": serverID, "userID": userID, "roleID": response.id});
                //botFuncs.sendMsg(channelID, "Adding role: "+ hex.toString(16) + " to " + user)
                //});

                return
            } else {
                botFuncs.log("not valid hex role");
            }
        } else {
            botFuncs.log("string too short or long for hex role");
        }



        botFuncs.log(user + " input invalid role: " + args[0]);
        botFuncs.sendMsg(channelID, "Invalid role.");
    }
}


function searchRoles(serverRoles, inputRole) {
    for (var roleID in serverRoles) {
        if (serverRoles[roleID].name === inputRole) {
            return serverRoles[roleID];
        }
    }
}



function validateRole(iRole) {
    var roleList = ["druid", "death knight", "demon hunter", "hunter", "mage", "monk", "paladin", "priest", "shaman", "rogue", "warlock", "warrior", "healer", "tank", "dps"];

    switch (true) {
        case /dk|death/.test(iRole):
            iRole = "death knight";
            break;
        case /dh|demon/.test(iRole):
            iRole = "demon hunter";
            break;
        case /alpha/.test(iRole):
            iRole = "WAalpha";
            break;
    }

    for (var vRole of roleList) {
        if (vRole == iRole) {
            if (iRole == "WAalpha") { return "WAalpha"; }
            if (iRole == "dps") { return "DPS"; }
            else { return toTitleCase(vRole); }
        }
    }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
