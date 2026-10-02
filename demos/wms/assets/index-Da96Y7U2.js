(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const p of n.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function s(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=s(a);fetch(a.href,n)}})();const h=[{sku:"WB-001",name:"Футболка базовая",cell:"A-14-02",status:"ready",icon:"shirt",available:24,reserved:6,updated:"Сегодня, 10:45",history:["Смена статуса на «Готов к отгрузке»","Перемещение в ячейку A-14-02"]},{sku:"WB-002",name:"Кроссовки",cell:"B-03-01",status:"storage",icon:"shoe",available:18,reserved:2,updated:"Сегодня, 09:20",history:["Принято 8 единиц","Размещено в ячейке B-03-01"]},{sku:"WB-003",name:"Рюкзак",cell:"B-05-02",status:"picking",icon:"backpack",available:7,reserved:4,updated:"Сегодня, 11:10",history:["Передано на сборку","Зарезервировано 4 единицы"]},{sku:"WB-004",name:"Кепка",cell:"A-12-04",status:"written-off",icon:"cap",available:0,reserved:0,updated:"Вчера, 17:30",history:["Товар списан после инвентаризации","Остаток скорректирован до 0"]},{sku:"WB-005",name:"Куртка демисезонная",cell:"C-02-03",status:"storage",icon:"jacket",available:12,reserved:1,updated:"Вчера, 14:05",history:["Проверка качества завершена","Размещено в ячейке C-02-03"]},{sku:"WB-006",name:"Сумка-шоппер",cell:"A-08-01",status:"ready",icon:"bag",available:31,reserved:9,updated:"Сегодня, 08:55",history:["Сборка заказа завершена","Смена статуса на «Готов к отгрузке»"]}],v={ready:{label:"Готов к отгрузке"},storage:{label:"На хранении"},picking:{label:"На сборке"},"written-off":{label:"Списан"}},w=document.querySelector("#product-list"),l=document.querySelector("#product-search"),m=document.querySelector("#status-filter"),L=document.querySelector("#result-count"),E=document.querySelector("#empty-state"),S=document.querySelector("#reset-filters"),d=document.querySelector("#drawer-layer"),c=document.querySelector("#product-drawer"),q=document.querySelector("#drawer-sku"),C=document.querySelector("#drawer-title"),B=document.querySelector("#drawer-body"),g=document.querySelector(".drawer-close"),D=document.querySelector(".drawer-backdrop"),k=document.querySelectorAll(".topbar, .sidebar, .page");let i=null,o=!1,y=null;const u=(e,t="")=>`
  <svg class="${t}" aria-hidden="true"><use href="#icon-${e}" /></svg>
`;function O(e,t){const s=v[e.status];return`
    <tr class="product-row${e.status==="written-off"?" product-row--muted":""}" style="--row-index: ${t}">
      <td data-label="SKU"><span class="sku">${e.sku}</span></td>
      <td data-label="Товар">
        <div class="product-cell">
          <span class="product-icon">${u(e.icon)}</span>
          <span class="product-name">${e.name}</span>
        </div>
      </td>
      <td data-label="Ячейка"><span class="cell-code">${e.cell}</span></td>
      <td data-label="Статус">
        <span class="status-badge status-badge--${e.status}">
          <span class="status-dot" aria-hidden="true"></span>${s.label}
        </span>
      </td>
      <td class="action-cell">
        <button class="open-button" type="button" data-sku="${e.sku}" aria-label="Открыть ${e.name}">
          <span>Открыть</span>${u("arrow")}
        </button>
      </td>
    </tr>
  `}function P(e){const t=e%10,s=e%100;return t===1&&s!==11?"товар":t>=2&&t<=4&&(s<12||s>14)?"товара":"товаров"}function f(){const e=l.value.trim().toLocaleLowerCase("ru"),t=m.value,s=h.filter(r=>{const a=`${r.sku} ${r.name}`.toLocaleLowerCase("ru").includes(e),n=t==="all"||r.status===t;return a&&n});w.innerHTML=s.map(O).join(""),L.textContent=`${s.length} ${P(s.length)}`,E.hidden=s.length>0,document.querySelector(".table-scroll").hidden=s.length===0}function A(e){const t=v[e.status];return`
    <div class="product-preview" aria-hidden="true">
      <span>${u(e.icon)}</span>
    </div>

    <div class="detail-grid">
      <section class="detail-card">
        <p>Текущий статус</p>
        <span class="status-badge status-badge--${e.status}">
          <span class="status-dot" aria-hidden="true"></span>${t.label}
        </span>
      </section>
      <section class="detail-card">
        <p>Ячейка хранения</p>
        <span class="location-code">${u("location")}${e.cell}</span>
      </section>
    </div>

    <section class="stock-card" aria-labelledby="stock-title">
      <h3 id="stock-title">Остатки на складе</h3>
      <div class="stock-values">
        <div><strong>${e.available}</strong><span>Доступно, шт.</span></div>
        <div><strong>${e.reserved}</strong><span>В резерве, шт.</span></div>
      </div>
    </section>

    <section class="history" aria-labelledby="history-title">
      <h3 id="history-title">Последние изменения</h3>
      <ol>
        ${e.history.map((s,r)=>`
              <li>
                <span class="history-marker" aria-hidden="true"></span>
                <div><time>${r===0?e.updated:"Вчера, 16:20"}</time><p>${s}</p></div>
              </li>
            `).join("")}
      </ol>
    </section>
  `}function F(e){o=!0,window.clearTimeout(y),i=document.activeElement,q.textContent=`SKU: ${e.sku}`,C.textContent=e.name,B.innerHTML=A(e),d.hidden=!1,document.body.classList.add("drawer-open"),k.forEach(t=>{t.inert=!0}),requestAnimationFrame(()=>{o&&(d.classList.add("drawer-layer--visible"),c.focus())})}function $(){o||(window.clearTimeout(y),d.hidden=!0,k.forEach(e=>{e.inert=!1}),i instanceof HTMLElement&&i.isConnected&&i.focus())}function b(){o&&(o=!1,d.classList.remove("drawer-layer--visible"),document.body.classList.remove("drawer-open"),y=window.setTimeout($,350))}function K(e){if(!o||e.key!=="Tab")return;const t=[...c.querySelectorAll("button:not([disabled]), [href], input, select")],s=t[0],r=t.at(-1);if(!s){e.preventDefault(),c.focus();return}e.shiftKey&&(document.activeElement===s||document.activeElement===c)?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),s.focus())}function T(e){const t=e.target.closest(".open-button");if(!t)return;const s=h.find(({sku:r})=>r===t.dataset.sku);s&&F(s)}function W(){l.value="",m.value="all",f(),l.focus()}l.addEventListener("input",f);m.addEventListener("change",f);w.addEventListener("click",T);S.addEventListener("click",W);g.addEventListener("click",b);D.addEventListener("click",b);c.addEventListener("transitionend",e=>{e.target===c&&e.propertyName==="transform"&&$()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&o){e.preventDefault(),b();return}K(e),e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&document.activeElement!==l&&!o&&(e.preventDefault(),l.focus())});document.addEventListener("focusin",e=>{o&&!c.contains(e.target)&&g.focus()});f();
