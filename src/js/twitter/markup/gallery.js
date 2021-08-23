import { getClassByRank, getRankDetails, getRankName } from "../users";

export const TWITTER_GALLERY_CLASSNAMES = {
  GALLERY: 'twitter-gallery',
  GALLERY_ITEM: 'twitter-gallery__item',
  GALLERY_ITEM_LINK: 'twitter-gallery__item__link',
  GALLERY_ITEM_IMAGE_CONTAINER: 'twitter-gallery__item__image__container',
  GALLERY_ITEM_IMAGE: 'twitter-gallery__item__image',
  GALLERY_ITEM_TITLE: 'twitter-gallery__item__title',
};

const etherIcon = chrome.runtime.getURL('assets/img/eth.png');
function getEtherImg() {
  return `<img style="width: 12px; height: 12px; margin: 0 0px;" src="${etherIcon}" alt="Ether"/>`;
}

function getGalleryHeaderMarkup(user) {
  let tv = user.total_value.toFixed(3);
  let rankName = getRankName(user.rank);
  let rankDetails = getRankDetails(user.rank);
  let rankClass = getClassByRank(user.rank);
  let markup = `
  <div id="total-value" style='margin-top: 8px;'> \
    <div style="text-align: center; font-family: 'Times New Roman';">
      <span>NFT Total Purchases: ${tv}</span>${getEtherImg()}
      - <span class="${rankClass}">${rankName} (${rankDetails}${getEtherImg()})</span>
    </div> 
  </div>`;
  return markup;
}

export function getGalleryMarkup(user) {
  let markup = getGalleryHeaderMarkup(user);

  let nfts = user.nfts;
  if (nfts) {
    const galleryItemsHtmlCollection = nfts.map(getGalleryItemMarkup).join('');
    markup += getGalleryContainerMarkup({innerHTML: galleryItemsHtmlCollection});
  };

  return markup;
}

export function getGalleryContainerMarkup({innerHTML = ''}) {
  let markup = `<div class=${TWITTER_GALLERY_CLASSNAMES.GALLERY}>${innerHTML}</div>`;
  return markup;
}

export function getGalleryItemMarkup(nftItem) {
  let {chain, asset_name, collection_name, img_url, is_verified, last_price, opensea_url} = nftItem;
  return (`
    <div class="${TWITTER_GALLERY_CLASSNAMES.GALLERY_ITEM}">
      <a class="${TWITTER_GALLERY_CLASSNAMES.GALLERY_ITEM_LINK}" href="${opensea_url}" target="_blank">
        <div class="${TWITTER_GALLERY_CLASSNAMES.GALLERY_ITEM_IMAGE_CONTAINER}">
          <img class="${TWITTER_GALLERY_CLASSNAMES.GALLERY_ITEM_IMAGE}" src="${img_url}" alt="NFT image - ${asset_name}" loading="lazy"/>
        </div>
        <span class="${TWITTER_GALLERY_CLASSNAMES.GALLERY_ITEM_TITLE}">${asset_name} - ${last_price}${getEtherImg()}</span>
      </a>  
    </div>
  `).trim();
}
