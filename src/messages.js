/** Actions(or messages) here is typical object you`ll send between parts of extension.
 *  If you want to ad smth to a message - use `...spread` and add whatever you want after it.
 * */

export const isAlive = { type: 'isAlive' };
export const extensionOn = { type: 'extensionOn' };
export const extensionOff = { type: 'extensionOff' };

export const twitterAuth = { type: 'twitterAuth' };
export const metamaskAuth = { type: 'metamaskAuth' };

export const awardsConfigRequest = { type: 'awardsConfigRequest' };

export const galleryRequest = {
  type: 'galleryRequest',
  twitterName: undefined,
}

export const statusCheck = {
  type: 'extensionStatusCheck',
};

export const getOwnerTwitterUsernameRequest = {
  type: 'getOwnerTwitterUsernameRequest',
}

export const userMapSync = {
  type: 'userMapSync',
  gallery: undefined,
};
