import { checkIfTwitterUsername } from "../utils/twitter";
import { TWITTER_SELECTORS } from "./constants";

export function getProfileHeaderUsernameElement() {
  const profileNavbarElem = document.querySelector(TWITTER_SELECTORS.PROFILE_NAVBAR_SELECTOR)
  const profileHeader = profileNavbarElem && profileNavbarElem.previousElementSibling;
  const headerUsername = profileHeader && Array.from(profileHeader.querySelectorAll('span')).find(node => checkIfTwitterUsername(node));
  return headerUsername;
}
