import {getUsernameFromTwitterUrl} from '../js/utils/twitter';
import {getUser, serializeUser} from '../js/api';
import {UserMetadata, UserData} from '../js/twitter/users';

var USER_INFO_CACHE_TIME = 60 * 60 * 1000; /* 60 mins */

async function downloadUserInfo(username){
  // TODO: Invalidate cache after some time
  let now = Date.now();
  if( UserMetadata.userExists(username) && (!UserData.userExists(username) || (now - UserData.map[username]['timestamp']) > USER_INFO_CACHE_TIME)){
    const user_ = await getUser(username);
    if(!user_ || user_.error) {
      return false;
    }
    const user = serializeUser(user_);
  
    UserData.map[username] = {user, 'timestamp': now};
  }
  return true;
}

export function twitterWatcher(tabId, changeInfo, tab) {
  try{
    if(tab.url.startsWith('https://twitter')) {
      const currentProfileUsername = getUsernameFromTwitterUrl(tab.url);
      // Update the map with the gallery
      let exists = downloadUserInfo(currentProfileUsername);
    }
  }
  catch(ex) {
    console.log("Caught exception: " + ex);
  }
}
