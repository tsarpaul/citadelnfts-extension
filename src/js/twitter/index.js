import {rollbackUsernameMarks, setTwitterMarkTick} from './mark-usernames';
import {setTwitterUserActionsWatcherTick, watchUserActionsCleanup} from './watch-user-actions';
import {galleryCleanup, setNftGalleryWatcher} from './gallery';

export function twitterInit() {
  setTwitterMarkTick();
  setTwitterUserActionsWatcherTick();
  setNftGalleryWatcher();
}

export function twitterDestroy() {
  rollbackUsernameMarks();
  galleryCleanup();
  watchUserActionsCleanup();
}

