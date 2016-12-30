import pjson from '../package.json';

const SERVER_URL = 'http://localhost:8080/';
const CLIENT_VERSION = pjson.version;
const REACT_VERSION = pjson.dependencies.react;
const NAVBAR_SECOND_LEVEL_DIRECTION = 1; // 0 for holizontal, Other for vertical
const SHOW_BREAD_CRUMBS = false;

export default {
  SERVER_URL,
  CLIENT_VERSION,
  REACT_VERSION,
  NAVBAR_SECOND_LEVEL_DIRECTION,
  SHOW_BREAD_CRUMBS,
};
