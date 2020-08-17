// wow = new WOW({
//     boxClass:     'wow',      
//     animateClass: 'animated', 
//     offset:       0,          
//     mobile:       false,       
//     live:         true        
// })
// wow.init();

function sliders() {
    $('.cat--unit__for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.cat--unit__nav'
    });
    $('.cat--unit__nav').slick({
        autoplay: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.cat--unit__for',
        dots: false,
        arrows: true,
        focusOnSelect: true,
        vertical: false,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });
}

sliders();

$(function(){
    $('.open--modal').on('click', function(){
        var modal = $(this).attr('data-modal');
        $(modal).fadeIn();
        return false;
    });
    $('.modal .close, .modal__layer').on('click', function(){
        $(this).parents('.modal').fadeOut();
        return false;
    });

    $('.nav--btn').on('click', function(){
        if ($('.down-nv-list').is(':visible')) {
            $('.down-nv-list').slideUp();
            $('body').css({'overflow': 'visible'});
            $(this).removeClass('open');
        } else {
            $('.down-nv-list').slideDown();
            $('body').css({'overflow': 'hidden'});
            $(this).addClass('open');
        }
        return false;
    });

    $('.tel').inputmask('+7 (999) 999-99-99');
});

$(window).on("load",function(e){
    if ($(window).width() <= '1025'){
        $('header .submenu > a').on('click', function(){
            $(this).next().slideToggle();
            $('.preload').addClass('load').removeClass('loadR');
            return false;
        });
        $('header .submenu > a').attr('href', '#');
        $('.submenu').on('mouseleave', function(){
            $(this).children('.submenu__block').slideUp();
        });
    } else {
        $('header .submenu > a').on('mouseover', function(){
            $(this).next().fadeIn();
        });
        $('.submenu').on('mouseleave', function(){
            $(this).children('.submenu__block').fadeOut();
        });
    }
});

setTimeout(function(){
    $('.preload').addClass('load');
    wow = new WOW({
        boxClass:     'wow',      
        animateClass: 'animated', 
        offset:       0,          
        mobile:       false,       
        live:         true        
    })
    wow.init();
}, 600);

$('a:not([href^="mailto\\:"], [href$="\\#"], [href^="tel\\:"], [target="_blank"], [data-fancybox])').click(function(e) {
    var anchor = $(this), h;
    h = anchor.attr('href');
    e.preventDefault();
    setTimeout(function(){
        window.location = h;
    }, 250);
    $('.preload').addClass('loadR');
});

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload() 
    }
};

// $(function(){
//     $('.btn--up').bind('click.smoothscroll',function (e) {
//         e.preventDefault();
//         var target = this.hash,
//         $target = $(target);

//         $('html, body').stop().animate({
//             'scrollTop': $target.offset().top
//             }, 1000, 'swing', function () {
//             window.location.hash = target;
//         });
//     });

//     $(window).scroll(function(){
//         var bo = $(this).scrollTop();
//         var a = $(".btn--up").css('opacity')
//         if ( bo >= 200 && a == 0) {$(".btn--up").stop().animate({'opacity':'1'},400)};
//         if ( bo < 200 && a == 1) {$(".btn--up").stop().animate({'opacity':'0'},400)};
//     });
// });


/* lazyload 2 */
    /*!
 * Lazy Load - JavaScript plugin for lazy loading images
 *
 * Copyright (c) 2007-2019 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://appelsiini.net/projects/lazyload
 *
 * Version: 2.0.0-rc.2
 *
 */

