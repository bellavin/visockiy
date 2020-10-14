export const footer = () => {
  const footerSectionElems = document.querySelectorAll(`.footer__section`);

  footerSectionElems.forEach((elem) => {
    if (window.innerWidth < 768) {
      const openerElem = elem.querySelector(`.footer__title`);
      openerElem.addEventListener(`click`, () => {
        elem.classList.toggle(`footer__section--open`);
      });
    }
  });
};
