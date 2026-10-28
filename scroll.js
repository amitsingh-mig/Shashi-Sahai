(() => {
  'use strict';
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let wanted = true;
  try { wanted = localStorage.getItem('shashi-motion') !== 'off'; } catch (_) {}
  let enabled = wanted && !preference.matches;
  let scheduled = 0;
  let layers = [];
  const active = new Set();
  const motionButton = document.querySelector('[data-motion-toggle]');
  const progress = document.createElement('div');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden','true'); document.body.append(progress);
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {entry.isIntersecting ? active.add(entry.target) : active.delete(entry.target);}); schedule();
  }, {rootMargin:'100px 0px'}) : null;
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});
  }, {threshold:.08}) : null;
  function schedule() {if(scheduled || document.hidden)return;scheduled=requestAnimationFrame(paint);}
  function paint() {
    scheduled=0;
    const viewport=innerHeight;
    const mobile=innerWidth<761;
    const distance=Math.max(1,document.documentElement.scrollHeight-viewport);
    progress.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/distance))})`;
    if(!enabled)return;
    const updates=layers.filter(layer=>!observer || active.has(layer.frame)).map(layer=>{
      const rect=layer.frame.getBoundingClientRect();
      const normalized=Math.max(-1,Math.min(1,(viewport/2-rect.top-rect.height/2)/((viewport+rect.height)/2)));
      const maximum=layer.type==='card'? Math.min(28,rect.height*.035):layer.type==='image'?Math.min(105,rect.height*.10):38;
      return {node:layer.node,offset:normalized*maximum*(layer.type==='type'?-1:1)*(mobile?.6:1)};
    });
    updates.forEach(update=>update.node.style.setProperty('--parallax-y',`${update.offset.toFixed(2)}px`));
  }
  function collect(){
    observer?.disconnect();active.clear();layers=[];
    document.querySelectorAll('[data-parallax]').forEach(node=>{
      const frame=node.closest('.parallax-frame');if(!frame)return;
      layers.push({node,frame,type:node.dataset.parallax});observer?.observe(frame);
    });
    document.querySelectorAll('.photo-frame img').forEach(node=>{
      if(node.hasAttribute('data-parallax'))return;
      const frame=node.closest('.photo-frame');layers.push({node,frame,type:'card'});observer?.observe(frame);
    });
    document.querySelectorAll('[data-reveal]:not(.reveal-ready)').forEach(node=>{
      if(!revealObserver)return;
      node.classList.add('reveal-ready');revealObserver.observe(node);
    });
    schedule();
  }
  function update(){
    enabled=wanted&&!preference.matches;
    root.classList.toggle('motion-enabled',enabled);root.classList.toggle('motion-disabled',!enabled);
    layers.forEach(({node})=>node.style.removeProperty('--parallax-y'));
    if(motionButton){motionButton.textContent=enabled?'Motion on':'Motion off';motionButton.setAttribute('aria-pressed',String(enabled));motionButton.disabled=preference.matches;motionButton.setAttribute('aria-label',preference.matches?'Motion disabled by your device preference':enabled?'Turn off parallax and animations':'Turn on parallax and animations');}
    window.dispatchEvent(new CustomEvent('exhibition:motionchange',{detail:{enabled}}));schedule();
  }
  motionButton?.addEventListener('click',()=>{wanted=!wanted;try{localStorage.setItem('shashi-motion',wanted?'on':'off');}catch(_){}update();});
  preference.addEventListener('change',update);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);addEventListener('exhibition:openingend',schedule);
  document.addEventListener('gallery:updated',collect);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(scheduled);scheduled=0;}else schedule();});
  collect();update();
})();
