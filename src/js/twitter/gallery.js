import {
  ACTIVE_TAB_BOTTOM_LINE_CLASSES,
  ACTIVE_TAB_CONTAINER_CLASSES,
  INACTIVE_TAB_BOTTOM_LINE_CLASSES,
  INACTIVE_TAB_CONTAINER_CLASSES,
  NFT_BUTTON_ID,
  NFT_BUTTON_INNER_TEXT,
  NFT_GALLERY_ID, TWITTER_MODALS_ROOT_ID,
  TWITTER_SELECTORS,
} from './constants';
import {
  getCurrentThemeColor, getGalleryContainer,
  getImportantTextColor,
  getTwitterTabButtonMarkupWrap,
  getUsernameFromTwitterUrl,
  getUtilityTextColor
} from '../utils/twitter';
import {UserData, UserMetadata} from './users';
import * as messages from '../../messages';
import { ERRLOG } from '../utils/log';

let PROFILE_WATCHER_INTERVAL;

function getNftGallery(){
  return document.getElementById(NFT_GALLERY_ID);
}

function getNftButton(){
      return document.getElementById(NFT_BUTTON_ID);
}

function _profilePageWatcher() {
  const nftGalleryContainer = getNftGallery();
  const nftGalleryButton = getNftButton();
  const twitterName = getUsernameFromTwitterUrl(location.href);
  // TODO: User doesnt exist bug
  const userExists = UserMetadata.userExists(twitterName);
  const userDataExists = UserData.userExists(twitterName);
  if(userExists && !userDataExists) {
    console.log('User exists but no data available yet');
  }

  if((!nftGalleryContainer || !nftGalleryButton) && userDataExists) {
    // Init NFT Gallery
    chrome.runtime.sendMessage({
      ...messages.galleryRequest,
      twitterName
    }, initNftGallery);
  }
}


function profilePageWatcher() {
  try{
    _profilePageWatcher()
  } catch (ex){
    ERRLOG(ex);
  }
}

function setProfilePageWatcher() {
  // Infer from the URL the website's state
  setTimeout(() => {
    PROFILE_WATCHER_INTERVAL = PROFILE_WATCHER_INTERVAL || setInterval(profilePageWatcher), 250;
  }, 2500);
}

function resetGalleryWatcherInterval() {
  clearInterval(PROFILE_WATCHER_INTERVAL);
  PROFILE_WATCHER_INTERVAL = undefined;
}

function initNftGallery({twitterName, galleryMarkup}) {
  console.log(`Trying to initialize NFT gallery for ${twitterName}`);

  const isMainProfilePage = document.querySelector(TWITTER_SELECTORS.PROFILE_NAVBAR_SELECTOR);
  if (isMainProfilePage) {
    if(!getNftButton()) {
      addNftGalleryButton();
    }
    if(!getNftGallery()){
      addNftGallery({galleryMarkup});
    }

    setTabButtonHandlers();
  }
}

function addNftGalleryButton() {
  // add a button to make Gallery appear
  const twitterTabButton = document.querySelector(TWITTER_SELECTORS.PROFILE_PAGE_TAB_BUTTON);
  const nftTabButton = twitterTabButton.cloneNode(false);
  nftTabButton.innerHTML = getTwitterTabButtonMarkupWrap({innerText: NFT_BUTTON_INNER_TEXT});
  nftTabButton.style.color = getUtilityTextColor();
  nftTabButton.id = NFT_BUTTON_ID;

  twitterTabButton.parentNode.appendChild(nftTabButton);
}

function addNftGallery({galleryMarkup}) {
  if(galleryMarkup) {
     try {
       // add gallery container and content
       const pageContentContainer = getGalleryContainer();
       const nftGalleryContainer = pageContentContainer.cloneNode(false);
       nftGalleryContainer.id = NFT_GALLERY_ID;
       nftGalleryContainer.style.display = 'none';
       nftGalleryContainer.style.color = getImportantTextColor(); // should be here to make colors responsive
       nftGalleryContainer.innerHTML = galleryMarkup;

       const profileNavEl = document.querySelector("nav[aria-label='Profile timelines']");
       const galleryContainer = profileNavEl.parentNode;
       galleryContainer.appendChild(nftGalleryContainer);

       // pageContentContainer.parentNode.appendChild(nftGalleryContainer);
     } catch(error) {
       console.log('Error while mounting new gallery.');
       console.error(error);
     }
  } else {
    console.error('No gallery data provided at addNftGallery');
  }
}

function tabButtonClickHandler(event) {
  const nftGalleryButton = document.getElementById(NFT_BUTTON_ID);
  const isNftGalleryButton = nftGalleryButton && (nftGalleryButton === event.target || nftGalleryButton.contains(event.target));

  const twitterTabButtons = document.querySelectorAll(TWITTER_SELECTORS.PROFILE_PAGE_TAB_BUTTON);
  twitterTabButtons.forEach(button => {
    const shouldActivate = button === event.target || button.contains(event.target);
    const textContainer = button.firstElementChild.firstElementChild;
    const bottomHighlight = textContainer.lastElementChild;

    textContainer.style.color = shouldActivate ? getCurrentThemeColor() : getUtilityTextColor();
    textContainer.className = shouldActivate ? ACTIVE_TAB_CONTAINER_CLASSES : INACTIVE_TAB_CONTAINER_CLASSES;
    bottomHighlight.className = shouldActivate ? ACTIVE_TAB_BOTTOM_LINE_CLASSES: INACTIVE_TAB_BOTTOM_LINE_CLASSES;
  });
  
  setNftGalleryVisibility(isNftGalleryButton);
}

function setTabButtonHandlers() {
  const twitterTabButtons = document.querySelectorAll(TWITTER_SELECTORS.PROFILE_PAGE_TAB_BUTTON);
  twitterTabButtons.forEach(button => button.addEventListener('click', tabButtonClickHandler, true));
}

export function removeTabButtonHandlers() {
  const twitterTabButtons = document.querySelectorAll(TWITTER_SELECTORS.PROFILE_PAGE_TAB_BUTTON);
  twitterTabButtons.forEach(button => button.removeEventListener('click', tabButtonClickHandler));
}

export function setNftGalleryVisibility(showGallery) {
  let nftGalleryContainer = document.getElementById(NFT_GALLERY_ID);

  if(!nftGalleryContainer) {
    chrome.runtime.sendMessage({
      ...messages.galleryRequest,
      twitterName: getUsernameFromTwitterUrl(location.href)
    }, addNftGallery);
  } else {
    nftGalleryContainer = document.getElementById(NFT_GALLERY_ID);
    nftGalleryContainer.style.display = showGallery ? 'flex' : 'none';
  }

  const pageContentContainer = getGalleryContainer();
  if (pageContentContainer) {
    pageContentContainer.style.display = showGallery ? 'none' : 'flex';
  }
}

export function removeNftGallery() {
  try {
    // remove button in tab list
    const nftTabButton = document.getElementById(NFT_BUTTON_ID);
    nftTabButton && nftTabButton.remove();

    // remove gallery container and content
    const nftGalleryContainer = document.getElementById(NFT_GALLERY_ID);
    nftGalleryContainer && nftGalleryContainer.remove();
  } catch(error) {
    console.error('Error at removeNftGallery. Maybe, you\'re trying to remove it when there\'s no gallery to remove.');
    console.error(error);
  }
}

function galleryCleanup() {
  resetGalleryWatcherInterval();
  setNftGalleryVisibility(false);
  removeTabButtonHandlers();
  removeNftGallery();
}

export {
  setProfilePageWatcher,
  galleryCleanup,
};
