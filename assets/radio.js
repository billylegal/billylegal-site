/* Billy Legal Radio: every song, shuffled, non-stop. Plays through YouTube's official embedded player.
   Nothing from YouTube is loaded until a visitor presses play. */
(function () {
  var SONGS = [["Do4kWzTEIfY","A BETTER LIFE"],["IRb9kwDQick","AMAZING"],["yiUSZmrr51Y","BEAUTIFUL LIFE (JADE MIX)"],["zyZ4r0mnT3U","BITCH STFU (DIRTY HAZE MIX)"],["p8M1YgULF4w","COME BACK TO ME (IN MY LIFE MIX)"],["cMvHwYE7glo","COME BACK TO ME (ORIGINAL MIX)"],["a53ZFt2wr3c","CRAZY (BUT I LOVE HER)"],["-nEDEC01ZxY","DON'T FORGET ME GIRL"],["Vm0oZaZwkvc","DON'T LEAVE ME (KING MIX)"],["zk5pgOMZARA","Empire Strikes"],["3zLrLiiDzFE","Feel Me Baby (Say What Mix)"],["VOzaHNYsCLg","Feel Me Baby (Up Mix)"],["mqrPQ3boHaI","Feel Me Baby (Water Mix)"],["PUoiJZfN0B4","Flight"],["b1KAoEMFFmA","FOMO - CHOOSIN TEXAS (Candy Mix)"],["fmAfPnokvq0","FRIEND (World Mix)"],["6wSu34DKPGk","HOT WOMAN"],["o2fYYVx-wPQ","I Can't Stop Loving You"],["cE0zQ8UJx8c","I Need Love (Twin Tech Mix)"],["Dqqo3g0P__o","I Smell That"],["IJjPyBSRXmo","I'M LEGAL"],["r2XT3zGoViE","I'M LOST (ORIGINAL MIX)"],["rTAtsO7nxKY","Juicy Red Lips (OG)"],["KkSvLYIkGbY","Juicy Red Lips (Part II)"],["4INyMzMkoAo","Juicy Red Lips (Sugar Mix)"],["-VXKSaWutQE","Lets Dance"],["IRYI5dW5MwY","Lost In The Shuffle"],["c3ICxLzrHsg","Love You Forever (Bongo Mix)"],["6lzmH4kDa7U","Love You Forever (Original Mix)"],["WNKSqIZvMRQ","LOVELY DAYS (DEEP MIX)"],["wUpTLj4Rst8","Mental (Dark Mix )"],["gVEMfgoQ6fI","Missing You Brother"],["FnlVYanztRo","Money Power Respect (Cash Mix)"],["epkHYYY3ZKo","Money Power Respect (Dirty Tape Mix)"],["mDxH6r6Y3Ik","Money Power Respect (Drive Mix)"],["PNKO_D8xS3g","Money Power Respect (Original Mix)"],["zaWXGdarnWw","Money Power Respect (Short Cut Mix)"],["qRPjl63-ZDc","Money Power Respect (Tik Tok Mix)"],["nW6tnjCMqWw","PICK ME UP (SUNRISE MIX)"],["ArS9GkO2K0s","PICK ME UP (SUNSET MIX)"],["w6j9H7sWGIQ","SHE'S LEGAL (MAIN MIX)"],["TYCU6jGVA4I","SHE'S LEGAL (REAL DIRTY MIX)"],["8JO7m_whSPc","SOUND AMAZING (MAIN MIX)"],["nqk-zxB-g2Y","Special Tonight (Reggae Mix)"],["XWvAIwbTHLI","Special Tonight (The Drug Mix)"],["1jkm6nG_kHg","THE DICEMAN"],["-MWXU4Bt1uY","TRAP GIRL"],["dUTnFzDKCuY","Yes The People"]];
  var $ = function (id) { return document.getElementById(id); };
  var box = $('radio'), btn = $('rplay'), song = $('rsong'), panel = $('rpanel');
  if (!box) return;
  var player = null, queue = [], pos = -1, errs = 0, playing = false, started = false;

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
  function playPos(p) {
    if (p >= queue.length) refill(queue.length ? queue[queue.length - 1][0] : null), p = 0;
    if (p < 0) p = 0;
    pos = p; var s = queue[pos]; setTitle(s[1]);
    player.loadVideoById(s[0]);
  }
  function next() { if (!player) return; playPos(pos + 1); }
  function prev() { if (!player) return; playPos(pos - 1); }
  function onState(e) {
    var S = window.YT.PlayerState;
    if (e.data === S.PLAYING) { playing = true; errs = 0; setIcon(); }
    else if (e.data === S.PAUSED) { playing = false; setIcon(); }
    else if (e.data === S.ENDED) { next(); }
  }
  function onError() {
    if (++errs >= 6) { playing = false; setIcon(); setTitle('Radio is unavailable right now. Listen on Spotify below.'); return; }
    next();
  }
  function init() {
    player = new window.YT.Player('rplayer', {
      width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com',
      playerVars: { playsinline: 1, rel: 0, modestbranding: 1, iv_load_policy: 3, origin: location.origin },
      events: { onReady: function () { refill(); playPos(0); }, onStateChange: onState, onError: onError }
    });
  }
  function start() {
    started = true; panel.hidden = false; box.classList.add('open'); setTitle('TUNING IN...');
    if (window.YT && window.YT.Player) { init(); return; }
    window.onYouTubeIframeAPIReady = init;
    var s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.async = true; document.head.appendChild(s);
  }
  btn.addEventListener('click', function () {
    if (!started) { start(); return; }
    if (!player || !player.getPlayerState) return;
    if (playing) player.pauseVideo(); else player.playVideo();
  });
  $('rnext').addEventListener('click', function () { if (!started) start(); else next(); });
  $('rprev').addEventListener('click', function () { if (!started) start(); else prev(); });
})();
