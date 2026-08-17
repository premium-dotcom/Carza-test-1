// =============================
// CARZA — EASY EDIT AREA
// Add/edit vehicles and dealers here.
// =============================
const CARS = [
 {id:1,make:"Toyota",model:"Fortuner 2.4 GD-6",year:2023,price:429900,km:62000,gear:"Automatic",fuel:"Diesel",location:"Johannesburg",type:"SUV",featured:true,dealer:"CARZA Founding Motors",phone:"0110000000",img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85"},
 {id:2,make:"Volkswagen",model:"Tiguan 1.4 TSI",year:2022,price:369900,km:47000,gear:"Automatic",fuel:"Petrol",location:"Pretoria",type:"SUV",featured:true,dealer:"Capital Auto Gallery",phone:"0120000000",img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85"},
 {id:3,make:"BMW",model:"320i M Sport",year:2021,price:399900,km:58000,gear:"Automatic",fuel:"Petrol",location:"Johannesburg",type:"Sedan",featured:false,dealer:"Premium Drive",phone:"0110000001",img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85"},
 {id:4,make:"Ford",model:"Ranger 2.0 Bi-Turbo",year:2024,price:549900,km:18000,gear:"Automatic",fuel:"Diesel",location:"Cape Town",type:"Bakkie",featured:true,dealer:"Cape Coast Auto",phone:"0210000000",img:"https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=85"},
 {id:5,make:"Hyundai",model:"Tucson 2.0 Executive",year:2022,price:319900,km:39000,gear:"Automatic",fuel:"Petrol",location:"Durban",type:"SUV",featured:false,dealer:"Coastal Motors",phone:"0310000000",img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=85"},
 {id:6,make:"Mercedes-Benz",model:"C200 AMG Line",year:2023,price:679900,km:24000,gear:"Automatic",fuel:"Petrol",location:"Johannesburg",type:"Sedan",featured:true,dealer:"Executive Auto",phone:"0110000002",img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"}
];

const DEALERS=[
 {name:"CARZA Founding Motors",location:"Johannesburg",stock:86,rating:"4.9",initial:"C"},
 {name:"Capital Auto Gallery",location:"Pretoria",stock:54,rating:"4.8",initial:"C"},
 {name:"Premium Drive",location:"Johannesburg",stock:41,rating:"4.9",initial:"P"}
];

let results=[...CARS];
let saved=JSON.parse(localStorage.getItem("carzaSaved")||"[]");
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>"R"+n.toLocaleString("en-ZA");
const toast=t=>{const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),2200)};

function render(){
 const grid=$("#carsGrid");
 $("#resultInfo").textContent=`${results.length} vehicle${results.length===1?"":"s"} in the current results.`;
 $("#empty").classList.toggle("hidden",results.length!==0);
 grid.innerHTML=results.map(c=>`
  <article class="car">
   <div class="photo"><img src="${c.img}" alt="${c.year} ${c.make} ${c.model}" loading="lazy">
   ${c.featured?'<span class="featured">FEATURED</span>':""}
   <button class="heart ${saved.includes(c.id)?"saved":""}" data-save="${c.id}">${saved.includes(c.id)?"♥":"♡"}</button></div>
   <div class="car-body"><div class="car-title"><h3>${c.year} ${c.make} ${c.model}</h3><strong class="price">${money(c.price)}</strong></div>
   <div class="meta"><span>${c.km.toLocaleString()} km</span><span>${c.gear}</span><span>${c.fuel}</span></div>
   <div class="dealer-row"><div><strong>${c.dealer}</strong><small>📍 ${c.location}</small></div><button class="view" data-view="${c.id}">VIEW CAR</button></div></div>
  </article>`).join("");
 $$("[data-save]").forEach(b=>b.onclick=()=>{const id=+b.dataset.save;saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem("carzaSaved",JSON.stringify(saved));updateSaved();render();toast(saved.includes(id)?"Saved":"Removed from saved")});
 $$("[data-view]").forEach(b=>b.onclick=()=>openCar(+b.dataset.view));
}
function updateSaved(){$("#savedCount").textContent=saved.length}
function renderDealers(){
 $("#dealerGrid").innerHTML=DEALERS.map(d=>`<article class="dealer-card"><div class="dealer-icon">${d.initial}</div><h3>${d.name}</h3><p>📍 ${d.location}</p><div class="dealer-stats"><div><b>${d.stock}</b><span>Vehicles</span></div><div><b>★ ${d.rating}</b><span>Rating</span></div></div></article>`).join("");
}
function runSearch(){
 const q=$("#query").value.toLowerCase().trim(),loc=$("#location").value,max=$("#price").value?+$("#price").value:Infinity;
 results=CARS.filter(c=>(!q||`${c.make} ${c.model} ${c.type}`.toLowerCase().includes(q))&&(!loc||c.location===loc)&&c.price<=max);
 sortResults();render();$("#cars").scrollIntoView({behavior:"smooth"});
}
function sortResults(){
 const s=$("#sort").value;
 results.sort((a,b)=>s==="low"?a.price-b.price:s==="high"?b.price-a.price:s==="year"?b.year-a.year:s==="km"?a.km-b.km:(b.featured-a.featured));
}
function quick(type){
 if(type==="under200")results=CARS.filter(c=>c.price<200000);
 else if(type==="new")results=CARS.filter(c=>c.year>=2024);
 else if(type==="SUV")results=CARS.filter(c=>c.type==="SUV");
 else if(type==="Automatic")results=CARS.filter(c=>c.gear==="Automatic");
 render();$("#cars").scrollIntoView({behavior:"smooth"});
}
function openCar(id){
 const c=CARS.find(x=>x.id===id); if(!c)return;
 $("#modalBody").innerHTML=`<img class="modal-img" src="${c.img}" alt="${c.year} ${c.make} ${c.model}"><h2>${c.year} ${c.make} ${c.model}</h2><div class="modal-price">${money(c.price)}</div><div class="modal-meta">${c.km.toLocaleString()} km · ${c.gear} · ${c.fuel} · ${c.location}<br>Dealer: <b>${c.dealer}</b></div><div class="modal-actions"><a class="wa" target="_blank" href="https://wa.me/27${c.phone.replace(/^0/,"")}?text=${encodeURIComponent("Hi, I found your "+c.year+" "+c.make+" "+c.model+" on CARZA. Is it still available?")}">WhatsApp dealer</a><a class="call" href="tel:${c.phone}">Call dealer</a></div>`;
 $("#modal").classList.remove("hidden");
}
function dealerModal(){
 $("#modalBody").innerHTML=`<div class="dealer-form"><small class="eyebrow">CARZA FOR DEALERS</small><h2>Join the launch.</h2><p style="color:#777;font-size:12px">Leave your details and the CARZA team can contact your dealership.</p><label>DEALERSHIP NAME<input id="dName" placeholder="Your dealership"></label><label>CONTACT NAME<input id="dContact" placeholder="Your name"></label><label>PHONE / WHATSAPP<input id="dPhone" placeholder="e.g. 082 123 4567"></label><label>MESSAGE<textarea id="dMsg" placeholder="Tell us roughly how many vehicles you have."></textarea></label><button class="dark-btn" id="sendDealer">Send enquiry →</button></div>`;
 $("#modal").classList.remove("hidden");
 $("#sendDealer").onclick=()=>{if(!$("#dName").value||!$("#dPhone").value){toast("Please add a dealership and contact number.");return}toast("Thanks — enquiry saved in this prototype.");setTimeout(closeModal,700)};
}
function closeModal(){$("#modal").classList.add("hidden")}
$("#search").onclick=runSearch;$("#query").onkeydown=e=>{if(e.key==="Enter")runSearch()};
$("#sort").onchange=()=>{sortResults();render()};
$("#clear").onclick=()=>{$("#query").value="";$("#location").value="";$("#price").value="";results=[...CARS];render()};
$$("[data-filter]").forEach(b=>b.onclick=()=>quick(b.dataset.filter));
$$("[data-open-dealer]").forEach(b=>b.onclick=dealerModal);
$$("[data-close]").forEach(b=>b.onclick=closeModal);
$("#savedBtn").onclick=()=>{results=CARS.filter(c=>saved.includes(c.id));render();$("#cars").scrollIntoView({behavior:"smooth"});toast(`${saved.length} saved vehicle${saved.length===1?"":"s"}`)};
$("#dealerSearchTab").onclick=()=>toast("Dealer search is coming next.");
$("#hamburger").onclick=()=>toast("Mobile navigation coming next.");
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
updateSaved();render();renderDealers();
