class Award{
    constructor(award_type, icon_url, icon_alt, collection_name){
        this.award_type = award_type;
        this.icon_url = icon_url;
        this.icon_alt = icon_alt;
        this.collection_name = collection_name;
    }
}

export function getAwardIconImgMarkup(icon_url){

}

class AwardsConfigHelper{
    constructor(){
        this.map = {}
    }
}

export var AwardsConfig = new AwardsConfigHelper();
