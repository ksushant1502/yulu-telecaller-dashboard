// ===== TAB: Campaigns =====
// ===================== CAMPAIGNS =====================
let campaignSearch='';
function renderCampaigns(){
  const app=document.getElementById('app');
  if(dayDocs.length===0){ app.innerHTML=`<div class="empty-state">No data for this range.</div>`; return; }
  const agg = aggregateOverview(null);
  const convByCampaign = {};
  conversionDocs.forEach(day=>{
    Object.entries(day.byCampaign||{}).forEach(([n,v])=>{ convByCampaign[n]=(convByCampaign[n]||0)+(v.count||0); });
  });
  let campArr = Object.entries(agg.campaigns).map(([n,v])=>({name:n,...v,pct:v.dials?v.connects/v.dials*100:0,conversions:convByCampaign[n]||0})).sort((a,b)=>b.dials-a.dials);
  let html = `<div class="section"><h2>Campaigns <input type="text" id="campSearch" placeholder="Search campaigns…" value="${escapeHtml(campaignSearch)}" style="max-width:220px;"></h2>`;
  html += `<table><thead><tr><th>Campaign</th><th>Type</th><th>Dials</th><th>Connects</th><th>Conn %</th><th>Conversions</th><th>Unique Call IDs</th></tr></thead><tbody>`;
  campArr.filter(c=>c.name.toLowerCase().includes(campaignSearch.toLowerCase())).forEach(c=>{
    html+=`<tr><td>${escapeHtml(c.name)}</td><td><span class="type-pill ${LOB_CLASS[c.lob]||'type-other'}">${c.lob||'—'}</span></td><td>${c.dials.toLocaleString()}</td><td>${c.connects.toLocaleString()}</td><td class="${pctClass(c.pct)}">${fmtPct(c.pct)}</td><td class="pct-green" style="font-weight:700;">${c.conversions.toLocaleString()}</td><td>${c.uniqueCallIds.toLocaleString()}</td></tr>`;
  });
  html += `</tbody></table></div>`;
  app.innerHTML = html;
  document.getElementById('campSearch').oninput = (e)=>{ campaignSearch=e.target.value; renderCampaigns(); };
}
