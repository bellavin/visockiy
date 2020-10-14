import {scrollIntoView} from 'scroll-js';


// Инициализируем слайдер
const swiper = new Swiper(`.rooms-slider`, {
  loop: true,

  // autoplay: {
  //   delay: 10000,
  // },

  breakpoints: {
    768: {
      navigation: {
        nextEl: `.rooms-slider__arrow--next`,
        prevEl: `.rooms-slider__arrow--prev`,
      },
    },
    1024: {
      navigation: {
        nextEl: `.rooms-slider__arrow--next`,
        prevEl: `.rooms-slider__arrow--prev`,
      },
      pagination: {
        el: `.rooms-slider__pagination .swiper-pagination`,
        clickable: true,
      },
    }
  }
});


// Выравниваем стрелки у слайдера
document.querySelectorAll(`.rooms-slider`).forEach((elem) => {
  const imgElem = elem.querySelector(`.js-rooms-img-inner`);
  const arrowElems = elem.querySelectorAll(`[class*="swiper-button-"]`);

  if (imgElem && arrowElems) {
    const imgWidth = imgElem.offsetHeight;

    arrowElems.forEach((arrow) => {
      arrow.style.top = imgWidth / 2 + `px`;
    });
  }
});


// Связываем метки на слайдере со ссылками и вешаем обработчики вызова модального окна
const sliderPoints = () => {
  document.querySelectorAll(`.swiper-slide-active`).forEach((slide) => {

    slide.querySelectorAll(`[data-rooms-slider-link]`).forEach((linkElem) => {
      const POINT_CLASS_NAME = `rooms-slider__point--hover`;
      const LINK_CLASS_NAME = `rooms-slider__link--hover`;
      const MODAL_CLASS_NAME = `rooms-modal--open`;


      let timeout;

      const mouseoverPointHandler = () => {
        timeout = setTimeout(() => {
          linkElem.classList.add(LINK_CLASS_NAME);
        }, 100);
      };

      const mouseoutPointHandler = () => {
        if (timeout) {
          linkElem.classList.remove(LINK_CLASS_NAME);
          clearTimeout(timeout);
        }
      };

      const mouseoverLinkHandler = () => {
        timeout = setTimeout(() => {
          pointElem.classList.add(POINT_CLASS_NAME);
        }, 100);
      };

      const mouseoutLinkHandler = () => {
        if (timeout) {
          pointElem.classList.remove(POINT_CLASS_NAME);
          clearTimeout(timeout);
        }
      };

      const openModalHandler = (evt) => {
        evt.preventDefault();
        if (modalElem) {
          document.body.classList.add(`body-fixed`);
          modalElem.classList.add(MODAL_CLASS_NAME);
          document.addEventListener(`keydown`, escKeyDownHandler);
        }
      };

      const closeModalHandler = (evt) => {
        evt.preventDefault();
        if (modalElem) {
          if (document.body.classList.contains(`body-fixed`)) {
            document.body.classList.remove(`body-fixed`);
          }
          modalElem.classList.remove(MODAL_CLASS_NAME);
          document.removeEventListener(`keydown`, escKeyDownHandler);
        }
      };

      const escKeyDownHandler = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          closeModalHandler();
        }
      };

      const id = linkElem.dataset.roomsSliderLink;
      const pointElem = slide.querySelector(`[data-rooms-slider-point="${id}"]`);
      const modalElem = document.querySelector(`[data-rooms-modal="${id}"]`);

      linkElem.addEventListener(`click`, openModalHandler);

      if (modalElem) {
        modalElem.querySelector(`.rooms-modal__close-btn`).addEventListener(`click`, closeModalHandler);
        modalElem.querySelector(`.rooms-modal__overflow`).addEventListener(`click`, closeModalHandler);
      }

      if (pointElem) {
        const text = linkElem.textContent;
        pointElem.dataset.text = text;

        pointElem.addEventListener(`mouseover`, mouseoverPointHandler);
        pointElem.addEventListener(`mouseout`, mouseoutPointHandler);

        linkElem.addEventListener(`mouseover`, mouseoverLinkHandler);
        linkElem.addEventListener(`mouseout`, mouseoutLinkHandler);
        pointElem.addEventListener(`click`, openModalHandler);
      }
    });
  });
};

sliderPoints();

if (Array.isArray(swiper)) {
  swiper.forEach((slider) => {
    slider.on(`slideChangeTransitionEnd`, sliderPoints);
  });
} else if (swiper) {
  swiper.on(`slideChangeTransitionEnd`, sliderPoints);
}


// Аккордеон на главной

const removeItemsClass = (list, className, isFirstOpen) => {
  list.forEach((item, index) => {
    if (isFirstOpen) {
      if (index === 0) {
        item.classList.add(className);
      } else {
        item.classList.remove(className);
      }
    } else {
      item.classList.remove(className);
    }
  });
};

