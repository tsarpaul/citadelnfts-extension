// These are registered users
export class TwitterUser {
  constructor(address, username, total_value, nfts, rank){
    this.address = address;
    this.username = username;
    this.total_value = total_value;
    this.nfts = nfts;
    this.rank = rank;
  }
}

// TODO: Add max length
// username: TwitterUser map
class UserMapHelper {
  constructor(map){
    this.map = map;
  }
  isEmpty(){
    return Object.keys(this.map).length === 0;
  }
  userExists(username){
    return username in this.map;
  }
}

// TODO: Recall this to UserMapStripped
class UserMetadataHelper {
  constructor(list){
    this.list = list;
  }

  userExists(username){
    return username in this.list;
  }
}

// export function getTotalValueClass(tv){
//   if(1 >= tv && tv >= 0) {
//     return 'total-value-1';
//   }
//   else if(10 >= tv && tv > 1) {
//     return 'total-value-2';
//   }
//   else if(100 >= tv && tv > 10) {
//     return 'total-value-3';
//   }
//   else if(1000 >= tv && tv > 100) {
//     return 'total-value-4';
//   }
//   else if(tv > 1000) {
//     return 'total-value-5';
//   }
//   return 'total-value-1';
// }

// TODO: Move ranks to config file
export function getRankName(rank){
  rank = parseInt(rank);
  switch(rank){
    case 1: return "Private";
    case 2: return "Citadel Sergeant";
    case 3: return "Citadel Captain";
    case 4: return "Citadel Colonel";
    case 5: return "Citadel General";
  }
}

export function getRankDetails(rank){
  rank = parseInt(rank);
  switch(rank){
    case 1: return "0-1";
    case 2: return "1-10";
    case 3: return "10-100";
    case 4: return "100-1000";
    case 5: return "1000+";
  }
}

export function getClassByRank(rank){
  return 'total-value-' + rank;
}

export var UserData = new UserMapHelper({});
export var UserMetadata = new UserMetadataHelper([]);