(function (root, factory) {
if (typeof exports === "object") {
    module.exports = factory(root);
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.LazyLoad = factory(root);
    }
}) (typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    "use strict";

    if (typeof define === "function" && define.amd){
        root = window;
    }

    const defaults = {
        src: "data-src",
        srcset: "data-srcset",
        selector: ".lazyload",
        root: null,
        rootMargin: "0px",
        threshold: 0
    };

    /**
    * Merge two or more objects. Returns a new object.
    * @private
    * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
    * @param {Object}   objects  The objects to merge together
    * @returns {Object}          Merged values of defaults and options
    */
    const extend = function ()  {

        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
            deep = arguments[0];
            i++;
        }

        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    function LazyLoad(images, options) {
        this.settings = extend(defaults, options || {});
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.init();
    }

    LazyLoad.prototype = {
        init: function() {

            /* Without observers load everything and bail out early. */
            if (!root.IntersectionObserver) {
                this.loadImages();
                return;
            }

            let self = this;
            let observerConfig = {
                root: this.settings.root,
                rootMargin: this.settings.rootMargin,
                threshold: [this.settings.threshold]
            };

            this.observer = new IntersectionObserver(function(entries) {
                Array.prototype.forEach.call(entries, function (entry) {
                    if (entry.isIntersecting) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src);
                        let srcset = entry.target.getAttribute(self.settings.srcset);
                        if ("img" === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src;
                            }
                            if (srcset) {
                                entry.target.srcset = srcset;
                            }
                        } else {
                            entry.target.style.backgroundImage = "url(" + src + ")";
                        }
                    }
                });
            }, observerConfig);

            Array.prototype.forEach.call(this.images, function (image) {
                self.observer.observe(image);
            });
        },

        loadAndDestroy: function () {
            if (!this.settings) { return; }
            this.loadImages();
            this.destroy();
        },

        loadImages: function () {
            if (!this.settings) { return; }

            let self = this;
            Array.prototype.forEach.call(this.images, function (image) {
                let src = image.getAttribute(self.settings.src);
                let srcset = image.getAttribute(self.settings.srcset);
                if ("img" === image.tagName.toLowerCase()) {
                    if (src) {
                        image.src = src;
                    }
                    if (srcset) {
                        image.srcset = srcset;
                    }
                } else {
                    image.style.backgroundImage = "url('" + src + "')";
                }
            });
        },

        destroy: function () {
            if (!this.settings) { return; }
            this.observer.disconnect();
            this.settings = null;
        }
    };

    root.lazyload = function(images, options) {
        return new LazyLoad(images, options);
    };

    if (root.jQuery) {
        const $ = root.jQuery;
        $.fn.lazyload = function (options) {
            options = options || {};
            options.attribute = options.attribute || "data-src";
            new LazyLoad($.makeArray(this), options);
            return this;
        };
    }

    return LazyLoad;
});


$('[data-src]').lazyload();

