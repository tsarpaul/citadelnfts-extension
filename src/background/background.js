import backgroundMessageRouter from "./backgroundMessageRouter";
import {twitterWatcher} from "./twitterHooks";
import * as messages from '../messages';
import {UserMetadata, UserData} from '../js/twitter/users';
import { getAwardsConfig, getUserMetadata } from "../js/api";
import { AwardsConfig } from "../js/awards";

async function UpdateUserMetadata(){
  UserMetadata.list = await getUserMetadata();
}

async function InitAwards(){
  AwardsConfig.map = await getAwardsConfig();
}

// must try to register for older verions - https://stackoverflow.com/questions/66114920/service-worker-registration-failed-chrome-extension
try {
  InitAwards();

  // Update UserList
  setInterval(UpdateUserMetadata, 60*1000);
  UpdateUserMetadata();

  // sync the UserMap with all tabs
  setInterval(() => {
    chrome.tabs.query({active: true}, (tabs) => {
        console.log('Syncing user data');
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
              ...messages.userMapSync,
              'userMap': UserData.map,
              'userList': UserMetadata.list
            },
          );
        });
      }
    );
  }, 200);

  // Download relevant info when required
  chrome.tabs.onUpdated.addListener(twitterWatcher);

  chrome.runtime.onMessage.addListener(backgroundMessageRouter);

  // ON OFF toggle
  //chrome.action.onClicked.addListener(iconClickHandler);
} catch (error) {
  console.log('Error registering worker: ', error);
}

console.log("Started");
