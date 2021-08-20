import * as messages from '../messages';
import listeners from './listeners'

function backgroundMessageRouter(message, sender, sendResponse) {
  if (message.type !== messages.isAlive.type) {
    console.log("New message: ", message);
  }

  //TODO: deconstruct messages
  const routes = {
    [messages.galleryRequest.type]: listeners.getGalleryHtmlFor,
    [messages.statusCheck.type]: listeners.statusCheck,
    [messages.twitterAuth.type]: listeners.twitterRegister,
    [messages.metamaskAuth.type]: listeners.metamaskRegister,
    [messages.awardsConfigRequest.type]: listeners.getAwardsConfig
  };
  
  if(typeof routes[message.type] === 'function') {
    routes[message.type](message, sender, sendResponse);
  }

  return true;
}

export default backgroundMessageRouter;
