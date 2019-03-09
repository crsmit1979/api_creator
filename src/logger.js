const util = require("util");

const Logger = {
    log: function(msg, args) {
        if(args == undefined) console.log(msg);
        else console.log(util.format(msg, args));
    }
}


module.exports = Logger;