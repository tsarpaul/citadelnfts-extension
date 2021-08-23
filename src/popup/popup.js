import "../css/popup.css";
import {backendIsLoggedIn} from "../js/api.js";
import Twitter from "../background/lib/twitter.js";
import {readLocalStorage, writeLocalStorage} from "../js/utils/general";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function renderText (text) {
  //content.innerText = text
  console.log(text);
}

async function backendLogin() {
  let username = await readLocalStorage('twitterUsername');
  let twitterId = await readLocalStorage('twitterId');
  let access_token = await readLocalStorage('twitter_access_token');
  let access_token_secret = await readLocalStorage('twitter_access_token_secret');
  chrome.runtime.sendMessage({type: 'metamaskAuth', access_token, access_token_secret, username, twitterId});
}

async function login(){
  await logout();
  Twitter.authenticate();
}

async function updateLoginBtn(){
  let loggedIn = await backendIsLoggedIn();
  let loginBtn = document.getElementById('login');
  let logoutBtn = document.getElementById('logout');

  if(loggedIn){
    loginBtn.hidden = true;
    logoutBtn.hidden = false;
  }
  else {
    logoutBtn.hidden = true;
    loginBtn.hidden = false;
  }
}

async function logout(){
  Twitter.logout();
  await writeLocalStorage({ 
    'twitterUsername': null, 'twitterId': null, 'accessToken': null, 
    'twitter_access_token': null, 'twitter_access_token_secret': null
  });
  // TODO: No guarantee logout finished
}

async function init(){
  let loginBtn = document.getElementById('login');
  let logoutBtn = document.getElementById('logout');

  loginBtn.addEventListener('click', function() {
    login();
  });
  logoutBtn.addEventListener('click', function(){
    setTimeout(logout, 100);
  })
  
  setInterval(updateLoginBtn, 100);
  updateLoginBtn();
}

init();
