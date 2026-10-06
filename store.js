window.Store = {
 key: 'somosfamilia-cart-v1',
 get() { try { const a=JSON.parse(localStorage.getItem(this.key)||'[]'); return Array.isArray(a)?a.filter(x=>window.products.some(p=>p.id===x.id)&&Number.isInteger(x.quantity)&&x.quantity>0).map(x=>({...window.products.find(p=>p.id===x.id),quantity:Math.min(x.quantity,99)})):[]; } catch {return [];} },
 save(a) {localStorage.setItem(this.key,JSON.stringify(a));this.count();},
 count() {const e=document.getElementById('cart-count');if(e)e.textContent=this.get().reduce((n,x)=>n+x.quantity,0);},
 price(v) {return v==null?'Preço sob consulta':new Intl.NumberFormat('pt-AO',{style:'currency',currency:'AOA'}).format(v);},
 total(a) {return a.some(x=>x.price==null)?'A confirmar':this.price(a.reduce((n,x)=>n+x.price*x.quantity,0));}
};
Store.count();
