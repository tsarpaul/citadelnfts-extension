import * as messages from '../messages';
import * as contentListeners from './contentListeners';

export function contentMessageRouter(message, sender, sendResponse) {
  const messageMap = {
    [messages.getOwnerTwitterUsernameRequest.type]: contentListeners.getOwnerTwitterUsername,
//    [messages.extensionOn.type]: contentListeners.appONListener,
//    [messages.extensionOff.type]: contentListeners.appOFFListener,
    [messages.userMapSync.type]: contentListeners.userMapSync,
  }

  // Add async/sync option
  if(typeof messageMap[message.type] === 'function') {
    messageMap[message.type](message, sender, sendResponse);
  }
  return true;
}

