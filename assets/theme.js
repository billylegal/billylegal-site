(function(){
  var KEY = 'bl-theme';
  var THEMES = {
    gold:   { label: 'Gold',   color: '#F2D675', file: null },
    nebula: { label: 'Nebula', color: '#CC8CFF', file: 'assets/nebula.css?v=1' },
    greece: { label: 'Greece', color: '#7EC8E3', file: 'assets/greece.css?v=1' }
  };
  var ORDER = ['gold', 'nebula', 'greece'];
  var cur = 'gold';
  try {
    var saved = localStorage.getItem(KEY);
    if (saved && THEMES[saved]) cur = saved;
  } catch (e) {}

  function link(name) {
    var old = document.getElementById('theme-css');
    if (old) old.remove();
    var spec = THEMES[name];
    if (spec && spec.file) {
      var el = document.createElement('link');
      el.id = 'theme-css';
      el.rel = 'stylesheet';
      el.href = spec.file;
      document.head.appendChild(el);
      document.documentElement.setAttribute('data-theme', name);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // The stylesheet is appended after the page's own <style> (so it wins), which needs the whole <head> parsed first.
  document.addEventListener('DOMContentLoaded', function () {
    link(cur);
    var b = document.createElement('button'); b.type = 'button'; b.id = 'themeBtn';
    // desktop: floats bottom-left; phones: sits in the top bar where the Follow button used to be
    var DESK = 'position:fixed;left:14px;bottom:14px;z-index:50;font:600 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.18em;text-transform:uppercase;padding:10px 14px;border-radius:999px;cursor:pointer;background:rgba(10,10,12,.78);border:1px solid currentColor;backdrop-filter:blur(6px)';
    var MOB = 'position:static;margin-left:4px;font:700 11px/1 "Barlow Condensed",sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:9px 11px;border-radius:999px;cursor:pointer;background:rgba(10,10,12,.78);border:1px solid currentColor;white-space:nowrap';
    function paint() {
      var spec = THEMES[cur];
      b.textContent = 'Theme: ' + spec.label;
      b.style.color = spec.color;
    }
    function place() {
      var nav = document.querySelector('header.top nav'), mob = window.innerWidth <= 820 && nav;
      if (mob) { if (b.parentNode !== nav) nav.appendChild(b); b.style.cssText = MOB; }
      else { if (b.parentNode !== document.body) document.body.appendChild(b); b.style.cssText = DESK; }
      paint();
    }
    b.addEventListener('click', function () {
      var i = ORDER.indexOf(cur);
      cur = ORDER[(i + 1) % ORDER.length];
      try { localStorage.setItem(KEY, cur); } catch (e) {}
      link(cur); paint();
    });
    window.addEventListener('resize', place);
    document.body.appendChild(b); place();
  });
})();
