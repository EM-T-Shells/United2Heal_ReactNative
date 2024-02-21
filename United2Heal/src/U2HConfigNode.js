//U2HConfigNode.js is used to set global variables that can be reused throughout the app. 

let VolunteerName = '';
let GroupName = '';
let UserRole = '';
let SearchItemsList = [];

export function getVolunteerName() {
  return VolunteerName;
}
export function setVolunteerName(newVolunteerName) {
  VolunteerName = newVolunteerName;
}

export function getGroupName() {
  return GroupName;
}
export function setGroupName(newGroupName) {
  GroupName = newGroupName;
}

export function getUserRole() {
  return UserRole;
}
export function setUserRole(newUserRole) {
  UserRole = newUserRole;
}

export function getSearchItemsList() {
  return SearchItemsList;
}
export function setSearchItemsList(newSearchItemList) {
  SearchItemsList = newSearchItemList;
}

const U2HConfigNode = {
  getVolunteerName,
  setVolunteerName,
  getGroupName,
  setGroupName,
  getUserRole,
  setUserRole,
  getSearchItemsList,
  setSearchItemsList,
};

export default U2HConfigNode;
