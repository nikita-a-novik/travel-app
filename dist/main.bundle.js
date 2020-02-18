!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);r(1);const{getAllTrips:n,removeAllTrips:o,formatDateInput:a,appendTrip:i,onLoadEventListener:c}=r(2);document.addEventListener("getAllTrips",async()=>{const e=await n();o(),e.forEach(e=>i(e))}),window.addEventListener("load",c),document.addEventListener("keyup",e=>{const{target:t={}}=e||{};if("departure-input"===t.id){const e=a(t.value);t.value=e}})},function(e,t,r){},function(e,t){const r=async(e,t)=>{const r=`/weather?location=${e}&date=${t}`;try{return await fetch(r).then(e=>e.json())}catch(e){return{}}},n=async e=>{const t=`/image?location=${e}`;try{return await fetch(t).then(e=>e.json())}catch(e){return{}}},o=()=>{const e=Array.from(document.querySelectorAll(".trip"));e.shift(),e.forEach(e=>e.parentElement.removeChild(e))};document.addEventListener("click",async e=>{const{target:t={}}=e||{};if("add-trip"===t.className){const e=(()=>{const{value:e}=document.querySelector("#location-input");return e})(),t=(()=>{const{value:e}=document.querySelector("#departure-input");return e})();await(async(e,t)=>{try{return await fetch("/trip",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({location:e,date:t})}).then(e=>e.json())}catch(e){return{}}})(e,t),document.dispatchEvent(new Event("getAllTrips"))}else if("remove"===t.className){const e=t.id;await(async e=>{try{return await fetch("/trip",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e})}).then(e=>e.json())}catch(e){return{}}})(e),document.dispatchEvent(new Event("getAllTrips"))}}),e.exports={formatDateInput:e=>{const t=e.replace(/\//g,"").replace(/\D/g,""),r=t.substring(0,2),n=t.substring(2,4),o=t.substring(4,8);return`${r}`+(n?`/${n}`:"")+(o?`/${o}`:"")},getDataForTrip:async(e,t)=>({...await r(e,t),imageUrl:await n(e)}),getImage:n,getWeatherData:r,removeAllTrips:o,getAllTrips:async()=>{try{return await fetch("/trip").then(e=>e.json())}catch(e){return{}}},appendTrip:e=>{const{id:t,country:r,name:n,summary:o,temperatureHigh:a,temperatureLow:i,image:c,date:u,daysAway:s}=e,l=document.querySelector(".trip").cloneNode(!0);l.querySelector("img").setAttribute("src",c),l.querySelector(".destination").innerText=`${n}, ${r}`,l.querySelector(".high").innerText=a,l.querySelector(".low").innerText=i,l.querySelector(".summary").innerText=o,l.querySelector(".days").innerText=s,l.querySelector(".departure").innerText=u,l.setAttribute("style",""),l.querySelector(".remove").setAttribute("id",t),document.querySelector(".trips").appendChild(l)},onLoadEventListener:()=>{o(),document.dispatchEvent(new Event("getAllTrips"))}}}]);