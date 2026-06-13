/* NAVLYS Hero Background Slideshow — KenBurns crossfade (BM 27 mai)
   Usage: window.NV_HERO_BG(['/bg-1.jpg','/bg-2.jpg','/bg-3.jpg'], {durationPerSlide:8000,fadeTime:2000}); */
(function(global){
  global.NV_HERO_BG = function(images, options){
    if(!images || images.length===0) return;
    var o = Object.assign({durationPerSlide:9000, fadeTime:2500, parallax:true, kenburns:true, mountSelector:null}, options||{});

    // Inject CSS
    if(!document.getElementById('nv-hero-bg-css')){
      var s = document.createElement('style');
      s.id = 'nv-hero-bg-css';
      s.textContent = `
        .nv-hero-bg-wrap{position:fixed;inset:0;z-index:-3;overflow:hidden;background:#02040a}
        .nv-hero-bg-slide{position:absolute;inset:-5%;background-size:cover;background-position:center;opacity:0;transition:opacity ${o.fadeTime}ms ease-in-out,transform 15s linear}
        .nv-hero-bg-slide.active{opacity:.55;animation:nv-kb 18s linear infinite alternate}
        .nv-hero-bg-vignette{position:fixed;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(ellipse at center, transparent 30%, rgba(2,4,10,0.7) 80%, rgba(2,4,10,0.95) 100%)}
        .nv-hero-bg-overlay{position:fixed;inset:0;z-index:-2;pointer-events:none;background:linear-gradient(180deg,rgba(2,4,10,0.4) 0%,rgba(2,4,10,0.55) 100%)}
        @keyframes nv-kb{0%{transform:scale(1.0) translate(0,0)}50%{transform:scale(1.07) translate(-2%,-1.5%)}100%{transform:scale(1.12) translate(2%,1%)}}
      `;
      document.head.appendChild(s);
    }

    // Create wrap
    var wrap = document.createElement('div');
    wrap.className = 'nv-hero-bg-wrap';

    var slides = images.map(function(src){
      var slide = document.createElement('div');
      slide.className = 'nv-hero-bg-slide';
      slide.style.backgroundImage = "url('" + src + "')";
      wrap.appendChild(slide);
      return slide;
    });

    var overlay = document.createElement('div');
    overlay.className = 'nv-hero-bg-overlay';
    var vignette = document.createElement('div');
    vignette.className = 'nv-hero-bg-vignette';

    (o.mountSelector ? document.querySelector(o.mountSelector) : document.body).prepend(wrap);
    document.body.prepend(overlay);
    document.body.prepend(vignette);

    // Cycle slides
    var idx = 0;
    slides[0].classList.add('active');
    setInterval(function(){
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, o.durationPerSlide);

    // Optional parallax on mousemove
    if(o.parallax){
      document.addEventListener('mousemove', function(e){
        var x = (e.clientX / window.innerWidth - 0.5) * 14;
        var y = (e.clientY / window.innerHeight - 0.5) * 14;
        slides.forEach(function(s){ if(s.classList.contains('active')) s.style.transform = 'scale(1.07) translate('+x+'px,'+y+'px)'; });
      });
    }
  };
})(window);
