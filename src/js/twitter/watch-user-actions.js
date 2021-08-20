import {rollbackUsernameMarks, setTwitterMarkTick} from './mark-usernames';
import {TWITTER_SELECTORS} from './constants';
import {removeNftGallery, removeTabButtonHandlers} from './gallery';

let TWITTER_USER_ACTIONS_WATCH_INTERVAL;

export function setTwitterUserActionsWatcherTick() {
  TWITTER_USER_ACTIONS_WATCH_INTERVAL = setInterval(unreactedUserActionsWatcher, 200);
}

export function clearTwitterUserActionsWatcherTick() {
  clearInterval(TWITTER_USER_ACTIONS_WATCH_INTERVAL);
}

export function watchUserActionsCleanup() {
  clearTwitterUserActionsWatcherTick();
}

function unreactedUserActionsWatcher() {
  updateToProfileChanged();
}

let lastOpenedProfile = location.pathname.split('/')[1];
function updateToProfileChanged() {
  /** Reset the state once profile is changed */
  const currentProfile = location.pathname.split('/')[1];
  if(currentProfile !== lastOpenedProfile) { // profile changed
    // reset to Tweets tab
    const firstTabElem = document.querySelector(TWITTER_SELECTORS.PROFILE_PAGE_TAB_BUTTON);
    firstTabElem && firstTabElem.click();

    // Clean up UI edits
    try {
      rollbackUsernameMarks();
      setTwitterMarkTick();
    } catch(error) {
      console.error('Error while reiniting marks to a new profile:');
      console.error(error);
    }

    removeTabButtonHandlers();
    removeNftGallery();
  }

  lastOpenedProfile = location.pathname.split('/')[1];
}
