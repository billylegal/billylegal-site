(function(){
  var KEY = 'bl-theme', on = false;
  try { on = localStorage.getItem(KEY) === 'nebula'; } catch (e) {}
  function link(add) {
    var el = document.getElementById('nebula-css');
    if (add && !el) { el = document.createElement('link'); el.id = 'nebula-css'; el.rel = 'stylesheet'; el.href = 'assets/nebula.css?v=1'; document.head.appendChild(el); }
    if (!add && el) el.remove();
    if (add) document.documentElement.setAttribute('data-theme', 'nebula'); else document.documentElement.removeAttribute('data-theme');
  }
  // The stylesheet is appended after the page's own <style> (so it wins), which needs the whole <head> parsed first.
  document.addEventListener('DOMContentLoaded', function () {
    link(on);
    var b = document.createElement('button'); b.type = 'button'; b.id = 'themeBtn';
    b.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:50;font:600 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.18em;text-transform:uppercase;padding:10px 14px;border-radius:999px;cursor:pointer;background:rgba(10,10,12,.78);color:#fff;border:1px solid currentColor;backdrop-filter:blur(6px)';
    if (window.innerWidth < 600) { b.style.fontSize = '10px'; b.style.padding = '7px 10px'; b.style.left = '8px'; b.style.bottom = '8px'; b.style.opacity = '.92'; }
    function paint() { b.textContent = 'Theme: ' + (on ? 'Nebula' : 'Gold'); b.style.color = on ? '#CC8CFF' : '#F2D675'; }
    b.addEventListener('click', function () { on = !on; try { localStorage.setItem(KEY, on ? 'nebula' : 'gold'); } catch (e) {} link(on); paint(); });
    paint(); document.body.appendChild(b);
  });
})();
