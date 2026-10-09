// ===== TAB: City calling (Bangalore / Mumbai / NCR) =====
// ===================== CITY TABS =====================
async function renderCityTab(city){
  const app=document.getElementById('app');
  const agg = aggregateOverview(city);
  const campArr = Object.entries(agg.campaigns).map(([n,v])=>({name:n,...v,pct:v.dials?v.connects/v.dials*100:0})).sort((a,b)=>b.dials-a.dials);
  if(campArr.length===0){
    app.innerHTML = `<div class="empty-state">No ${city} data yet for this range.${canWrite?` Upload a CSV and set City = ${city} to activate this tab.`:''}</div>`;
    return;
  }
  const connPct = agg.totalDials? agg.totalConnects/agg.totalDials*100:0;
  let html = `<div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">${city} Dials</div><div class="kpi-value">${agg.totalDials.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-label">${city} Connects</div><div class="kpi-value">${agg.totalConnects.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-label">Connection Rate</div><div class="kpi-value ${pctClass(connPct)}">${fmtPct(connPct)}</div></div>
    <div class="kpi"><div class="kpi-label">Campaigns</div><div class="kpi-value">${campArr.length}</div></div>
  </div>`;
  html += `<div class="section"><h2>${city} Campaigns</h2><table><thead><tr><th>Campaign</th><th>Type</th><th>Dials</th><th>Connects</th><th>Conn %</th></tr></thead><tbody>`;
  campArr.forEach(c=>{ html+=`<tr><td>${escapeHtml(c.name)}</td><td><span class="type-pill ${LOB_CLASS[c.lob]||'type-other'}">${c.lob||'—'}</span></td><td>${c.dials.toLocaleString()}</td><td>${c.connects.toLocaleString()}</td><td class="${pctClass(c.pct)}">${fmtPct(c.pct)}</td></tr>`; });
  html += `</tbody></table></div>`;
  html += `<div class="section"><h2>Disposition Drill-down</h2><div id="cityDrill"><button id="loadCityDrill">Load row-level detail for this range</button></div></div>`;
  app.innerHTML = html;
  document.getElementById('loadCityDrill').onclick = async ()=>{
    document.getElementById('cityDrill').innerHTML = '<span class="spinner"></span>Loading…';
    const rows = (await loadRowsForRange()).filter(r=>r.city===city);
    const byDisp = {};
    rows.forEach(r=>{ const d=r.disposition||'Unknown'; byDisp[d]=byDisp[d]||[]; byDisp[d].push(r); });
    let dh = `<table><thead><tr><th>Disposition</th><th>Count</th>${canWrite?'<th></th>':''}</tr></thead><tbody>`;
    Object.entries(byDisp).sort((a,b)=>b[1].length-a[1].length).forEach(([d,rws])=>{
      dh += `<tr><td>${escapeHtml(d)}</td><td>${rws.length}</td>${canWrite?`<td><button data-disp="${escapeHtml(d)}" style="font-size:11px;">Export</button></td>`:''}</tr>`;
    });
    dh += `</tbody></table>`;
    document.getElementById('cityDrill').innerHTML = dh;
    if(canWrite){
      document.querySelectorAll('[data-disp]').forEach(btn=>{
        btn.onclick = ()=>{ const d=btn.getAttribute('data-disp'); const rws=byDisp[d]; downloadCsv(`${city}_${d}.csv`.replace(/[^\w.-]/g,'_'), ['agent','campaign','phone','disposition','talkSec','notes'], rws); };
      });
    }
  };
}
