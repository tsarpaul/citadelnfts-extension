import {UserMetadata, UserData} from '../js/twitter/users';

export function userMapSync(message, sender, sendResponse) {
  UserData.map = message.userMap;
  UserMetadata.list = message.userList;
}

export function getOwnerTwitterUsername(message, sender, sendResponse) {
  let username = document.querySelector(TWITTER_SELECTORS.OWNER_USERNAME);
  sendResponse(username);
}
