var fs = require('fs');
var path = require('path');
function Logger() {
    'use strict';
    this.options = null;
    function formatMsg(msg) {
        var now = new Date();
        return now.toString() + msg + "\n";
    }
    this.Log = function (msg) {
        var locpath = path.dirname(require.main.filename) ;
        console.log(locpath );
        fs.appendFile(path.dirname(require.main.filename) + "/log.bob", formatMsg(msg), function (err) {
            if (err) {
                console.log(err);
            }
        });
        console.log(msg);
    };
}

var Log = (function () {
    'use strict';
    var logger;
    return {
        Get : function () {
            if (!logger) {
                logger = new Logger();
            }
            return logger;
        }
    };
}());

module.exports = {
    log : function (msg) {
        'use strict';
        Log.Get().Log(msg);
    },
    configure : function (options) {
        'use strict';
        Log.Get().options = options;
    }
};