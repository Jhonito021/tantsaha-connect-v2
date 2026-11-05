import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCloudRain,
  faCloud,
  faCloudBolt,
  faWind,
  faDroplet,
  faTemperatureHigh,
  faSeedling,
  faWheatAwn,
  faLeaf,
  faScissors,
  faBug,
  faCloudSunRain,
  faCalendarDays,
  faBook,
  faPlus,
  faTrashCan,
  faTriangleExclamation,
  faCircleCheck,
  faVolumeHigh,
  faVolumeXmark,
  faPlay,
  faPause,
  faRotateRight,
  faLocationDot,
  faClock,
  faUser,
  faEarListen,
  faCircleInfo,
  faChevronRight,
  faArrowLeft,
  faCheck,
  faHouse,
  faCloudSun,
  faSquareCheck,
  faCarrot,
  faCircleDot,
  faEgg,
  faCube,
  faBacterium,
  faLayerGroup,
  faMortarPestle,
  faSprayCan,
  faBottleDroplet,
  faRulerCombined,
  faArrowsRotate,
  faWaveSquare,
  faCrosshairs,
  faLock,
  faPhone,
  faUserPlus,
  faRightToBracket,
  faRightFromBracket,
  faShieldHalved,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';

export const ICONS = {
  moon: faMoon,
  lock: faLock,
  phone: faPhone,
  userPlus: faUserPlus,
  login: faRightToBracket,
  logout: faRightFromBracket,
  shield: faShieldHalved,
  crosshairs: faCrosshairs,
  sun: faSun,
  cloudRain: faCloudRain,
  cloud: faCloud,
  cloudBolt: faCloudBolt,
  wind: faWind,
  droplet: faDroplet,
  temp: faTemperatureHigh,
  seedling: faSeedling,
  wheat: faWheatAwn,
  leaf: faLeaf,
  scissors: faScissors,
  bug: faBug,
  cloudSunRain: faCloudSunRain,
  calendar: faCalendarDays,
  book: faBook,
  plus: faPlus,
  trash: faTrashCan,
  alert: faTriangleExclamation,
  checkCircle: faCircleCheck,
  volumeHigh: faVolumeHigh,
  volumeOff: faVolumeXmark,
  play: faPlay,
  pause: faPause,
  reload: faRotateRight,
  location: faLocationDot,
  clock: faClock,
  user: faUser,
  earListen: faEarListen,
  info: faCircleInfo,
  chevronRight: faChevronRight,
  arrowLeft: faArrowLeft,
  check: faCheck,
  home: faHouse,
  cloudSun: faCloudSun,
  squareCheck: faSquareCheck,
  carrot: faCarrot,
  circleDot: faCircleDot,
  egg: faEgg,
  cube: faCube,
  bacterium: faBacterium,
  layerGroup: faLayerGroup,
  mortarPestle: faMortarPestle,
  sprayCan: faSprayCan,
  bottleDroplet: faBottleDroplet,
  ruler: faRulerCombined,
  arrowsRotate: faArrowsRotate,
  waveSquare: faWaveSquare,
};

export function getCropIcon(cropId) {
  switch (cropId) {
    case 'vary':
      return faWheatAwn;
    case 'voatabia':
      return faCircleDot;
    case 'tsaramaso':
      return faSeedling;
    case 'katsaka':
      return faBacterium;
    case 'ovy':
      return faEgg;
    case 'anana':
      return faLeaf;
    case 'voanjo':
      return faCube;
    default:
      return faLeaf;
  }
}

export function getWeatherIcon(condition) {
  switch (condition) {
    case 'sunny':
      return faSun;
    case 'rainy':
      return faCloudRain;
    case 'cloudy':
      return faCloud;
    case 'storm':
      return faCloudBolt;
    case 'partlyCloudy':
    default:
      return faCloudSun;
  }
}

export { FontAwesomeIcon };
