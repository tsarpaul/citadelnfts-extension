import OAuth from './oAuth';

var API_URL = 'https://api.twitter.com/';
var consumer_key = 'yVJKx7Y4gQqfmijTCT6iQ5z8z';
var consumer_secret = 'B65aCyrisC6KVkGnQCSoCXBdmNKkYJodVRr8x9H8O1nIp990AI';
var Twitter = {
  oauth_token: null,
  oauth_token_secret: '',
  authenticate: function() {
    Twitter.oauth_token_secret = '';
    Twitter.oauth_token = null;

    this.api('oauth/request_token', 'POST', (response) => {
      response.text().then((text)=>{;
        var des = Twitter.deparam(text);
        Twitter.oauth_token_secret = des.oauth_token_secret;
        Twitter.oauth_token = des.oauth_token;
        var url = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + Twitter.oauth_token;
        window.open(url);
      });
    });
  },
  logout: function() {
    chrome.storage.local.remove(['oauth_token', 'oauth_token_secret']);
    Twitter.oauth_token = false;
    Twitter.oauth_token_secret = false;
    //chrome.browserAction.setBadgeText({text: ''});
  },
  isLoggedIn: function(cb) {
    chrome.storage.local.get(['oauth_token', 'oauth_token_secret'], cb);
  },
  setOAuthTokens: function(tokens, cb) {
    Twitter.oauth_token = tokens.oauth_token;
    Twitter.oauth_token_secret = tokens.oauth_token_secret;
    chrome.storage.local.set({ 'oauth_token': tokens.oauth_token, 'oauth_token_secret': tokens.oauth_token_secret }, cb);
  },
  getOAuthTokens: function(){
    return [Twitter.oauth_token, Twitter.oauth_token_secret];
  },
  api: function(path /* params obj, callback fn */) {
    var args = Array.prototype.slice.call(arguments, 1),
        fn = false,
        params = {},
        method = 'GET';

    /* Parse arguments to their appropriate position */
    for(var i in args) {
      switch(typeof args[i]) {
        case 'function':
          fn = args[i];
        break;
        case 'object':
          params = args[i];
        break;
        case 'string':
          method = args[i].toUpperCase();
        break;
      }
    }

    /* Add an oauth token if it is an api request */
    if(!params.oauth_token){
      Twitter.oauth_token && (params.oauth_token = Twitter.oauth_token);
    }

    /* Add a 1.1 and .json if its not an authentication request */
    (!path.match(/oauth/)) && (path = '1.1/' + path + '.json');

    var accessor = {consumerSecret: consumer_secret, tokenSecret: Twitter.oauth_token_secret},
      message = {
        action: API_URL + path,
        method: method,
        parameters: [['oauth_consumer_key', consumer_key], ['oauth_signature_method', 'HMAC-SHA1']]
      };

    for(const [k, v] of Object.entries(params)){
      OAuth.setParameter(message, k, v);
    };

    OAuth.completeRequest(message, accessor);

    var p = [];
    
    let oAuthParams = OAuth.getParameterMap(message.parameters);
    for(const [k, v] of Object.entries(oAuthParams)) {
      p.push(k + '=' + OAuth.percentEncode(v));
    };

    fetch(API_URL + path, {method: method, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: p.join('&')}).then((res) => { 
  if(!res.ok && res) {
    let clone = res.clone();
    res.json().then((data) => {
      if(data['errors'][0]['code'] == 89){
        Twitter.authenticate();
      }
    }).catch((err)=>{
      console.log("JSON decode error");
      console.log(clone.text().then(res=>console.log(res)));
    });
    //res.responseText && res.responseText.match(/89/)
  }
  else { fn(res); }
});
  },
  deparam: function(params) {
    var obj = {};
    let split = params.split('&');
    split.forEach((elem) => {
      var item = elem.split('=');
      obj[item[0]] = item[1];
    });
    return obj;
  }
};

export default Twitter;
