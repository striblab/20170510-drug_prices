!function e(t,r,n){function i(o,s){if(!r[o]){if(!t[o]){var u="function"==typeof require&&require;if(!s&&u)return u(o,!0);if(a)return a(o,!0);throw new Error("Cannot find module '"+o+"'")}var d=r[o]={exports:{}};t[o][0].call(d.exports,function(e){var r=t[o][1][e];return i(r||e)},d,d.exports,e,t,r,n)}return r[o].exports}for(var a="function"==typeof require&&require,o=0;o<n.length;o++)i(n[o]);return i}({1:[function(e,t,r){function n(e,t,r,n){t=isNaN(t=Math.abs(t))?2:t,r=void 0==r?".":r,n=void 0==n?",":n;var i=e<0?"-$":"$",a=String(parseInt(e=Math.abs(Number(e)||0).toFixed(t))),o=(o=a.length)>3?o%3:0;return i+(o?a.substr(0,o)+n:"")+a.substr(o).replace(/(\d{3})(?=\d)/g,"$1"+n)+(t?r+Math.abs(e-a).toFixed(t).slice(2):"")}function i(e,t){return t=t||2,'<span class="'+(e>0?"positive":0===e?"":"negative")+'">'+(e>0?"+":"")+Math.round(e*Math.pow(10,t))/Math.pow(10,t)+"%</span>"}$(document).ready(function(){function e(){var e=$("#drug-search-input");e.autocomplete({minLength:3,source:r.map(function(e){return{value:e.id,label:e.brand+" / "+e.generic}}),select:function(r,n){r.preventDefault(),e.val(n.item.label),n.item.value&&t(n.item.value)}})}function t(e){var t=$(".drug-details");if(e!==a){a=e;var o=r.find(function(t){return t.id===e});if(!o)return void console.error("Unable to find data for id: "+e);var s=["2011","2012","2013","2014","2015"],u=o.perUser.find(function(e){return 2015===e.year}),d=o.perUser.find(function(e){return 2011===e.year});t.find(".brand-name").html(o.brand),t.find(".generic-name").html(o.generic),t.find(".per-user-2015").html(n(u.amount)),t.find(".per-user-change").html(i((u.amount-d.amount)/d.amount*100,1)),t.find(".has-different-names").toggle(!o.same),t.find(".per-user-full").toggle(!!o.perUserFull),t.find(".not-per-user-full").toggle(!o.perUserFull),t.find(".extra-info").html(o.extraInfo).toggle(!!o.extraInfo),$(".drug-switch").removeClass("active"),$('[data-id="'+e+'"]').addClass("active");c3.generate({bindto:"#chart",padding:{top:20,right:60,bottom:20,left:90},data:{x:"x",columns:[["x"].concat(s),["Amount per user"].concat(o.perUser.map(function(e){return e.amount}))],type:"line"},legend:{show:!1},color:{pattern:["#333333"]},axis:{y:{min:0,padding:{bottom:0},tick:{count:4,format:d3.format("$,.0f")},label:{text:"Average cost per person",position:"outer-middle"}},x:{padding:{left:.25,right:.25}}},tooltip:{contents:function(e,t,r,n){return'<div class="chart-tooltip"><span class="tooltip-label">'+e[0].x+':</span><span class="tooltip-value">'+r(e[0].value)+"</span></div>"}}})}}var r,a,o={"epipen-2-pak":"The EpiPen 2 Pak, a common EpiPen product, an epinephine auto-injector used to treat allergy reactions, has seen its price steadily rise since 2011.",thiola:"Thiola, an orphan drug, was bought in 2013 by Retrophin, founded by Martin Shkreli, who drastically raised the price.",daraprim:"Daraprim, used to fight parasitic infections, acquired in 2014 by Turing Pharmaceuticals, founded by Martin Shkreli, raised the price remarkably.",chenodal:"Chenodal is used to treat cerebrotendinous xanthomatosis (CTX), a rare genetic disorder, and saw its price spike in 2014 by Retrophin where Martin Shkreli was the CEO at the time.",crestor:"Crestor, used to treat high cholesterol and triglyceride levels, has seen a steady increase from 2011 to 2015.","humira-humira-pen":"Humira is used to treat arthritis, Crohn's disease, and other illnesses",ambien:"Ambien is used to help patients sleep.",lyrica:"Lyrica, used to treat nerve and muscle pain including fibromyalgia, has seens its price double from 2011 to 2015.","lantus-lantus-solostar":"Lantus is a popularly presecribed medicine to treat diabetes."};jQuery.ui.autocomplete.prototype._resizeMenu=function(){this.menu.element.outerWidth(this.element.outerWidth())},d3.json("./data/drug-spending.json",function(n,i){if(n)return void console.error(n);r=i,r.map(function(e){return e.extraInfo=o[e.id]?o[e.id]:void 0,e}),e(),t("epipen-2-pak"),$(".drug-switch").on("click",function(){var e=$(this).data("id");e&&($("#drug-search-input").val(""),t(e))})})})},{}]},{},[1]);