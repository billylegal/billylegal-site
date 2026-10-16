/* Billy Legal Radio: every song, shuffled, non-stop. Plays Billy Legal's own MP3 files from this site (/music). No YouTube, no ads. */
(function () {
  var SONGS = [["Do4kWzTEIfY", "A BETTER LIFE"], ["IRb9kwDQick", "AMAZING"], ["yiUSZmrr51Y", "BEAUTIFUL LIFE (JADE MIX)"], ["zyZ4r0mnT3U", "BITCH STFU (DIRTY HAZE MIX)"], ["p8M1YgULF4w", "COME BACK TO ME (IN MY LIFE MIX)"], ["cMvHwYE7glo", "COME BACK TO ME (ORIGINAL MIX)"], ["a53ZFt2wr3c", "CRAZY (BUT I LOVE HER)"], ["-nEDEC01ZxY", "DON'T FORGET ME GIRL"], ["Vm0oZaZwkvc", "DON'T LEAVE ME (KING MIX)"], ["zk5pgOMZARA", "Empire Strikes"], ["3zLrLiiDzFE", "Feel Me Baby (Say What Mix)"], ["VOzaHNYsCLg", "Feel Me Baby (Up Mix)"], ["mqrPQ3boHaI", "Feel Me Baby (Water Mix)"], ["PUoiJZfN0B4", "Flight"], ["fmAfPnokvq0", "FRIEND (World Mix)"], ["6wSu34DKPGk", "HOT WOMAN"], ["o2fYYVx-wPQ", "I Can't Stop Loving You"], ["cE0zQ8UJx8c", "I Need Love (Twin Tech Mix)"], ["Dqqo3g0P__o", "I Smell That"], ["IJjPyBSRXmo", "I'M LEGAL"], ["r2XT3zGoViE", "I'M LOST (ORIGINAL MIX)"], ["rTAtsO7nxKY", "Juicy Red Lips (OG)"], ["KkSvLYIkGbY", "Juicy Red Lips (Part II)"], ["4INyMzMkoAo", "Juicy Red Lips (Sugar Mix)"], ["-VXKSaWutQE", "Lets Dance"], ["IRYI5dW5MwY", "Lost In The Shuffle"], ["c3ICxLzrHsg", "Love You Forever (Bongo Mix)"], ["6lzmH4kDa7U", "Love You Forever (Original Mix)"], ["WNKSqIZvMRQ", "LOVELY DAYS (DEEP MIX)"], ["wUpTLj4Rst8", "Mental (Dark Mix )"], ["gVEMfgoQ6fI", "Missing You Brother"], ["FnlVYanztRo", "Money Power Respect (Cash Mix)"], ["epkHYYY3ZKo", "Money Power Respect (Dirty Tape Mix)"], ["mDxH6r6Y3Ik", "Money Power Respect (Drive Mix)"], ["PNKO_D8xS3g", "Money Power Respect (Original Mix)"], ["zaWXGdarnWw", "Money Power Respect (Short Cut Mix)"], ["qRPjl63-ZDc", "Money Power Respect (Tik Tok Mix)"], ["nW6tnjCMqWw", "PICK ME UP (SUNRISE MIX)"], ["ArS9GkO2K0s", "PICK ME UP (SUNSET MIX)"], ["w6j9H7sWGIQ", "SHE'S LEGAL (MAIN MIX)"], ["TYCU6jGVA4I", "SHE'S LEGAL (REAL DIRTY MIX)"], ["8JO7m_whSPc", "SOUND AMAZING (MAIN MIX)"], ["nqk-zxB-g2Y", "Special Tonight (Reggae Mix)"], ["XWvAIwbTHLI", "Special Tonight (The Drug Mix)"], ["1jkm6nG_kHg", "THE DICEMAN"], ["-MWXU4Bt1uY", "TRAP GIRL"], ["dUTnFzDKCuY", "Yes The People"]];
  var $ = function (id) { return document.getElementById(id); };
  var box = $('radio'), btn = $('rplay'), song = $('rsong');
  if (!box) return;
  var audio = null, queue = [], pos = -1, errs = 0, playing = false, started = false;

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function refill(avoid) { queue = shuffle(SONGS); if (avoid && queue[0][0] === avoid && queue.length > 1) queue.push(queue.shift()); pos = -1; }
  function setTitle(t) {
    song.textContent = t; song.classList.remove('scroll');
    song.style.removeProperty('--shift');
    requestAnimationFrame(function () {
      var over = song.scrollWidth - song.parentNode.clientWidth;
      if (over > 4) { song.style.setProperty('--shift', '-' + (over + 24) + 'px'); song.style.setProperty('--dur', Math.max(8, (over + 24) / 28) + 's'); song.classList.add('scroll'); }
    });
  }
  function setIcon() { btn.setAttribute('aria-label', playing ? 'Pause Billy Legal Radio' : 'Play Billy Legal Radio'); box.classList.toggle('on', playing); }
  function meta(s) {
    if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
    try { navigator.mediaSession.metadata = new MediaMetadata({ title: s[1], artist: 'Billy Legal', album: 'Billy Legal Radio' }); } catch (e) {}
  }
  function playPos(p) {
    if (p >= queue.length) refill(queue.length ? queue[queue.length - 1][0] : null), p = 0;
    if (p < 0) p = 0;
    pos = p; var s = queue[pos]; setTitle(s[1]); meta(s);
    audio.src = 'music/' + encodeURIComponent(s[0]) + '.mp3';
    var pr = audio.play(); if (pr && pr.catch) pr.catch(function () { playing = false; setIcon(); });
  }
  function next() { if (audio) playPos(pos + 1); }
  function prev() { if (audio) playPos(pos - 1); }
  function start() {
    started = true; box.classList.add('open'); setTitle('TUNING IN...');
    audio = new Audio(); audio.preload = 'auto';
    audio.addEventListener('playing', function () { playing = true; errs = 0; setIcon(); });
    audio.addEventListener('pause', function () { if (!audio.ended) { playing = false; setIcon(); } });
    audio.addEventListener('ended', next);
    audio.addEventListener('error', function () {
      if (++errs >= 6) { playing = false; setIcon(); setTitle('Radio is unavailable right now. Listen on Spotify below.'); return; }
      next();
    });
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', function () { audio.play(); });
        navigator.mediaSession.setActionHandler('pause', function () { audio.pause(); });
        navigator.mediaSession.setActionHandler('nexttrack', next);
        navigator.mediaSession.setActionHandler('previoustrack', prev);
      } catch (e) {}
    }
    refill(); playPos(0);
  }
  btn.addEventListener('click', function () {
    if (!started) { start(); return; }
    if (playing) audio.pause(); else audio.play();
  });
  $('rnext').addEventListener('click', function () { if (!started) start(); else next(); });
  $('rprev').addEventListener('click', function () { if (!started) start(); else prev(); });
})();
