import { CITADEL_MAIN_USER_ID, CITADEL_USER_CLASS, DESTROY_ON_UPDATE, DO_NOT_TOUCH, TOTAL_VALUE_1, TOTAL_VALUE_2, TOTAL_VALUE_3, TOTAL_VALUE_4, TOTAL_VALUE_5, TWITTER_MODALS_ROOT_ID } from './constants';
import { checkIfTwitterUsername, isInTweetField} from '../utils/twitter';
import { getProfileHeaderUsernameElement } from './selectors';
import { UserMetadata, getClassByRank } from './users';

let TWITTER_MARK_INTERVAL;

export function setTwitterMarkTick() {
  clearTwitterMarkTick();
  TWITTER_MARK_INTERVAL = setInterval(parseAndMarkUsernames, 50);
  console.log('interval activated');
}

export function clearTwitterMarkTick() {
  clearInterval(TWITTER_MARK_INTERVAL);
}

export function addCitadelMark(node){
  const username = node.innerText.slice(1);
  const user = UserMetadata.list[username];

  if (user && !node.classList.contains(DO_NOT_TOUCH)) {
    let class_ = getClassByRank(user['rank']);

    node.classList.add(class_);
    node.dataset.originalContent = node.innerHTML;
    node.innerHTML += getCitadelImg();
    node.classList.add(DO_NOT_TOUCH);
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
  return `<img style="width: 15px; height: 15px; margin: 0 4px;" src="${citadelIcon}" alt="CitadelNFT"/>`;
}

function addMainUserCitadelIcon(mainUsernameNode){
  let node = mainUsernameNode.parentNode.parentNode;
  if (!node.innerHTML.includes(DESTROY_ON_UPDATE)){
    node.innerHTML += `<span class="${DESTROY_ON_UPDATE}">${getCitadelImg()}</span>`;
  }
}

function isMainUserNode(node){
  return node.id == CITADEL_MAIN_USER_ID;
}

export function parseAndMarkUsernames() {
  const modalLayer = document.getElementById(TWITTER_MODALS_ROOT_ID);

  const currentProfile = location.pathname.split('/')[1];

  // Modify main profile username elem
  const mainUsernameNode = getProfileHeaderUsernameElement();
  if (mainUsernameNode && 
    !mainUsernameNode.classList.contains(DO_NOT_TOUCH) && 
    UserMetadata.userExists(currentProfile)) {
    let user = UserMetadata.list[currentProfile];

    mainUsernameNode.id = CITADEL_MAIN_USER_ID;
    let class_ = getClassByRank(user['rank']);
    mainUsernameNode.classList.add(class_);
    //addMainUserCitadelIcon(mainUsernameNode);
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
}