$(document).ready(function(){

    // for (let plus of Array.from($(".counter .plus"))) {
    //     plus.click(function(e) {
    //         let count = $(this).siblings('input').val();
    //         count++;
    //         $(this).siblings('input').attr('value', count);
    //         if ($(this).siblings('input').val() >=10) {
    //             $(this).siblings('input').css({'width': '25px', 'margin-right': '0'})
    //         }
    //     });
    // }

    $('.searchbtn').on('click', function() {
        $('.searchinput').toggleClass('shown');
    })



    $(".counter .plus").click(function() {
        let input = $(this).siblings('input');
        let count = input.val();
        count++;
        input.attr('value', count);
        if (input.val() >=10) {
            input.css({'width': '25px', 'margin-right': '0'})
        }
    });
    $(".counter .minus").click(function() {
        let input = $(this).siblings('input');
        let count = input.val();
        if (count <= 0) return;
        count--;
        input.attr('value', count);
        if (input.val() < 10) {
            input.css({'width': '17px', 'margin-right': '0'})
        }
    })

    $('.search-icon').on('click', function(){
        if (!$('#search-bar').is(':visible')) {
          $('#search-bar').slideDown();
        }
         else {
          $('#search-bar').slideUp();
        }
      });

      $('.dropdown .arr').on('click', function(){
        if (!$(this).siblings('.dropdown-menu').is(':visible')) {
          $(this).siblings('.dropdown-menu').slideDown();
          $(this).parent().addClass('open');
        }
         else {
          $('.dropdown-menu').slideUp();
          $(this).parent().removeClass('open');
        }
      });

      $('.the-slider').slick({
          dots: true
      });

      $('.else-slider').slick({
        dots: true,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 700,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
                breakpoint: 450,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }]
    });

      $('.news-slider').slick({
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1285,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true
              }
            },
        {
            breakpoint: 1028,
            settings: {
                slidesToShow: 2
            }},
            {
            breakpoint: 810,
            settings: {
                slidesToShow: 1
            }
        }]
        })

      $('.pop-slider').slick({
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1285,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true
                }
            },
        {
            breakpoint: 1028,
            settings: {
                slidesToShow: 2
            }},
            {
            breakpoint: 810,
            settings: {
                slidesToShow: 1
            }
        }]
        })

      $('.sale-slider').slick({
        slidesToShow: 4,
        responsive: [
            {
                breakpoint: 1285,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  infinite: true
                }
            },
        {
            breakpoint: 1028,
            settings: {
                slidesToShow: 2
            }},
            {
            breakpoint: 810,
            settings: {
                slidesToShow: 1
            }
        }]
        })


      $('.vid-slider').slick({
        slidesToShow: 1,
        dots: true
      })
      $('.inst-slider').slick({
        slidesToShow: 6,
        dots: false,
        autoplay: true,
        autoplaySpeed: 1,
        speed: 90000,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 1679,
                settings: {
                  slidesToShow: 5,
                  slidesToScroll: 3,
                  infinite: true,
                }
            },
            {
                breakpoint: 1210,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 3,
                  infinite: true,
                }
              },
              {
                breakpoint: 810,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  infinite: true,
                }
              },
            //   {
            //     breakpoint: 590,
            //     settings: {
            //       slidesToShow: 1,
            //       slidesToScroll: 2,
            //       infinite: true,
            //     }
            //   },
        ]
      })


    // $('.tabs-head a').click(function(){
	// 	$('.tab-b').css({'opacity': '0'});
    //     $('.tab-b').filter(this.hash).css({'opacity': '1'}); 
	// 	$('.tabs-head a').removeClass('active');
    //     $(this).addClass('active');
    //     return false;
    // })

    $('.tabs-head li a').click(function(){
        event.preventDefault();
        if(!$(this).hasClass('active')){ //this is the start of our condition 
      
          $('.tabs-head li a').removeClass('active');           
          $(this).addClass('active');
      
          $('.tab-b').hide();
          $($('.tabs-head a.active').data("tab")).fadeIn('slow');
          return false;
       }
       return false;
      });
      
      easydropdown.all();

      $('body').on('click', '.password-checkbox', function(){
        let id = '#' + $(this).attr('for')
        if ($(this).is(':checked')){
            $(id).attr('type', 'text');
        } else {
            $(id).attr('type', 'password');
        }
        }); 

    //   $('body').on('click', '.password-checkbox', function(){
    //     if ($(this).is(':checked')){
    //         $('#password-input').attr('type', 'text');
    //     } else {
    //         $('#password-input').attr('type', 'password');
    //     }
    // }); 
    $('.btn-remove').on('click', function() {
        $(this).parents('.cart-unit').fadeOut();
    })

    $('#show-cat').on('click', function() {
        $('#h-catalog').toggleClass('opened');
    })
    $('#h-catalog').on('click', function() {
        $('#h-catalog').toggleClass('opened');
    })
    $('#h-catalog .side-catalog .s-c-container .img-c .btn-remove').on('click', function() {
        event.stopPropagation();
        $('#h-catalog').toggleClass('opened');
    })

    $('#show-nav').on('click', function() {
        $('#h-m-nav').toggleClass('opened');
    })
    $('#h-m-nav').on('click', function() {
        $('#h-m-nav').toggleClass('opened');
    })
    $('#h-m-nav .side-catalog .s-c-container .img-c .btn-remove').on('click', function() {
        event.stopPropagation();
        $('#h-m-nav').toggleClass('opened');
    })
    
})