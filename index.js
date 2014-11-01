function Logger() {
    'use strict';
    this.options = null;
    this.Log = function (msg) {
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