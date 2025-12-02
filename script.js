// script.js - gestion des carrousels (Option A)
document.addEventListener('DOMContentLoaded', () => {
  const CAROUSEL_STEP = 1; // nombre d'items par "scroll" (on scrollera la largeur visible)
  const tracks = Array.from(document.querySelectorAll('.carousel-track'));
  // initialisation par track
  tracks.forEach(track => {
    setupTrack(track);
  });

  // délégation boutons
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.carousel-btn');
    if (!btn) return;
    const key = btn.getAttribute('data-carousel');
    const dir = btn.classList.contains('left') ? -1 : 1;
    const track = document.querySelector(`.carousel-track[data-carousel="${key}"]`);
    if (track) scrollOne(track, dir);
  });

  // helper : setup track (add swipe + wheel)
  function setupTrack(track){
    // make sure items are visible width-based
    track._items = Array.from(track.children);
    // touch swipe
    let startX = 0, isDown=false;
    track.addEventListener('pointerdown', (e)=>{
      isDown=true; startX = e.clientX; track.style.scrollBehavior='auto';
    });
    document.addEventListener('pointerup', (e)=>{
      if(!isDown) return;
      isDown=false; track.style.scrollBehavior='smooth';
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 30) scrollByPixels(track, diff);
    });
    // wheel to scroll horizontally (desktop)
    track.addEventListener('wheel', (e)=>{
      if(Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        // convert vertical wheel to horizontal scroll
        track.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, {passive:false});

    // optional autoplay if data-autoplay="true"
    if(track.dataset.autoplay === "true"){
      setInterval(()=>{ scrollOne(track, 1); }, 5000);
    }
  }

  // scrollOne : scroll by visible width (one "page" of items)
  function scrollOne(track, dir=1){
    const viewport = track.clientWidth;
    // scroll by viewport amount
    const target = track.scrollLeft + dir * (viewport * 0.9);
    track.scrollTo({left: target, behavior:'smooth'});
  }

  function scrollByPixels(track, diff){
    // diff positive -> swipe left -> move right
    const dir = diff>0 ? 1 : -1;
    scrollOne(track, dir);
  }

  // utility: if container is resized, we can snap to start (optional)
  window.addEventListener('resize', () => {
    tracks.forEach(t => {
      // ensure no fractional remains (optional)
      // t.scrollLeft = Math.round(t.scrollLeft);
    });
  });
});