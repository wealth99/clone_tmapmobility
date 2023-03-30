$(document).ready(function() {
    setSwiper();
    screenOverElemAnimation('.operate-service .list > li', changeOperateServiceImage);

    $('header').hover(
        function() {
        },
        function() {
            $(this).removeClass('active');
            $(this).find('li.active').removeClass('active');
        }
    );

    $('.gnb > li').hover(
        function() {
            $('header').addClass('active');
            $(this).addClass('active').siblings().removeClass('active');
        }
    );

    $(window).on('scroll', (e) => {
        const windowPosTop = $(window).scrollTop()
            , windowHeight = $(window).outerHeight()
            , operatePosTop = $('.operate-service').offset().top
            , operateHeight = $('.operate-service').outerHeight();

        if(windowPosTop >= operatePosTop) {
            $('.operate-service').find('.imgs').addClass('fixed');
        } else {
            $('.operate-service').find('.imgs').removeClass('fixed');
        }

        if(windowPosTop + windowHeight >= operatePosTop + operateHeight) {
            $('.operate-service').find('.imgs').removeClass('fixed').addClass('end');
        } else {
            $('.operate-service').find('.imgs').removeClass('end')
        }
    });

    $(document).on('click', '.indicator.dots', (e) => {
        if(e.target.nodeName === 'BUTTON') {
            const dotIndex = $(e.target).index() + 4;

            moveSwiperSlideTo(dotIndex);
        }
    });

    $(document).on('click', '.tab-list', handleTabListClick);

    $(document).on('click', '.next-btn', () => {
        const index = swiper.activeIndex;

        moveSwiperSlideTo(index + 1);
    });
});

let swiper, timer;
const setSwiper = () => {
    const enableSlideChange = () => {
        swiper.mousewheel.enable();
        swiper.allowTouchMove = true;
    }

    const disableSlideChange = () => {
        swiper.mousewheel.disable();
        swiper.allowTouchMove = false;
    }

    swiper = new Swiper('.main-swiper', {
        direction: "vertical", // 방향 (가로: horizontal, 세로: vertical)
        mousewheel: true, // 마우스 휠 지원 여부
        speed: 700, // 속도
        slidesPerView: 'auto',
        preventInteractionOnTransition: true,
        simulateTouch: false, // 터치 이벤트(pc)
        on: {
            init: function() {
                console.log('init');
            },
            slideChange: function() {
                console.log('slideChange')
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , $main = $('.main')
                    , $vision = $('.vision')
                    , $header = $('header');

                // main
                if($main.length > 0) {
                    const $indicatorLine = $('.indicator.line')
                        , $indicatorDots = $('.indicator.dots');
                    
                    if(index > 0 && index < 4) {
                        $indicatorLine.find('.dot').addClass('active');
                        $indicatorLine.animate({ top: '51.5%' }, 700);
                    } else {
                        if(index === 0) {
                            $indicatorLine.animate({ top: '103%' }, 700)
                        } else {
                            $indicatorLine.animate({ top: '-3%' }, 300)
                        }
                    }

                    if(index >= 4) {
                        $header.removeClass('invert');
                        $('video').get(0).pause();
                    } else {
                        $header.addClass('invert');
                        $('video').get(0).play();
                    }

                    if(index > 3 && index < 13) {
                        const dotIndex = index - 4;
                        $indicatorDots.children('.dot').eq(dotIndex).addClass('active').siblings().removeClass('active')
                        swiper.effect =  "creative",
                        swiper.creativeEffect = {
                            prev: {
                                translate: [0, 0, 0],
                            },
                            next: {
                                translate: [0, "100%", 0],
                            },
                        },
                        setTimeout(() => {
                            $indicatorDots.addClass('active');
                        }, 700);
                    } else {
                        $indicatorDots.removeClass('active');
                    }

                    if(index === 14) {
                        $('video').get(1).play();
                       
                    } else {
                        $('video').get(1).pause();
                    }
                }

                // vision
                if($vision.length > 0) {
                    const $bg = $('.bg');

                    if(index === 1) {
                        const $members = $('.number');

                        $members.each(function(index, item) {
                            increaseNumberAnimation(item, 1500);
                        });
                    }
                    
                    if(index >= 2) {
                        $bg.removeAttr('class');
                        $bg.addClass('bg active step')
                    } 
                    if(index === 3) {
                        $bg.removeAttr('class');
                        $bg.addClass('bg active step-02')
                    }
                    if(index === 4) {
                        $bg.removeAttr('class');
                        $bg.addClass('bg active step-03')
                    }
                    if(index >= 5) {
                        $header.removeClass('invert');
                    } else {
                        $header.addClass('invert');
                    }
                }
            },
            transitionStart: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , isAniObj = $slide.find('.ani-obj').length > 0;

                if(isAniObj) {
                    disableSlideChange();
                }

                if($('.indicator.line').length > 0) $('.indicator.line').find('.dot').addClass('active');
            },
            transitionEnd: function() {
                const index = this.activeIndex
                    , $slide = $(this.slides[index])
                    , isAniObj = $slide.find('.ani-obj').length > 0;
                
                if(isAniObj) {
                    if(!timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(() => {
                        enableSlideChange();
                    }, 400);
                }

                if($('.indicator.line').length > 0) $('.indicator.line').find('.dot').removeClass('active');
            }
        },
    });
}

const moveSwiperSlideTo = (index, direction = null) => {
    if(!direction) {
        swiper.slideTo(index, 700, true);
    } else {
        if(direction === 'top') {
            swiper.slideTo(index + 1, 700, true);
        } else if(direction === 'bottom') {
            swiper.slideTo(index - 1, 700, true);
        }
    }
}

const handleTabListClick = (e) => {
    const $tab = $(e.target)
        , $content = $(`#${$tab.attr('aria-controls')}`);
    
    $tab.addClass('active').siblings().removeClass('active');
    $tab.attr('aria-selected', true).siblings().attr('aria-selected', false);
    $content.addClass('active').siblings().removeClass('active');
}

const increaseNumberAnimation = (elem, duration) => {
    let startTimeStamp;
    const $target = $(elem)
        , start = $target.data('start-count')
        , end = $target.data('end-count');
    
    const step = (timestamp) => {
        if(!startTimeStamp) startTimeStamp = timestamp;
        const progress = Math.min((timestamp - startTimeStamp) / duration);
        $target.text(new Intl.NumberFormat('ko-KR').format(Math.floor(progress * (end - start) + start)));

        if(progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

const screenOverElemAnimation = (elem, func) => {
    let options = {
        threshold: 0.7
    }

    let observer = new IntersectionObserver((items) => {
        $(items).each((index, item) => {
            if(item.isIntersecting) {
                func(item);
            }
        });
    }, options);

    $(elem).each((index, item) => {
        observer.observe(item)
    });
}

const changeOperateServiceImage = (item) => {
    const $target = $(item.target)
        , index = $target.index()
        , img = $('.operate-service').find('.imgs');
        
    img.children().eq(index).addClass('active').siblings().removeClass('active')
}