import { CITADEL_MAIN_USER_ID, TWITTER_FONT_CLASS, CITADEL_USER_CLASS, DESTROY_ON_UPDATE, DO_NOT_TOUCH, TOTAL_VALUE_1, TOTAL_VALUE_2, TOTAL_VALUE_3, TOTAL_VALUE_4, TOTAL_VALUE_5, TWITTER_MODALS_ROOT_ID } from './constants';
import { checkIfTwitterUsername, isInTweetField} from '../utils/twitter';
import { getProfileHeaderUsernameElement } from './selectors';
import { UserMetadata, getClassByRank } from './users';
import { AwardsConfig } from '../awards';
import { ERRLOG } from '../utils/log';

let TWITTER_MARK_INTERVAL;

export function setTwitterMarkTick() {
  clearTwitterMarkTick();
  TWITTER_MARK_INTERVAL = setInterval(addCitadelMarksToTwitter, 250);
}

export function clearTwitterMarkTick() {
  clearInterval(TWITTER_MARK_INTERVAL);
}

export function addCitadelMark(node){
  const username = node.innerText.slice(1);
  const user = UserMetadata.list[username];

  if (user && !node.classList.contains(DO_NOT_TOUCH)) {
    const citadelContainer = document.createElement('span');
    let class_ = getClassByRank(user['rank']);

    node.classList.add(class_);
    node.dataset.originalContent = node.innerHTML;
    citadelContainer.innerHTML += getCitadelImg();
    citadelContainer.innerHTML += getAwardImgs(username);
    node.classList.add(DO_NOT_TOUCH);
    node.append(citadelContainer);
  }
}

function rollbackCitadelClasses(node){
  // TODO Put these classes in a list
  node.classList.remove(DO_NOT_TOUCH);
  node.classList.remove(CITADEL_USER_CLASS);
  node.classList.remove(TOTAL_VALUE_1);
  node.classList.remove(TOTAL_VALUE_2);
  node.classList.remove(TOTAL_VALUE_3);
  node.classList.remove(TOTAL_VALUE_4);
  node.classList.remove(TOTAL_VALUE_5);
}

// TODO: Move this somewhere else, also dup func in gallery.js
const citadelIcon = chrome.runtime.getURL('assets/img/48x48.png');
function getCitadelImg() {
  return `<img style="width: 14px; height: 14px; margin: 0 4px;" src="${citadelIcon}" alt="CitadelNFT" title="This user is part of the Citadel"/>`;
}

function getAwardImgs(username) {
  let markup = '';
  let awardsConfig = AwardsConfig.map;
  let awards = UserMetadata.list[username]['awards'];
  awards.forEach(award => {
    let config = awardsConfig[award];
    if(!config){
      return;
    }
    markup += `<img style="width: 14px; height: 14px; margin: 0 1px;" src="${config['icon_url']}" alt="${config['machine_name']}" title="${config['icon_alt']}">`
  });
  return markup;
}

function addMainUserCitadelIcon(mainUsernameNode){
  let node = mainUsernameNode.parentNode;
  const citadelContainer = document.createElement('span');

  citadelContainer.innerHTML += getCitadelImg();
  citadelContainer.classList.add(DESTROY_ON_UPDATE);
  node.append(citadelContainer);
}

function AddCitadelAwardsIcons(mainUsernameNode, username){
  let node = mainUsernameNode.parentNode;
  const citadelContainer = document.createElement('span');

  citadelContainer.innerHTML += getAwardImgs(username);
  citadelContainer.classList.add(DESTROY_ON_UPDATE);
  node.append(citadelContainer);
}

function isMainUserNode(node){
  return node.id == CITADEL_MAIN_USER_ID;
}

export function addCitadelMarksToTwitter(){
  try{
    _addCitadelMarksToTwitter();
  } catch (ex){
    ERRLOG(ex);
  }
}

function _addCitadelMarksToTwitter() {
  const modalLayer = document.getElementById(TWITTER_MODALS_ROOT_ID);

  const currentProfile = location.pathname.split('/')[1];

  const mainUsernameNode = getProfileHeaderUsernameElement();
  if (mainUsernameNode){
    // Modify main profile username elem
    if(!mainUsernameNode.classList.contains(DO_NOT_TOUCH) && 
      UserMetadata.userExists(currentProfile)) {
      let user = UserMetadata.list[currentProfile];

      mainUsernameNode.id = CITADEL_MAIN_USER_ID;
      let class_ = getClassByRank(user['rank']);
      mainUsernameNode.classList.add(class_);
      addMainUserCitadelIcon(mainUsernameNode);
      AddCitadelAwardsIcons(mainUsernameNode, currentProfile);
    }
  }
  mainUsernameNode && mainUsernameNode.classList.add(DO_NOT_TOUCH); // do not touch header nickname any way
  

  // Modify all other users on page
  const usernameElemsCollection = Array.from(document.getElementsByTagName('span'))
    .filter(node => checkIfTwitterUsername(node) && !modalLayer.contains(node) && !isInTweetField(node) && !isMainUserNode(node));
  usernameElemsCollection.forEach(addCitadelMark);
}

export function rollbackUsernameMarks() {
  clearTwitterMarkTick();

  rollbackMainUsernameModifications();
  // TODO: Move this somewhere else
  deleteMarkedModifications();

  const userElements = Array.from(document.querySelectorAll(`.${CITADEL_USER_CLASS}`));
  userElements.forEach(rollbackUserModifications);
}

function deleteMarkedModifications(){
  const destroyElements = Array.from(document.querySelectorAll(`.${DESTROY_ON_UPDATE}`));
  destroyElements.forEach((node)=>node.remove());
}

function rollbackMainUsernameModifications() {
  const mainUserElement = document.querySelectorAll(`#${CITADEL_MAIN_USER_ID}`)[0];
  if(mainUserElement){
    rollbackCitadelClasses(mainUserElement);
  }
}

export function rollbackUserModifications(node) {
  node.style.color = 'inherit';
  node.innerHTML = node.dataset.originalContent;
  rollbackCitadelClasses(node);
}DESTROY_ON_UPDATE