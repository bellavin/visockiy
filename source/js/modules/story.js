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


