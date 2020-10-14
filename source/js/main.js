import {forEachPolyfill} from './utils/polyfill-foreach';
import {initIe11Download} from './utils/init-ie11-download';
import {header} from './modules/header';
import {footer} from './modules/footer';
import {rooms} from './modules/rooms';
import {timeline} from './modules/timeline';
import {story} from './modules/story';

// Utils
// ---------------------------------
forEachPolyfill();
initIe11Download();


// Modules
// ---------------------------------
header();
footer();
rooms();
timeline();
story();
