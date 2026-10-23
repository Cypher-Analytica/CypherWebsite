document.addEventListener('DOMContentLoaded',()=>{
 const logoToggle=document.querySelector('.company-motion-toggle');
 logoToggle?.addEventListener('click',()=>{
  const paused=logoToggle.getAttribute('aria-pressed')!=='true';
  document.querySelector('#company-marquee')?.classList.toggle('is-paused',paused);
  logoToggle.setAttribute('aria-pressed',String(paused));
  logoToggle.textContent=paused?'Resume logos':'Pause logos';
 });
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-navigation');
 const close=()=>{nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation')};
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target)&&!nav.contains(e.target))close()});
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  const filter=b.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  document.querySelectorAll('[data-program]').forEach(x=>{x.hidden=filter==='all'?x.dataset.program==='core':x.dataset.program!==filter});
 }));

 document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>{
  document.querySelectorAll('video').forEach(other=>{if(other!==video&&!other.paused)other.pause()});
 }));
});

document.addEventListener('DOMContentLoaded',()=>{
 const dateNodes=document.querySelectorAll('[data-footer-date]');
 const clockNodes=document.querySelectorAll('[data-footer-clock]');
 if(!dateNodes.length&&!clockNodes.length)return;
 const dateFormat=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',weekday:'short',month:'short',day:'2-digit',year:'numeric'});
 const timeFormat=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true});
 const updateClock=()=>{
  const now=new Date();
  const parts=Object.fromEntries(dateFormat.formatToParts(now).map(p=>[p.type,p.value]));
  dateNodes.forEach(node=>node.textContent=parts.weekday+' '+parts.month+' '+parts.day+' '+parts.year);
  clockNodes.forEach(node=>{node.textContent=timeFormat.format(now).toLowerCase();node.dateTime=now.toISOString()});
 };
 updateClock();setInterval(updateClock,1000);
});

document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.querySelector('.placement-motion-toggle');
 const marquee=document.querySelector('#placement-marquee');
 if(!toggle||!marquee)return;
 toggle.addEventListener('click',()=>{
  const paused=toggle.getAttribute('aria-pressed')!=='true';
  marquee.classList.toggle('is-paused',paused);
  toggle.setAttribute('aria-pressed',String(paused));
  toggle.textContent=paused?'Resume placements':'Pause placements';
 });
});


document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.querySelector('.team-motion-toggle');
 const marquee=document.querySelector('#team-marquee');
 if(!toggle||!marquee)return;
 toggle.addEventListener('click',()=>{
  const paused=toggle.getAttribute('aria-pressed')!=='true';
  marquee.classList.toggle('is-paused',paused);
  toggle.setAttribute('aria-pressed',String(paused));
  toggle.textContent=paused?'Resume team profiles':'Pause team profiles';
 });
});
