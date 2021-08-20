import "../css/popup.css";
import {backendIsLoggedIn} from "../js/api.js";
import Twitter from "../background/lib/twitter.js";
import {readLocalStorage} from "../js/utils/general";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function renderText (text) {
  //content.innerText = text
  console.log(text);
}

async function backendLogin() {
  let loggedIn = await backendIsLoggedIn();
  if(!loggedIn){
    let username = await readLocalStorage('twitterUsername');
    let twitterId = await readLocalStorage('twitterId');
    chrome.runtime.sendMessage({type: 'metamaskAuth', username, twitterId});
  } else {
    renderText("You're logged in!");
  }
}

Twitter.isLoggedIn(function(twitterAuth) {
  if (!twitterAuth.oauth_token || !twitterAuth.oauth_token_secret) {
    // Once we connect to Twitter the script at api.citadelnfts will authenticate to the backend
    Twitter.authenticate();
  }
  else {
    backendLogin();
  }
});	

