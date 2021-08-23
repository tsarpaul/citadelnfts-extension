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

export async function backendRegister(twitterUsername, twitterId, address, signature, access_token, access_token_secret){
  let response = await fetch(`${API_URL}/register`, {method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'address': address, 'twitter_id': twitterId, 'twitter_username': twitterUsername, 'sig': signature,
      'twitter_access_token': access_token,'twitter_access_token_secret': access_token_secret
    })
  });
  if(response.status == 200){
    let data = await response.json()
    await writeLocalStorage({'accessToken': data['access_token']});
  }
}

export async function backendIsLoggedIn() {
  let access_token = await readLocalStorage('accessToken');
  return access_token != null
}

export async function FetchAwardsConfig(){
  let response = await fetch(`${API_URL}/awards-config`);
  return response.json();
}
