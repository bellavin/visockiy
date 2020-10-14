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

const ie11Download = (el) => {
  if (el.href === ``) {
    throw Error(`The element has no href value.`);
  }

  let filename = el.getAttribute(`download`);
  if (filename === null || filename === ``) {
    const tmp = el.href.split(`/`);
    filename = tmp[tmp.length - 1];
  }

  el.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = () => {
      xhr.responseType = `blob`;
    };
    xhr.onload = () => {
      navigator.msSaveOrOpenBlob(xhr.response, filename);
    };
    xhr.open(`GET`, el.href, true);
    xhr.send();
  });
};

const downloadLinks = document.querySelectorAll(`a[download]`);

const initIe11Download = () => {
  if (window.navigator.msSaveBlob) {
    if (downloadLinks.length) {
      downloadLinks.forEach((el) => {
        ie11Download(el);
      });
    }
  }
};

export {initIe11Download};

const forEachPolyfill = () => {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
};

export {forEachPolyfill};

const body = document.querySelector(`body`);

const getScrollbarWidth = () => {
  const outer = document.createElement(`div`);
  outer.style.visibility = `hidden`;
  outer.style.overflow = `scroll`;
  outer.style.msOverflowStyle = `scrollbar`;
  body.appendChild(outer);
  const inner = document.createElement(`div`);
  outer.appendChild(inner);
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  outer.parentNode.removeChild(outer);
  if (outer.offsetWidth !== inner.offsetWidth) {
    return scrollbarWidth;
  }
};

const getBodyScrollTop = () => {
  return (
    self.pageYOffset ||
    (document.documentElement && document.documentElement.ScrollTop) ||
    (body && body.scrollTop)
  );
};

const disableScrolling = () => {
  const scrollWidth = getScrollbarWidth();
  body.setAttribute(`style`, `padding-right: ` + scrollWidth + `px;`);
  body.dataset.scrollY = `${getBodyScrollTop()}`;
  body.style.top = `-${body.dataset.scrollY}px`;
  body.classList.add(`scroll-lock`);
};

const enableScrolling = () =>{
  body.removeAttribute(`style`);
  body.classList.remove(`scroll-lock`);
  window.scrollTo(0, +body.dataset.scrollY);
};

export {enableScrolling, disableScrolling};

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

import anime from 'animejs/lib/anime.es.js';

class Slider {
  constructor(element) {
    // переменные
    this.element = element;
    this.scroll = this.element.querySelector(`.story-slider__wrapper`);
    this.scrollWrap = this.element.querySelector(`.story-slider__post-wrapper`);
    this.slides = this.element.querySelectorAll(`.story-slider__item`);
    this.left = this.element.querySelector(`.story-slider__btn--back`);
    this.right = this.element.querySelector(`.story-slider__btn--forward`);
    this.sliderDots = Array.from(this.element.querySelectorAll(`.story-slider__pagination-bullet`));
    this.canAnimate = true;
    this.gap = (this.scroll.offsetWidth - this.slides[0].offsetWidth) / 2;
    // функции
    this.setListeners();
  }

  setListeners() {
    this.left.addEventListener(`click`, (event) => {
      event.preventDefault();

      this.goPreviousSlide();
    });

    this.right.addEventListener(`click`, (event) => {
      event.preventDefault();

      this.goNextSlide();
    });

    this.sliderDots[0].classList.add(`story-slider__pagination-bullet--active`);
    this.sliderDots.forEach((item, index) => {
      item.addEventListener(`click`, (event) => {
        event.preventDefault();
        document.querySelector(`.story-slider__pagination-bullet--active`).classList.remove(`story-slider__pagination-bullet--active`);
        item.classList.add(`story-slider__pagination-bullet--active`);
        let padding = parseInt(window.getComputedStyle(this.scroll.parentElement.parentElement, null).paddingLeft, 10);
        let newPosition = this.slides[index].offsetLeft - this.gap - padding;
        this.changeSlide(newPosition);
      });
    });

    // swipe detected
    this.scroll.addEventListener(`touchstart`, (event) => {
      event.preventDefault();
      this.startX = (event.touches || event.originalEvent.touches)[0].clientX;
    });

    this.scroll.addEventListener(`touchmove`, (event) => {
      event.preventDefault();
      if (!this.startX) {
        return;
      }

      const xDelta = this.startX - (event.touches || event.originalEvent.touches)[0].clientX;

      if (xDelta > 45) {
        this.goNextSlide();
        this.startX = null;
      } else if (xDelta < -45) {
        this.goPreviousSlide();
        this.startX = null;
      }
    });
  }

  // Предыдущий слайд
  goPreviousSlide() {
    if (this.canAnimate) {
      this.canAnimate = false;
      let activeDot = document.querySelector(`.story-slider__pagination-bullet--active`);

      let newPosition;
      if (!activeDot.nextElementSibling) {
        newPosition = this.scroll.scrollLeft - this.slides[0].offsetWidth + this.gap;
      } else {
        newPosition = this.scroll.scrollLeft - this.slides[0].offsetWidth;
      }

      this.changeSlide(newPosition);
      if (activeDot.previousElementSibling) {
        activeDot.previousElementSibling.classList.add(`story-slider__pagination-bullet--active`);
        activeDot.classList.remove(`story-slider__pagination-bullet--active`);
      }
    }
  }

