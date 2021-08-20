import {classnamesStringToSelector} from '../utils/twitter';

export const WHITE_THEME = 'white-theme';
export const DIM_THEME = 'dim-theme';
export const BLACK_THEME = 'black-theme';

export const UTILITY_TEXT = 'utility-text';
export const IMPORTANT_TEXT = 'important-text';

export const ACTIVE_COLOR_CLASS = 'r-13gxpu9'; // blue only, other colors are not supported now
export const COLORS_CLASSES = {
  [WHITE_THEME]: {
    [UTILITY_TEXT]: 'r-14j79pv',
    [IMPORTANT_TEXT]: 'r-18jsvk2',
  },
  [DIM_THEME]: {
    [UTILITY_TEXT]: 'r-111h2gw',
    [IMPORTANT_TEXT]: 'r-jwli3a',
  },
  [BLACK_THEME]: {
    [UTILITY_TEXT]: 'r-9ilb82',
    [IMPORTANT_TEXT]: 'r-1fmj7o5',
  },
};

export const UTILITY_TEXT_CLASSES = Object.values(COLORS_CLASSES).reduce((classes, schemeObj) => `${classes} ${schemeObj[UTILITY_TEXT]}`, '').trim();
export const IMPORTANT_TEXT_CLASSES = Object.values(COLORS_CLASSES).reduce((classes, schemeObj) => `${classes} ${schemeObj[IMPORTANT_TEXT]}`, '').trim();

export const TWITTER_MODALS_ROOT_ID = 'layers';
export const TWITTER_SELECTORS = {
  PROFILE_PAGE_TAB_BUTTON: '.r-cpa5s6',
  TAB_CONTENT_BLOCK: 'section[aria-labelledby] > div.css-1dbjc4n',
  UTILITY_TEXT_NODES: classnamesStringToSelector(UTILITY_TEXT_CLASSES),
  IMPORTANT_TEXT_NODES: classnamesStringToSelector(IMPORTANT_TEXT_CLASSES),
  CURRENT_COLOR_THEME_TEXT: `.${ACTIVE_COLOR_CLASS}`,
  MESSAGES_BLOCK: '.r-1jte41z',
  MODAL_ROOT: `#${TWITTER_MODALS_ROOT_ID}`,
  TWEET_EDITOR: '.DraftEditor-root',
  PROFILE_NAVBAR_SELECTOR: '[aria-label="Profile timelines"]',
  OWNER_USERNAME: 'css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0',
};

const TAB_CONTAINER_CLASSES =  'css-901oao r-6koalj r-eqz5dr r-1qd0xha r-a023e6 r-b88u0q r-1pi2tsx r-rjixqe r-bcqeeo r-1l7z4oj r-95jzfe r-bnwqim r-qvutc0';
export const ACTIVE_TAB_CONTAINER_CLASSES = `r-13gxpu9 ${TAB_CONTAINER_CLASSES}`;
export const INACTIVE_TAB_CONTAINER_CLASSES = `r-9ilb82 ${TAB_CONTAINER_CLASSES}`;
export const ACTIVE_TAB_BOTTOM_LINE_CLASSES = 'css-1dbjc4n r-1kihuf0 r-urgr8i r-sdzlij r-1p0dtai r-xoduu5 r-hdaws3 r-s8bhmr r-u8s1d r-13qz1uu';
export const INACTIVE_TAB_BOTTOM_LINE_CLASSES = 'css-1dbjc4n r-xoduu5';

export const NFT_BUTTON_INNER_TEXT = 'NFTs';
export const NFT_BUTTON_ID = 'open-nft-button';
export const NFT_GALLERY_ID = 'nft-gallery';

export const CITADEL_MAIN_USER_ID = 'citadel-main-user';
export const CITADEL_USER_CLASS = 'citadel-user';
export const TOTAL_VALUE_1 = 'total-value-1';
export const TOTAL_VALUE_2 = 'total-value-2';
export const TOTAL_VALUE_3 = 'total-value-3';
export const TOTAL_VALUE_4 = 'total-value-4';
export const TOTAL_VALUE_5 = 'total-value-5';

export const DO_NOT_TOUCH = 'citadel-edited';
export const DESTROY_ON_UPDATE = 'citadel-destroy-marked';

/** COLORS */
export const BLACK_COLOR = 'rgb(0, 0, 0)';
export const WHITE_COLOR = 'rgb(255, 255, 255)';
