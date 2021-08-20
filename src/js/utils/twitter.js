import {
  BLACK_COLOR,
  TWITTER_MODALS_ROOT_ID,
  TWITTER_SELECTORS,
  WHITE_COLOR
} from '../twitter/constants';

function getTextColorFromSelector(selector) {
  return getComputedStyle(document.querySelector(selector) || document.body).color;
}

export function classnamesStringToSelector(classnames) {
  return `.${classnames.split(' ').join(', .')}`;
}

const DEFAULT_GRAY_COLOUR = 'rgb(136, 153, 166)';

export function getUtilityTextColor() {
  const textColor = getTextColorFromSelector(TWITTER_SELECTORS.UTILITY_TEXT_NODES);
  return !textColor.startsWith(BLACK_COLOR) ? textColor : DEFAULT_GRAY_COLOUR;
}

export function getImportantTextColor() {
  const textColor = getTextColorFromSelector(TWITTER_SELECTORS.IMPORTANT_TEXT_NODES);
  return !textColor.startsWith(BLACK_COLOR) ? textColor : DEFAULT_GRAY_COLOUR;
}

export function getCurrentThemeColor() {
  const textColor = getTextColorFromSelector(TWITTER_SELECTORS.CURRENT_COLOR_THEME_TEXT);
  return !textColor.startsWith(BLACK_COLOR) ? textColor : DEFAULT_GRAY_COLOUR;
}

export function getTotalValueColor() {
  
}

export function getGalleryContainer() {
  const modalLayer = document.getElementById(TWITTER_MODALS_ROOT_ID);
  const pageContentContainer = Array.from(document.querySelectorAll(TWITTER_SELECTORS.TAB_CONTENT_BLOCK))
    .filter(node => !modalLayer.contains(node))[0];
  return pageContentContainer;
}

export function isInTweetField(node) {
  const tweetFields = Array.from(document.querySelectorAll(TWITTER_SELECTORS.TWEET_EDITOR));
  return tweetFields.some(tweetField => tweetField.contains(node));
}
const citadelIcon = chrome.runtime.getURL('assets/img/48x48.png');
function getCitadelImg() {
  return `<img style="width: 12px; height: 12px; margin: 0 4px; display:inline" src="${citadelIcon}" alt="CitadelNFT"/>`;
}

export function getTwitterTabButtonMarkupWrap({innerText, active}) {
  const textWrapperClassname = 'css-4rbku5 css-18t94o4 css-1dbjc4n r-1awozwy r-1loqt21 r-6koalj r-eqz5dr r-16y2uox r-1h3ijdo r-1777fci r-s8bhmr r-1ny4l3l r-1qhn6m8 r-i023vh r-o7ynqc r-6416eg';
  const wrapperAttributes = `aria-selected="${!!active}" role="tab" ${active ? '' : 'tabindex="-1"'} class="${textWrapperClassname}"`;

  const textActiveClassname = 'css-901oao r-13gxpu9 r-6koalj r-eqz5dr r-1qd0xha r-a023e6 r-b88u0q r-1pi2tsx r-rjixqe r-bcqeeo r-1l7z4oj r-95jzfe r-bnwqim r-qvutc0';
  const textInactiveClassname = 'css-901oao r-9ilb82 r-6koalj r-eqz5dr r-1qd0xha r-a023e6 r-b88u0q r-1pi2tsx r-rjixqe r-bcqeeo r-1l7z4oj r-95jzfe r-bnwqim r-qvutc0';
  const textClassname = active ? textActiveClassname : textInactiveClassname;
  const textAttributes = `dir="auto" class="${textClassname}"`;

  const bottomLineElem = `<div class="${
    active
      ? 'css-1dbjc4n r-1kihuf0 r-urgr8i r-sdzlij r-1p0dtai r-xoduu5 r-hdaws3 r-s8bhmr r-u8s1d r-13qz1uu'
      : 'css-1dbjc4n r-xoduu5'
  }"></div>`;

  return `<a ${wrapperAttributes}><div ${textAttributes}><span>${innerText}${getCitadelImg()}</span>${bottomLineElem}</div></a>`;
}

export function getOwnerTwitterUsername() {
  const selector = TWITTER_SELECTORS.OWNER_USERNAME;
  return document.querySelector(selector);
}

export function getUsernameFromTwitterUrl(url) {
  const twitterBase = 'https://twitter.com/';

  return url.slice(twitterBase.length).split('/')[0];
}

export function checkIfTwitterUsername(node) {
  return node.innerText.startsWith('@');
}
