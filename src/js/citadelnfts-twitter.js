chrome.runtime.sendMessage({type: 'twitterAuth', 
  session: window.location.search.substr(1)}, function(response) {
  window.open('', '_self', '');
  window.close();
});
