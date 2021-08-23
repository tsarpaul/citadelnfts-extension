import {IS_DEV} from "../../env.app.constants";

export function DEVLOG(msg){
    IS_DEV && console.log(msg);
}

function getStackTrace() {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
  };

function logErr(ex){
    console.log("Caught exception: ");
    console.error(ex);  
}

// We want to log errors only once per minute to avoid spam due to running intervals
// ERR:DATE map
var ERR_MAP = {};
var ERR_MAP_RETENTION = 60*1000;
export function ERRLOG(ex){
    let err = getStackTrace();
    if(IS_DEV){
        logErr(ex);
        return;
    }

    let time = Date.now();
    // if the error already appeared check for the time
    if(ERR_MAP[err]){
        if (ERR_MAP[err] - time > ERR_MAP_RETENTION) {
            ERR_MAP[err] = time;
            logErr(ex);       
        }
        return;
    }
    else {
        ERR_MAP[err] = time;
        logErr(ex);
    }
}