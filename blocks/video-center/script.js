// Video Center Block - Modal Player
(function () {
  'use strict';

  function extractVideoId(url) {
    if (!url || typeof url !== 'string') { return null; }
    var match;
    match = url.match(/[?&]v=([^&#]+)/);
    if (match) { return match[1]; }
    match = url.match(/youtu\.be\/([^?&#]+)/);
    if (match) { return match[1]; }
    match = url.match(/youtube\.com\/embed\/([^?&#]+)/);
    if (match) { return match[1]; }
    return null;
  }

  document.querySelectorAll('.video-center').forEach(function (block) {
    var modal = block.querySelector('.video-center__modal');
    var player = block.querySelector('.video-center__modal-player');
    var closeBtn = block.querySelector('.video-center__modal-close');
    var backdrop = block.querySelector('.video-center__modal-backdrop');
    var activeElementBeforeModal;

    if (!modal || !player || !closeBtn || !backdrop) {
      return;
    }

    /* Auto-populate thumbnails from YouTube on page load */
    block.querySelectorAll('.video-center__card[data-video-type="youtube"]').forEach(function (card) {
      var img = card.querySelector('.video-center__thumb-img');
      if (!img) { return; }
      var id = extractVideoId(card.dataset.videoSrc || '');
      if (!id) { return; }
      var hq = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
      var max = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
      /* maxresdefault may not exist — probe it; fall back to hqdefault */
      var probe = new Image();
      probe.onload = function () {
        img.src = (probe.naturalWidth > 120) ? max : hq;
      };
      probe.onerror = function () { img.src = hq; };
      probe.src = max;
    });

    function openModal(videoType, videoSrc) {
      activeElementBeforeModal = document.activeElement;
      player.innerHTML = '';

      if (videoType === 'youtube') {
        var videoId = extractVideoId(videoSrc);
        if (!videoId) { return; }
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
        iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        player.appendChild(iframe);
      } else if (videoType === 'mp4') {
        var video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.setAttribute('playsinline', '');
        player.appendChild(video);
      }

      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeModal() {
      player.innerHTML = '';
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (activeElementBeforeModal) {
        activeElementBeforeModal.focus();
      }
    }

    block.querySelectorAll('.video-center__card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.video-center__watch-btn') || e.target.closest('.video-center__thumbnail') || e.currentTarget === card) {
          e.preventDefault();
          var videoType = card.dataset.videoType;
          var videoSrc = card.dataset.videoSrc;
          if (videoSrc) { openModal(videoType, videoSrc); }
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) { closeModal(); }
    });
  });
})();