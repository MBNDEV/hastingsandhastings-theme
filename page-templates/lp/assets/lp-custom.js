/*!
 * LP behaviours lifted out of the captured snapshot:
 *   1. settlement calculator odometer  (data-hh-idx buttons)
 *   2. testimonial slider              (#testimonials_lp — slides are built here)
 *   3. box slider rebuild              (.box-slider)
 *   4. awards carousel + custom arrows (ported from lander.js)
 *
 * The captured markup has slick's runtime DOM stripped back out of it, so
 * every slider on the page is initialised exactly once, from here.
 */
( function ( $ ) {
	'use strict';

	if ( ! $ ) {
		return;
	}

	$( function () {
		(function() {
		  var data = [
		    { s: 30000,   o: 10000,  h: 8700,   save: 1300  },
		    { s: 100000,  o: 33333,  h: 29000,  save: 4333  },
		    { s: 300000,  o: 100000, h: 87000,  save: 13000 },
		    { s: 1000000, o: 333333, h: 290000, save: 43333 }
		  ];
		  var fmt = function(n) { return '$' + n.toLocaleString('en-US'); };
		  var ITEM_H = 72;
		  var REPEAT = 10;

		  var widget = document.querySelector('.hh-fee-widget');
		  if (!widget) return;

		  // Adjust item height on mobile to match CSS
		  if (window.matchMedia && window.matchMedia('(max-width: 560px)').matches) {
		    ITEM_H = 60;
		  }

		  var stripS  = document.getElementById('hh-strip-s');
		  var stripO  = document.getElementById('hh-strip-o');
		  var stripH  = document.getElementById('hh-strip-h');
		  var saveVal = document.getElementById('hh-save-val');
		  var spinBtn = document.getElementById('hh-spin-btn');

		  function build(el, key, cls) {
		    var parts = [];
		    for (var r = 0; r < REPEAT + 1; r++) {
		      for (var i = 0; i < data.length; i++) {
		        parts.push('<div class="hh-item ' + cls + '">' + fmt(data[i][key]) + '</div>');
		      }
		    }
		    el.innerHTML = parts.join('');
		  }
		  build(stripS, 's', '');
		  build(stripO, 'o', 'hh-item-other');
		  build(stripH, 'h', 'hh-item-ours');

		  var currentIdx = 0;
		  var spinning = false;

		  function setPos(el, pos, trans) {
		    el.style.transition = trans || '';
		    el.style.transform = 'translateY(' + (-pos * ITEM_H) + 'px)';
		  }
		  setPos(stripS, 0, 'none');
		  setPos(stripO, 0, 'none');
		  setPos(stripH, 0, 'none');

		  function spin(targetIdx) {
		    if (spinning || targetIdx === currentIdx) return;
		    spinning = true;
		    spinBtn.disabled = true;

		    setPos(stripS, currentIdx, 'none');
		    setPos(stripO, currentIdx, 'none');
		    setPos(stripH, currentIdx, 'none');
		    void stripS.offsetHeight;

		    var d1 = 2400, d2 = 2800, d3 = 3200;
		    var ease = 'cubic-bezier(0.17, 0.67, 0.21, 0.99)';
		    var finalPos = REPEAT * data.length + targetIdx;
		    setPos(stripS, finalPos, 'transform ' + d1 + 'ms ' + ease);
		    setPos(stripO, finalPos, 'transform ' + d2 + 'ms ' + ease);
		    setPos(stripH, finalPos, 'transform ' + d3 + 'ms ' + ease);

		    var startSave = data[currentIdx].save;
		    var endSave   = data[targetIdx].save;
		    var start     = performance.now();

		    function tick(now) {
		      var t = Math.min((now - start) / d3, 1);
		      if (t < 0.88) {
		        var rnd = data[Math.floor(Math.random() * data.length)].save;
		        saveVal.textContent = fmt(rnd);
		      } else {
		        var localT = (t - 0.88) / 0.12;
		        var eased = 1 - Math.pow(1 - localT, 3);
		        saveVal.textContent = fmt(Math.round(startSave + (endSave - startSave) * eased));
		      }
		      if (t < 1) requestAnimationFrame(tick);
		      else saveVal.textContent = fmt(endSave);
		    }
		    requestAnimationFrame(tick);

		    setTimeout(function() {
		      setPos(stripS, targetIdx, 'none');
		      setPos(stripO, targetIdx, 'none');
		      setPos(stripH, targetIdx, 'none');
		      void stripS.offsetHeight;
		      currentIdx = targetIdx;
		      spinning = false;
		      spinBtn.disabled = false;
		    }, d3 + 80);
		  }

		  spinBtn.addEventListener('click', function() {
		    var next;
		    do { next = Math.floor(Math.random() * data.length); } while (next === currentIdx);
		    spin(next);
		  });

		  var btns = document.querySelectorAll('[data-hh-idx]');
		  for (var i = 0; i < btns.length; i++) {
		    (function(b) {
		      b.addEventListener('click', function() { spin(parseInt(b.dataset.hhIdx, 10)); });
		    })(btns[i]);
		  }

		  // Rebuild on resize if crossing the mobile breakpoint
		  var wasMobile = ITEM_H === 60;
		  window.addEventListener('resize', function() {
		    var isMobile = window.matchMedia('(max-width: 560px)').matches;
		    if (isMobile !== wasMobile) {
		      ITEM_H = isMobile ? 60 : 72;
		      wasMobile = isMobile;
		      setPos(stripS, currentIdx, 'none');
		      setPos(stripO, currentIdx, 'none');
		      setPos(stripH, currentIdx, 'none');
		    }
		  });
		})();

		(function() {
		  var testimonials = [
		    {
		      intro: 'I would highly recommend Hastings and Hastings to anyone I know.',
		      text: 'I was in a car accident a few months ago and could not be happier with the outcome. Sean Hennick, my attorney, along with all the other staff at Hastings and Hastings, were extremely professional and helpful. Having Hastings and Hastings by my side made this process seem easy. I would highly recommend Hastings and Hastings to anyone I know.'
		    },
		    {
		      intro: 'Anthony is my first choice to go to.',
		      text: 'Anthony handled my injury case out of the office off the 101 & Indian School. I’ve never been hurt before. Anthony explained everything step by step for me and I appreciate all his help. I’m hoping to never get hurt again, but if it happens Anthony is my first choice to go to.'
		    },
		    {
		      intro: 'It was great to not have to worry about anything.',
		      text: 'Hastings and Hastings is the best! Thank you so much for all the hard work you did but most of all, for just being there when I had questions. I used a different firm in my last accident (2006) and never thought I would use an attorney again. They acted nice at first but after signing they were horrible. At Hastings, Sean Hennick handled my case and was awesome. Ask for him if you can… I was so scared after my accident but after meeting him, I could tell he knew what I was going through and was going to help. After that, their office handled pretty much everything…I could focus on getting my life back to normal. It was great to not have to worry about anything…thank you. I would recommend them and specifically Sean to anyone.'
		    },
		    {
		      intro: 'I was very happy with the result!',
		      text: 'Hastings and Hastings handled my claim after I had tried to deal with insurance company myself. Erwin explained the whole process to me at the initial consultation and I was very happy with the result!'
		    },
		    {
		      intro: 'They are responsive to emails and follow up.',
		      text: 'They are great! They do preliminary questions to make sure that you aren’t wasting your time (or theirs). They stand up for you and do what is right for you. Can’t say enough positive comments on how they handled my case. They are responsive to emails and follow up. They only take legitimate cases and don’t subscribe to “frivolous” lawsuits.'
		    },
		    {
		      intro: 'I’m so pleased with my experience with them',
		      text: 'I can’t say how happy I am with Hastings & Hastings right now. I came to them about 9 months ago after my accident and today I received my settlement. Everyone there was very nice and helpful. My attorney’s paralegal always responded to my emails quickly which really impressed me. I’m so pleased with my experience with them that I had to write a review!'
		    }
		  ];

		  // The Spanish template supplies its own set through wp_localize_script().
		  if ( window.mbnLpData && window.mbnLpData.testimonials && window.mbnLpData.testimonials.length ) {
		    testimonials = window.mbnLpData.testimonials;
		  }

		  function esc(s) {
		    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		  }

		  function renderSlides() {
		    return testimonials.map(function(t) {
		      return '<div class="single_test">' +
		        '<span class="single_test_descrip">“' + esc(t.intro) + '”</span>' +
		        '<div class="single_test_content content">' + esc(t.text) + '</div>' +
		        '</div>';
		    }).join('');
		  }

		  function init() {
		    var wrap = document.getElementById('testimonials_lp');
		    if (!wrap) return;
		    var $ = window.jQuery;
		    if ($ && $.fn && $.fn.slick && $(wrap).hasClass('slick-initialized')) {
		      $(wrap).slick('unslick');
		    }
		    wrap.innerHTML = renderSlides();
		    if ($ && $.fn && $.fn.slick) {
		      $(wrap).slick({
		        slidesToShow: 2,
		        slidesToScroll: 1,
		        arrows: false,
		        dots: true,
		        infinite: true,
		        autoplay: true,
		        autoplaySpeed: 6000,
		        speed: 500,
		        pauseOnHover: true,
		        adaptiveHeight: true,
		        responsive: [
		          { breakpoint: 768, settings: { slidesToShow: 1 } }
		        ]
		      });
		    }
		  }

		  if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slick) {
		    init();
		  } else {
		    var tries = 0;
		    var iv = setInterval(function() {
		      tries++;
		      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slick) {
		        clearInterval(iv);
		        init();
		      } else if (tries > 150) {
		        clearInterval(iv);
		        init();
		      }
		    }, 100);
		  }
		})();

		(function() {
		  function init() {
		    var wrap = document.querySelector('.box-slider');
		    if (!wrap) return;

		    var realSlides = Array.prototype.slice
		      .call(wrap.querySelectorAll('.box-slide:not(.slick-cloned)'))
		      .map(function(el) { return el.cloneNode(true); });

		    if (!realSlides.length) return;

		    wrap.innerHTML = '';
		    realSlides.forEach(function(el) {
		      el.classList.remove('slick-slide', 'slick-cloned', 'slick-current', 'slick-active');
		      el.removeAttribute('style');
		      el.removeAttribute('aria-hidden');
		      el.removeAttribute('tabindex');
		      el.removeAttribute('data-slick-index');
		      el.style.cssText = 'width:270px;max-width:270px;flex:0 0 270px;';
		      wrap.appendChild(el);
		    });
		    wrap.classList.remove('slick-initialized', 'slick-slider');

		    var $ = window.jQuery;
		    if ($ && $.fn && $.fn.slick) {
		      $(wrap).slick({
		        variableWidth: true,
		        slidesToShow: 1,
		        slidesToScroll: 1,
		        arrows: false,   // the design's .custom-arrows drive this slider
		        dots: false,
		        infinite: true,
		        autoplay: true,
		        autoplaySpeed: 2000,
		        cssEase: 'ease-in-out',
		        speed: 500
		      });
		    }
		  }

		  if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slick) {
		    init();
		  } else {
		    var tries = 0;
		    var iv = setInterval(function() {
		      tries++;
		      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.slick) {
		        clearInterval(iv);
		        init();
		      } else if (tries > 150) {
		        clearInterval(iv);
		        init();
		      }
		    }, 100);
		  }
		})();

		/*
		 * Ported from lander.js: the awards carousel and the custom box-slider
		 * arrows were the only things it still owned once the three behaviours
		 * above took over #testimonials_lp and .box-slider, so lander.js is no
		 * longer loaded.
		 */
		(function() {
		  var awards = $( '.logo-award' );
		  var shown = 4;

		  if ( awards.length && $.fn.slick && ! awards.hasClass( 'slick-initialized' ) ) {
		    /*
		     * slick will not rotate while every slide already fits on screen, and
		     * there are only four award badges. Repeat the set until it outnumbers
		     * the visible slides: the carousel then moves, and the row looks no
		     * different at rest.
		     */
		    var originals = awards.children().clone( true );

		    while ( awards.children().length <= shown ) {
		      awards.append( originals.clone( true ) );
		    }

		    awards.slick( {
		      autoplay: true,
		      infinite: true,
		      slidesToShow: shown,
		      arrows: false,
		      autoplaySpeed: 2000,
		      centerMode: true,
		      speed: 600,
		      cssEase: 'ease-in-out',
		      responsive: [
		        { breakpoint: 1024, settings: { slidesToShow: 3 } },
		        { breakpoint: 768, settings: { slidesToShow: 2 } },
		        { breakpoint: 480, settings: { slidesToShow: 1 } }
		      ]
		    } );
		  }

		  $( '.custom-arrows .arrow-right' ).on( 'click', function ( e ) {
		    e.preventDefault();
		    $( '.box-slider' ).slick( 'slickNext' );
		  } );

		  $( '.custom-arrows .arrow-left' ).on( 'click', function ( e ) {
		    e.preventDefault();
		    $( '.box-slider' ).slick( 'slickPrev' );
		  } );
		})();
	} );
}( window.jQuery ) );
