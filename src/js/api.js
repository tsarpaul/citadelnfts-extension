import {API_URL} from "../env.app.constants";
import {readLocalStorage, writeLocalStorage} from "./utils/general";
import {TwitterUser} from './twitter/users';

// Serializes getUser output into TwitterUser
export function serializeUser(user){
  let user_ = new TwitterUser(user['address'], user['twitter_username'], user['total_value'], user['nfts'], user['rank']);
  return user_;
}

export async function getUser(twitterUsername){
  try {
    const response = await fetch(`${API_URL}/accounts/${twitterUsername}`, {method: 'GET'});
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserMetadata(){
  try {
    const response = await fetch(`${API_URL}/accounts`);
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function backendRegister(twitterUsername, twitterId, address, signature){
  let response = await fetch(`${API_URL}/register`, {method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'address': address, 'twitter_id': twitterId, 'twitter_username': twitterUsername, 'sig': signature})
  });
  // TODO: Check response
  await writeLocalStorage({'loggedIn': true});
}

export async function backendIsLoggedIn() {
  let loggedIn = await readLocalStorage('loggedIn');
  return loggedIn;
}

export async function getAwardsConfig(){
  let response = await fetch(`${API_URL}/awards-config`);
  return response.json();
}
