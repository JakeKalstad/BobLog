var fs = require('fs');
var path = require('path');
var email = require("mailer");
var stackTrace = require("stack-trace/lib/stack-trace");
var printf = require('util').format;
function Logger (options) {
    'use strict';
    this.options = null;
    this.formatMsg = function (msg) {
        var now = new Date();
        return now.toString() + msg + "\n";
    };
    
    this.defaultOptions = function () {
        return {
            filePath : path.dirname(require.main.filename),
            fileName : "log.bob",
            file_on_error : true,
            file_on_debug : true,
            
            smtp : false,
            smtp_ssl : true,
            smtp_host : undefined,
            smtp_port : 465,
            smtp_domain : "[127.0.0.1]",
            smtp_auth : 'login',
            smtp_username : undefined,
            smtp_password : undefined,
            smtp_recipients : undefined,
            smtp_reply_to : undefined,
            smtp_from : undefined,
            email_on_error : true,
            email_on_debug : true,
            
            debug : false
        };
    };
    
    this.formatMsgForEmail = function (msg) {
        
    };
    
    this.sendEmail = function (msg) {
        if(!this.options.smtp_recipients) {
            console.log("No SMTP recipients defined, no emails are being sent...");
            return;
        }
        if(this.options.smtp_host) {
            console.log("No SMTP host defined, no emails are being sent...");
            return;
        }
        var recipients = this.options.smtp_recipients.split(',');
        recipients.map(function (recpAddy) {
            email.send({
                ssl: this.options.smtp_ssl,
                host : this.options.smtp_host,
                port : this.options.smtp_port,
                domain : this.options.smtp_domain,
                to : recpAddy,
                from : this.options.smtp_from,
                subject : "BobLog - Log",
                reply_to : this.options.smtp_reply_to,
                body: this.formatMsgForEmail(msg),
                authentication : this.options.smtp_auth,
                username : this.options.smtp_username,
                password : this.options.smtp_password,
                debug: this.options.debug
            },
            function(err, result){
                if(err){ console.log(err); }
            });   
        });
    };
    
    this.writeToFile = function (msg) {
        fs.appendFile(this.options.filePath + "/" + this.options.fileName, msg, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    
    this.Log = function (msg, isError) {
        msg = this.formatMsg(msg);
        if(!this.options) {
            this.options = this.defaultOptions();
        } 
        if(isError) {
            if(this.options.file_on_error) {
                this.writeToFile("Error: " + msg);    
            }
            if(this.options.email_on_error) {
                this.sendEmail(msg);   
            }
        } else { 
            if(this.options.file_on_debug) {
                this.writeToFile("Debug: " + msg);    
            }
            if(this.options.email_on_debug) {
                this.sendEmail(msg);   
            } 
        }
        console.log(msg);
    };
}

var Log = (function () {
    'use strict';
    var logger;
    return {
        Get : function (options) {
            if (!logger) {
                logger = new Logger();
            }
            if(options) {
                logger.options = options;   
            }
            return logger;
        }
    };
}());

module.exports = { 
    error : function(msg) {
         'use strict';
        var thistrace = stackTrace.get(); 
        var parent_name = thistrace[1].getFunctionName(); 
        var parent_eval = thistrace[1].getEvalOrigin(); 
        Log.Get().Log(printf("[%s][%s]: %s", parent_eval, parent_name, msg), true);
    },
    debug : function(msg) {
         'use strict';
        var thistrace = stackTrace.get(); 
        var parent_name = thistrace[1].getFunctionName(); 
        var parent_eval = thistrace[1].getEvalOrigin(); 
        Log.Get().Log(printf("[%s][%s]: %s", parent_eval, parent_name, msg));
    },
    configure : function (options) {
        'use strict';
        Log.Get(options);
    }
};