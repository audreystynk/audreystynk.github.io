
const PRODUCTS = window.AUDREY_PRODUCTS || [];
const byId = id => PRODUCTS.find(p => p.id === id);
const bagKey = 'audreystynk_bag_v3';
const wishKey = 'audreystynk_wish_v3';
let bag = JSON.parse(localStorage.getItem(bagKey) || '[]');
let wishes = JSON.parse(localStorage.getItem(wishKey) || '[]');

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => '$' + Number(n).toFixed(0);
function toast(msg){ const t=$('#toast'); if(!t)return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); }
function save(){ localStorage.setItem(bagKey,JSON.stringify(bag)); localStorage.setItem(wishKey,JSON.stringify(wishes)); renderBag(); renderWishes(); }
function addToBag(id, qty=1){ const p=byId(id); if(!p)return; const found=bag.find(i=>i.id===id); if(found) found.qty += qty; else bag.push({id,qty}); save(); toast(p.name+' added to bag'); }
function removeFromBag(id){ bag=bag.filter(i=>i.id!==id); save(); }
function toggleWish(id){ wishes=wishes.includes(id)?wishes.filter(x=>x!==id):[...wishes,id]; save(); toast(wishes.includes(id)?'Saved to wishlist':'Removed from wishlist'); }
function renderWishes(){ const count=$('#wishCount'); if(count) count.textContent=wishes.length; $$('[data-wish]').forEach(b=>{ b.classList.toggle('saved',wishes.includes(b.dataset.wish)); if(b.classList.contains('heart-btn')) b.textContent=wishes.includes(b.dataset.wish)?'♥':'♡'; }); }
function renderBag(){ const count=$('#bagCount'), items=$('#bagItems'), subtotal=$('#bagSubtotal'); const totalQty=bag.reduce((a,b)=>a+b.qty,0); if(count)count.textContent=totalQty; const total=bag.reduce((sum,i)=>{const p=byId(i.id); return sum+(p?p.price*i.qty:0)},0); if(subtotal)subtotal.textContent=money(total); if(items){ if(!bag.length){items.innerHTML='<p class="empty-state">Your bag is empty.</p>';} else {items.innerHTML=bag.map(i=>{const p=byId(i.id); if(!p)return ''; return `<div class="bag-row"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><span>${i.qty} × ${money(p.price)}</span></div><button data-remove="${p.id}">Remove</button></div>`}).join(''); items.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeFromBag(b.dataset.remove)); }} renderCheckout(); }
function renderCheckout(){ const holder=$('#checkoutItems'), subtotal=$('#checkoutSubtotal'), total=$('#checkoutTotal'); if(!holder)return; const amount=bag.reduce((sum,i)=>{const p=byId(i.id);return sum+(p?p.price*i.qty:0)},0); subtotal.textContent=money(amount); total.textContent=money(amount); if(!bag.length){holder.innerHTML='<p class="empty-state">Your bag is empty. <a href="shop.html">Continue shopping →</a></p>';return;} holder.innerHTML=bag.map(i=>{const p=byId(i.id);return `<div class="checkout-item"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><span>Quantity: ${i.qty}</span><br><button data-remove="${p.id}">Remove</button></div><strong>${money(p.price*i.qty)}</strong></div>`}).join(''); holder.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeFromBag(b.dataset.remove)); }

$$('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{ const qtyEl=$('#qty'); const qty=qtyEl?Math.max(1,parseInt(qtyEl.value||'1')):1; addToBag(btn.dataset.add,qty); }));
$$('[data-wish]').forEach(btn=>btn.addEventListener('click',()=>toggleWish(btn.dataset.wish)));

const bagPanel=$('#bagPanel'), overlay=$('#pageOverlay');
function openBag(){bagPanel?.classList.add('open');overlay?.classList.add('show');bagPanel?.setAttribute('aria-hidden','false')}
function closeBag(){bagPanel?.classList.remove('open');overlay?.classList.remove('show');bagPanel?.setAttribute('aria-hidden','true')}
$('#bagOpen')?.addEventListener('click',openBag); $('#bagClose')?.addEventListener('click',closeBag); overlay?.addEventListener('click',()=>{closeBag();closeSearch()});

const drawer=$('#searchDrawer'), input=$('#globalSearch'), results=$('#searchResults');
function openSearch(){drawer?.classList.add('open');setTimeout(()=>input?.focus(),100)}
function closeSearch(){drawer?.classList.remove('open')}
$('.search-toggle')?.addEventListener('click',openSearch); $('.search-close')?.addEventListener('click',closeSearch);
input?.addEventListener('input',()=>{const q=input.value.trim().toLowerCase(); if(!q){results.innerHTML='';return;} const matches=PRODUCTS.filter(p=>(p.name+' '+p.category+' '+p.desc).toLowerCase().includes(q)); results.innerHTML=matches.length?matches.map(p=>`<a class="search-result" href="${p.page}"><strong>${p.name}</strong><span>${p.category} · ${money(p.price)}</span></a>`).join(''):'<p>No products found.</p>';});

document.querySelector('.mobile-menu')?.addEventListener('click',e=>{const n=$('.main-nav');const open=n.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});

const grid=$('#shopGrid');
if(grid){ const original=[...grid.children]; const filters=$$('.filter'); function applyFilter(cat){ original.forEach(c=>c.style.display=(cat==='all'||c.dataset.category===cat)?'':'none'); } filters.forEach(b=>b.onclick=()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');applyFilter(b.dataset.filter)}); const hash=location.hash.replace('#','').toLowerCase(); if(hash){ const match=filters.find(b=>b.dataset.filter===hash); if(match)match.click(); } $('#sortProducts')?.addEventListener('change',e=>{let arr=[...original]; if(e.target.value==='price-asc')arr.sort((a,b)=>+a.dataset.price-+b.dataset.price); if(e.target.value==='price-desc')arr.sort((a,b)=>+b.dataset.price-+a.dataset.price); if(e.target.value==='name')arr.sort((a,b)=>a.dataset.name.localeCompare(b.dataset.name)); arr.forEach(c=>grid.appendChild(c)); }); }

$$('.thumbs [data-img]').forEach(b=>b.addEventListener('click',()=>{const m=$('#mainProductImage');if(m)m.src=b.dataset.img;}));

renderBag(); renderWishes();
