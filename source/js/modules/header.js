import {enableScrolling, disableScrolling} from '../utils/scroll-lock';

export const header = () => {
  const headerElem = document.querySelector(`.header`);
  const openerElem = headerElem.querySelector(`.burger`);
  const overlayElem = headerElem.querySelector(`.header__overlay`);

  openerElem.addEventListener(`click`, () => {
    if (headerElem.classList.contains(`header--open`)) {
      headerElem.classList.remove(`header--open`);
      enableScrolling();
    } else {
      headerElem.classList.add(`header--open`);
      disableScrolling();
    }
  });

  overlayElem.addEventListener(`click`, () => {
    headerElem.classList.remove(`header--open`);
    enableScrolling();
  });
};
