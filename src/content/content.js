import "../assets/css/global.css";
import "../assets/css/twitter-gallery.css";
import { backendIsLoggedIn } from "../js/api";
import { AwardsConfig } from "../js/awards";
import * as messages from '../messages';
import "../js/twitter/constants.js";
import "../js/twitter/gallery.js";
import {contentMessageRouter} from "./contentMessageRouter";
var twitter_main = require("../js/twitter/index.js")

async function init(){
    let loggedIn = await backendIsLoggedIn();

    // Get config from background
    chrome.runtime.sendMessage({
        ...messages.awardsConfigRequest
    }, (resp) => {
        AwardsConfig.map = resp;
    });

    // Register message listener
    if(loggedIn) {
        console.log("[+] Citadel user is logged in!");
        chrome.runtime.onMessage.addListener(contentMessageRouter);
        twitter_main.twitterInit();
    }
    else {
        console.log("[!] Citadel user is logged out!");
    }
}

console.log("CitadelNFT Init Content Script");
init();