export const rooms = () => {
  const ITEM_SELECTOR = `[data-rooms-item]`;
  const TAB_SELECTOR = `[data-rooms-tab]`;
  const FLOOR_NUM_SELECTOR = `a.rooms-nav__floor`;
  const IMG_SELECTOR = `[data-rooms-img]`;
  const MAP_SELECTOR = `[data-rooms-map]`;

  const OPEN_ITEM_CLASSNAME = `rooms__item--open`;
  const ACTIVE_TAB_CLASSNAME = `rooms-nav__link--active`;
  const ACTIVE_FLOOR_CLASSNAME = `rooms-nav__floor--active`;
  const OPEN_IMG_CLASSNAME = `rooms-nav__img--open`;

  const items = document.querySelectorAll(ITEM_SELECTOR);
  const tabElems = document.querySelectorAll(TAB_SELECTOR);
  const floorNumElems = document.querySelectorAll(FLOOR_NUM_SELECTOR);
  const imgElems = document.querySelectorAll(IMG_SELECTOR);
  const mapElems = document.querySelectorAll(MAP_SELECTOR);

  const openItemHandler = (item) => {
    const id = item.dataset.roomsItem;
    const tabElem = document.querySelector(`[data-rooms-tab="${id}"]`); // Оптимизировать
    const floorElem = tabElem.parentElement.parentElement.querySelector(FLOOR_NUM_SELECTOR);
    const imgElem = document.querySelector(`[data-rooms-img="${id}"]`);

    if (window.innerWidth < 1024) {
      const isOpen = item.classList.contains(OPEN_ITEM_CLASSNAME);
      removeItemsClass(items, OPEN_ITEM_CLASSNAME);
      removeItemsClass(tabElems, ACTIVE_TAB_CLASSNAME);
      removeItemsClass(floorNumElems, ACTIVE_FLOOR_CLASSNAME);
      removeItemsClass(imgElems, OPEN_IMG_CLASSNAME);

      if (!isOpen) {
        item.classList.add(OPEN_ITEM_CLASSNAME);
        tabElem.classList.add(ACTIVE_TAB_CLASSNAME);
        floorElem.classList.add(ACTIVE_FLOOR_CLASSNAME);
        imgElem.classList.add(OPEN_IMG_CLASSNAME);
      }
    } else {
      removeItemsClass(items, OPEN_ITEM_CLASSNAME);
      removeItemsClass(tabElems, ACTIVE_TAB_CLASSNAME);
      removeItemsClass(floorNumElems, ACTIVE_FLOOR_CLASSNAME);
      removeItemsClass(imgElems, OPEN_IMG_CLASSNAME);

      item.classList.add(OPEN_ITEM_CLASSNAME);
      tabElem.classList.add(ACTIVE_TAB_CLASSNAME);
      floorElem.classList.add(ACTIVE_FLOOR_CLASSNAME);
      imgElem.classList.add(OPEN_IMG_CLASSNAME);
    }
  };

  if (window.innerWidth < 1024) {
    removeItemsClass(items, OPEN_ITEM_CLASSNAME);
  } else {
    removeItemsClass(items, OPEN_ITEM_CLASSNAME, true);
    removeItemsClass(tabElems, ACTIVE_TAB_CLASSNAME, true);
    removeItemsClass(floorNumElems, ACTIVE_FLOOR_CLASSNAME, true);
    removeItemsClass(imgElems, OPEN_IMG_CLASSNAME, true);
  }

  items.forEach((elem) => {
    const openerElem = elem.querySelector(`.rooms__title`);
    openerElem.addEventListener(`click`, () => {
      if (window.innerWidth < 1024) {
        openItemHandler(elem);
      }
    });
  });

  tabElems.forEach((elem) => {
    elem.addEventListener(`click`, () => {
      const id = elem.dataset.roomsTab;
      const item = document.querySelector(`[data-rooms-item="${id}"]`);
      openItemHandler(item);
    });
  });

  floorNumElems.forEach((elem) => {
    elem.addEventListener(`click`, () => {
      const tabElem = elem.parentElement.querySelector(TAB_SELECTOR);
      const id = tabElem.dataset.roomsTab;
      const item = document.querySelector(`[data-rooms-item="${id}"]`);
      openItemHandler(item);
    });
  });

  mapElems.forEach((elem) => {
    elem.addEventListener(`click`, () => {
      const id = elem.dataset.roomsMap;
      const item = document.querySelector(`[data-rooms-item="${id}"]`);
      openItemHandler(item);
    });
  });
};

// Доскрол
const scrollToRoom = (className) => {
  document.querySelectorAll(className).forEach((link) => {
    link.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const target = document.querySelector(`#rooms-container`);
      scrollIntoView(target, document.body, {behavior: `smooth`});
    });
  });
};

scrollToRoom(`.rooms-nav__floor`);
scrollToRoom(`.rooms-nav__link`);
scrollToRoom(`[data-rooms-map]`);


// Табы на главной
const openTab = () => {
  const ITEM_CLASSNAME = `timeline-items__item--open`;
  const TAB_CLASSNAME = `timeline__tab--active`;

  const tabs = document.querySelectorAll(`[data-timeline-tab]`);
  const items = document.querySelectorAll(`[data-timeline-year]`);

  document.querySelectorAll(`[data-timeline-year]`).forEach((elem, index) => {
    if (index !== 0) {
      elem.classList.remove(ITEM_CLASSNAME);
    }
  });


  tabs.forEach((tab) => {
    tab.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const id = tab.dataset.timelineTab;
      const item = document.querySelector(`[data-timeline-year="${id}"]`);

      items.forEach((elem) => {
        elem.classList.remove(ITEM_CLASSNAME);
      });

      tabs.forEach((elem) => {
        elem.classList.remove(TAB_CLASSNAME);
      });

      tab.classList.add(TAB_CLASSNAME);
      item.classList.add(ITEM_CLASSNAME);
    });
  });
};

openTab();
