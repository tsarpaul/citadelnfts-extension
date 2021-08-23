import {rollbackUsernameMarks, setTwitterMarkTick} from './mark-usernames';
import {setTwitterUserActionsWatcherTick, watchUserActionsCleanup} from './watch-user-actions';
import {galleryCleanup, setProfilePageWatcher} from './gallery';

export function twitterInit() {
  setTwitterMarkTick();
  setTwitterUserActionsWatcherTick();
  setProfilePageWatcher();
}

export function twitterDestroy() {
  rollbackUsernameMarks();
  galleryCleanup();
  watchUserActionsCleanup();
}

