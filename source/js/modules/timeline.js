import {scrollIntoView} from 'scroll-js';


// Инициализируем слайдер
const swiper = new Swiper(`.timeline-slider`, {
  loop: true,

  // autoplay: {
  //   delay: 10000,
  // },
  navigation: {
    nextEl: `.timeline-slider__arrow--next`,
    prevEl: `.timeline-slider__arrow--prev`,
  },
  pagination: {
    el: `.timeline-slider__pagination`,
    type: `fraction`,
    renderFraction: (currentClass, totalClass) => {
      return `<span class="` + currentClass + `"></span>` +
              `\/` +
              `<span class="` + totalClass + `"></span>`;
    }
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30
    }
  }
});


export const timeline = () => {

  const accordionItemElems = document.querySelectorAll(`.timeline__item`);

  accordionItemElems.forEach((elem) => {
    const openerElem = elem.querySelector(`.timeline__title`);

    // Все аккордионы изначально открыты, чтоб слайдер успел посчитать ширину, а здесь мы их закрываем
    elem.classList.remove(`timeline__item--open`);

    if (openerElem) {
      openerElem.addEventListener(`click`, () => {
        elem.classList.toggle(`timeline__item--open`);

        // При клике удаляем виджет
        const widgetElem = elem.querySelector(`.timeline-years__widget-content--open`);
        if (widgetElem) {
          widgetElem.classList.remove(`timeline-years__widget-content--open`);
          removeChildren(widgetElem);
        }

        if (elem.classList.contains(`timeline__item--open`)) {
          scrollIntoView(openerElem, document.body, {behavior: `smooth`});
        }
      });
    }
  });
};


const openTab = () => {
  const ITEM_CLASSNAME = `timeline-years__item--open`;
  const TAB_CLASSNAME = `timeline__tab--active`;

  const tabs = document.querySelectorAll(`[data-timeline-tab]`);
  const years = document.querySelectorAll(`[data-timeline-year]`);

  document.querySelectorAll(`[data-timeline-year]`).forEach((elem, index) => {
    if (index !== 0) {
      elem.classList.remove(ITEM_CLASSNAME);
    }
  });


  tabs.forEach((tab) => {
    tab.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const id = tab.dataset.timelineTab;
      const year = document.querySelector(`[data-timeline-year="${id}"]`);

      years.forEach((elem) => {
        elem.classList.remove(ITEM_CLASSNAME);
      });

      tabs.forEach((elem) => {
        elem.classList.remove(TAB_CLASSNAME);

        // При закрытии удаляем виджет
        if (widgetParent && widgetParent.classList.contains(`timeline-years__widget-content--open`)) {
          widgetParent.classList.remove(`timeline-years__widget-content--open`);
          removeChildren(widgetParent);
        }
      });

      tab.classList.add(TAB_CLASSNAME);
      year.classList.add(ITEM_CLASSNAME);
    });
  });
};


const removeChildren = (elem) => {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

let widgetParent = null;

const openYandexWidget = () => {
  const timeLineContentElems = document.querySelectorAll(`.timeline-years__content`);

  timeLineContentElems.forEach((elem) => {
    const btn = elem.querySelector(`.timeline-years__widget-btn`);
    const widgetContentElem = elem.querySelector(`.timeline-years__widget-content`);

    if (btn && widgetContentElem) {
      const widgetIframeElem = widgetContentElem.querySelector(`iframe`).cloneNode(true);
      removeChildren(widgetContentElem);

      btn.addEventListener(`click`, () => {
        const isOpen = widgetContentElem.classList.contains(`timeline-years__widget-content--open`);
        if (!isOpen) {
          widgetContentElem.classList.add(`timeline-years__widget-content--open`);
          widgetContentElem.append(widgetIframeElem);
          widgetParent = widgetContentElem;
        } else {
          widgetContentElem.classList.remove(`timeline-years__widget-content--open`);
          removeChildren(widgetContentElem);
        }
      });
    }
  });
};


const setModal = () => {
  document.querySelectorAll(`[data-timeline-modal-opener]`).forEach((elem) => {
    const MODAL_CLASS_NAME = `timeline-modal--open`;

    const id = elem.dataset.timelineModalOpener;
    const modalElem = document.querySelector(`[data-timeline-modal="${id}"]`);

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        closeModalHandler();
      }
    };

    const openModalHandler = (evt) => {
      evt.preventDefault();
      if (modalElem) {
        modalElem.classList.add(MODAL_CLASS_NAME);
        document.addEventListener(`keydown`, escKeyDownHandler);
        document.body.classList.add(`body-fixed`);
      }
    };

    const closeModalHandler = (evt) => {
      evt.preventDefault();
      if (modalElem) {
        modalElem.classList.remove(MODAL_CLASS_NAME);
        document.removeEventListener(`keydown`, escKeyDownHandler);
        if (document.body.classList.contains(`body-fixed`)) {
          document.body.classList.remove(`body-fixed`);
        }
      }
    };

    if (modalElem) {
      modalElem.querySelector(`.timeline-modal__close-btn`).addEventListener(`click`, closeModalHandler);
      modalElem.querySelector(`.timeline-modal__overflow`).addEventListener(`click`, closeModalHandler);
    }

    elem.addEventListener(`click`, openModalHandler);
  });
};

openTab();
openYandexWidget();
setModal();
