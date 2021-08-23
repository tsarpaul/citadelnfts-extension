import * as messages from '../messages';
import {getGalleryMarkup} from '../js/twitter/markup/gallery';
import Twitter from './lib/twitter.js';
import {writeLocalStorage} from '../js/utils/general';
import {backendRegister, backendIsLoggedIn} from "../js/api.js";
const createMetaMaskProvider = require('metamask-extension-provider');
import {UserMetadata, UserData} from '../js/twitter/users';
import { AwardsConfig } from '../js/awards';


const stopListener = () => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, messageActions.extensionOff);
    });
  });
};

const statusCheckListener = (message, sender, sendResponse) => {
  isExtensionOn(sendResponse);
}

async function getGalleryHtmlFor(message, sender, sendResponse) {
  if(UserData.userExists(message.twitterName)) {
    const user = UserData.map[message.twitterName].user;
    //const nfts = UserMap.map[message.twitterName].user.nfts;

    message.twitterName && sendResponse({
      twitterName: message.twitterName,
      galleryMarkup: getGalleryMarkup(user),
    });
  }
  // TODO: Consider adding this as lazy loading
  // else if(UserMetadata.userExists(message.twitterName)) {
  //   downloadUserInfo(message.twitterName);
  //   sendResponse({
  //     twitterName: message.twitterName,
  //     galleryMarkup: getGalleryMarkup(user)
  //   })
  // }
}

function twitterRegister(message, sender, sendResponse) {
  sendResponse({});
  let params = Twitter.deparam(message.session);

  //Get access tokens again
  Twitter.api('oauth/access_token', 'POST', params, function(res) {
    res.text().then((data)=>{
      const params = Twitter.deparam(data);

      const username = params['screen_name']
      const twitterId = params['user_id']
      const access_token = params['oauth_token'];
      const access_token_secret = params['oauth_token_secret'];

      writeLocalStorage({
        'twitterId': twitterId, 'twitterUsername': username,
        'twitter_access_token': access_token, 'twitter_access_token_secret': access_token_secret
      });
      //chrome.storage.local.set({twitterId, 'twitterUsername': username}, function(){});

      Twitter.setOAuthTokens(Twitter.deparam(data), function(){
        _metamaskRegister(access_token, access_token_secret, twitterId, username);
      });
    });
  });
}

// TODO: Move this somewhere else
let provider = createMetaMaskProvider();
provider.on('error', (error) => {
  // Failed to connect to MetaMask, fallback logic.
  console.log(error);
});

// TODO: Move this away
let msg = "Registering to nft citadel with Twitter username: ";
async function _metamaskRegister(access_token, access_token_secret, twitterId, username){
  let accounts = await provider.request({method: 'eth_requestAccounts'});
  console.log(accounts[0]);
  let from = accounts[0];
  
  let params = [from, msg+username];
  let sig = await provider.request({method: 'personal_sign', params});

  backendRegister(username, twitterId, from, sig, access_token, access_token_secret);
}    

async function metamaskRegister(message, sender, sendResponse) {
  let twitterId = message.twitterId;
  let username = message.username;
  let access_token = message.access_token;
  let access_token_secret = message.access_token_secret;
  await _metamaskRegister(access_token, access_token_secret, twitterId, username);
}

function getAwardsConfig(message, sender, sendResponse) {
  sendResponse(AwardsConfig.map);
}

export default {
  stopListener,
  statusCheckListener,
  getGalleryHtmlFor,
  twitterRegister,
  metamaskRegister,
  getAwardsConfig
};

