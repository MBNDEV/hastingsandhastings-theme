(function () {
	'use strict';

	// ── Accordion ──────────────────────────────────────────────────────────────
	const allToggles = document.querySelectorAll( '.handwritten-reviews__toggle' );

	function closeAll( except ) {
		allToggles.forEach( function ( btn ) {
			if ( btn === except ) {
				return;
			}
			btn.setAttribute( 'aria-expanded', 'false' );
			const panel = document.getElementById( btn.getAttribute( 'aria-controls' ) );
			if ( panel ) {
				panel.hidden = true;
			}
		} );
	}

	allToggles.forEach( function ( btn ) {
		btn.addEventListener( 'click', function () {
			const expanded = this.getAttribute( 'aria-expanded' ) === 'true';
			if ( ! expanded ) {
				closeAll( this );
			}
			this.setAttribute( 'aria-expanded', String( ! expanded ) );
			const panel = document.getElementById( this.getAttribute( 'aria-controls' ) );
			if ( panel ) {
				panel.hidden = expanded;
			}
		} );
	} );

	// ── Lightbox ───────────────────────────────────────────────────────────────
	const lightbox = document.getElementById( 'reviews-lightbox' );
	const lbImg = document.getElementById( 'lightbox-img' );
	const lbCounter = document.getElementById( 'lightbox-counter' );
	const lbClose = document.querySelector( '.handwritten-reviews__lightbox-close' );
	const lbPrev = document.querySelector( '.handwritten-reviews__lightbox-prev' );
	const lbNext = document.querySelector( '.handwritten-reviews__lightbox-next' );
	const lbOverlay = document.querySelector( '.handwritten-reviews__lightbox-overlay' );

	// Early return if lightbox elements don't exist
	if (
		! lightbox ||
		! lbImg ||
		! lbCounter ||
		! lbClose ||
		! lbPrev ||
		! lbNext ||
		! lbOverlay
	) {
		return;
	}

	let currentImages = [];
	let currentIndex = 0;

	function openLightbox( imgs, idx ) {
		currentImages = imgs;
		currentIndex = idx;
		render();
		lightbox.hidden = false;
		document.body.classList.add( 'lightbox-open' );
		lbClose.focus();
	}

	function closeLightbox() {
		lightbox.hidden = true;
		document.body.classList.remove( 'lightbox-open' );
	}

	function render() {
		const img = currentImages[ currentIndex ];
		lbImg.src = img.src;
		lbImg.alt = img.alt;
		lbCounter.textContent = currentIndex + 1 + ' / ' + currentImages.length;
		lbPrev.disabled = currentIndex === 0;
		lbNext.disabled = currentIndex === currentImages.length - 1;
	}

	document
		.querySelectorAll( '.handwritten-reviews__lightbox-trigger' )
		.forEach( function ( a ) {
			a.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				const panel = this.closest( '.handwritten-reviews__panel' );
				const allImgs = Array.from(
					panel.querySelectorAll( '.handwritten-reviews__lightbox-trigger img' )
				);
				const clicked = this.querySelector( 'img' );
				openLightbox( allImgs, allImgs.indexOf( clicked ) );
			} );
		} );

	lbClose.addEventListener( 'click', closeLightbox );
	lbOverlay.addEventListener( 'click', closeLightbox );
	lbPrev.addEventListener( 'click', function () {
		if ( currentIndex > 0 ) {
			currentIndex--;
			render();
		}
	} );
	lbNext.addEventListener( 'click', function () {
		if ( currentIndex < currentImages.length - 1 ) {
			currentIndex++;
			render();
		}
	} );

	document.addEventListener( 'keydown', function ( e ) {
		if ( lightbox.hidden ) {
			return;
		}
		if ( e.key === 'Escape' ) {
			closeLightbox();
		}
		if ( e.key === 'ArrowLeft' ) {
			if ( currentIndex > 0 ) {
				currentIndex--;
				render();
			}
		}
		if ( e.key === 'ArrowRight' ) {
			if ( currentIndex < currentImages.length - 1 ) {
				currentIndex++;
				render();
			}
		}
	} );
}() );