  // Следующий слайд
  goNextSlide() {
    if (this.canAnimate) {
      this.canAnimate = false;
      let activeDot = document.querySelector(`.story-slider__pagination-bullet--active`);

      let newPosition;
      if (this.scroll.scrollLeft === 0) {
        newPosition = this.scroll.scrollLeft + this.slides[0].offsetWidth - this.gap;
      } else {
        newPosition = this.scroll.scrollLeft + this.slides[0].offsetWidth;
      }

      this.changeSlide(newPosition);
      if (activeDot.nextElementSibling) {
        activeDot.nextElementSibling.classList.add(`story-slider__pagination-bullet--active`);
        activeDot.classList.remove(`story-slider__pagination-bullet--active`);
      }
    }
  }

  changeSlide(newPosition) {
    anime({
      targets: this.scroll,
      scrollLeft: {
        value: newPosition,
        duration: 500,
        easing: `easeInOutCirc`,
      },
      complete: () => {
        this.canAnimate = true;
      },
    });
  }
}

class SliderSecond {
  constructor(element) {
    // переменные
    this.element = element;
    this.slidesContainer = this.element.querySelector(`.story-slider-second__post-wrapper`);
    this.scroll = this.element.querySelector(`.story-slider-second__wrapper`);
    this.slides = this.element.querySelectorAll(`.story-slider-second__image`);
    this.left = this.element.querySelector(`.story-slider-second__prev`);
    this.right = this.element.querySelector(`.story-slider-second__next`);
    this.sliderDots = Array.from(this.element.querySelectorAll(`.story-slider-second__dot`));
    this.canAnimate = true;
    this.currentIndex = 0;
    this.startX = null;

    // функции
    this.setListeners();
  }

  setListeners() {
    window.addEventListener(`orientationchange`, () => {
      setTimeout(() => {
        this.changeSlide();
      }, 1);
    });

    this.sliderDots.forEach((item, index) => {
      item.addEventListener(`click`, (event) => {
        event.preventDefault();
        this.currentIndex = index;
        this.changeSlide();
      });
    });

    this.left.addEventListener(`click`, (event) => {
      event.preventDefault();

      this.goPreviousSlide();
    });

    this.right.addEventListener(`click`, (event) => {
      event.preventDefault();

      this.goNextSlide();
    });

    // swipe detected
    this.slidesContainer.addEventListener(`touchstart`, (event) => {
      this.startX = (event.touches || event.originalEvent.touches)[0].clientX;
    });

    this.slidesContainer.addEventListener(`touchmove`, (event) => {
      if (!this.startX) {
        return;
      }

      const xDelta = this.startX - (event.touches || event.originalEvent.touches)[0].clientX;

      if (xDelta > 45) {
        this.goNextSlide();
        this.startX = null;
      } else if (xDelta < -45) {
        this.goPreviousSlide();
        this.startX = null;
      }
    });
  }

  // Предыдущий слайд
  goPreviousSlide() {
    if (this.canAnimate) {
      this.canAnimate = false;

      this.currentIndex -= 1;

      if (this.currentIndex <= 0) {
        this.currentIndex = 0;
      }

      this.changeSlide();
    }
  }

  // Следующий слайд
  goNextSlide() {
    if (this.canAnimate) {
      this.canAnimate = false;

      this.currentIndex += 1;

      if (this.currentIndex >= this.slides.length - 1) {
        this.currentIndex = this.slides.length - 1;
      }

      this.changeSlide();
    }
  }

  changeSlide() {
    const newPosition = this.scroll.offsetWidth * this.currentIndex;

    anime({
      targets: this.scroll,
      scrollLeft: {
        value: newPosition,
        duration: 500,
        easing: `easeInOutCirc`,
      },
      complete: () => {
        this.canAnimate = true;
      },
    });
  }
}

export const story = () => {

  document.addEventListener(`DOMContentLoaded`, () => {
    let storySlider = document.querySelector(`.story-slider`);
    let storySliderSecond = document.querySelector(`.story-slider-second`);
    let video = document.querySelector(`.story-content__player`);
    let menu = document.querySelector(`.story-content__right`);
    let videoButton = document.querySelector(`.story-content__controls`);
    let wrapper = document.querySelector(`.wrapper`);

    if (menu) {
      wrapper.style.overflowX = `visible`;
    }

    if (video) {
      videoButton.addEventListener(`click`, function () {
        if (!videoButton.classList.contains(`pause`)) {
          videoButton.classList.add(`pause`);
          video.play();
        } else {
          videoButton.classList.remove(`pause`);
          video.pause();
        }
      });

      video.addEventListener(`play`, function () {
        videoButton.classList.add(`pause`);
      });

      video.addEventListener(`pause`, function () {
        videoButton.classList.remove(`pause`);
      });
    }
    if (storySlider) {
      new Slider(storySlider);
    }
    if (storySliderSecond) {
      new SliderSecond(storySliderSecond);
    }
  });

};



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
