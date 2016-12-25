import pjson from '../package.json';

const SERVER_URL = 'http://localhost:8080/';
const CLIENT_VERSION = pjson.version;
const REACT_VERSION = pjson.dependencies.react;
const NAVBAR_SECOND_LEVEL_DIRECTION = 0; // 0 for holizontal, Other for vertical

export default {
  SERVER_URL,
  CLIENT_VERSION,
  REACT_VERSION,
  NAVBAR_SECOND_LEVEL_DIRECTION,
};
