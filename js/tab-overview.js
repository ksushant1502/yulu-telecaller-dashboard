// ===== TAB: Overview =====
// ===================== OVERVIEW =====================
function renderOverview(){
  const app=document.getElementById('app');
  if(dayDocs.length===0){ app.innerHTML=`<div class="empty-state">No data for this range.${canWrite?' Upload a daily CSV to get started.':''}</div>`; return; }
  const agg = aggregateOverview(null);
  const connPct = agg.totalDials? agg.totalConnects/agg.totalDials*100:0;
  const campArr = Object.entries(agg.campaigns).map(([n,v])=>({name:n,...v,pct:v.dials?v.connects/v.dials*100:0})).sort((a,b)=>b.dials-a.dials);
  const agentArr = Object.entries(agg.agents).map(([n,v])=>({name:n,...v,pct:v.dials?v.connects/v.dials*100:0})).sort((a,b)=>b.dials-a.dials);
  const totalConversions = conversionDocs.reduce((s,d)=>s+(d.totalConversions||0),0);
  const convPct = agg.totalConnects? totalConversions/agg.totalConnects*100:0;
  let html = `<div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Total Dials</div><div class="kpi-value">${agg.totalDials.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-label">Total Connects</div><div class="kpi-value">${agg.totalConnects.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-label">Connection Rate</div><div class="kpi-value ${pctClass(connPct)}">${fmtPct(connPct)}</div></div>
    <div class="kpi"><div class="kpi-label">Conversions</div><div class="kpi-value pct-green">${totalConversions.toLocaleString()}</div></div>
    <div class="kpi"><div class="kpi-label">Conversion %</div><div class="kpi-value ${pctClass(convPct)}">${fmtPct(convPct)}</div><div class="kpi-sub">of connects</div></div>
    <div class="kpi"><div class="kpi-label">Active Campaigns</div><div class="kpi-value">${campArr.length}</div></div>
    <div class="kpi"><div class="kpi-label">Active Agents</div><div class="kpi-value">${agentArr.length}</div></div>
    <div class="kpi"><div class="kpi-label">Days Covered</div><div class="kpi-value">${dayDocs.length}</div></div>
  </div>`;
  html += `<div class="section"><h2>Daily Trend</h2><div class="chart-wrap"><canvas id="trendCanvas"></canvas></div></div>`;
  html += `<div class="section"><h2>Top Campaigns</h2><table><thead><tr><th>Campaign</th><th>Type</th><th>Dials</th><th>Connects</th><th>Conn %</th></tr></thead><tbody>`;
  campArr.slice(0,10).forEach(c=>{ html+=`<tr><td>${escapeHtml(c.name)}</td><td><span class="type-pill ${LOB_CLASS[c.lob]||'type-other'}">${c.lob||'—'}</span></td><td>${c.dials.toLocaleString()}</td><td>${c.connects.toLocaleString()}</td><td class="${pctClass(c.pct)}">${fmtPct(c.pct)}</td></tr>`; });
  html += `</tbody></table></div>`;
  html += `<div class="section"><h2>Top Agents</h2><table><thead><tr><th>Agent</th><th>Dials</th><th>Connects</th><th>Conn %</th></tr></thead><tbody>`;
  agentArr.slice(0,10).forEach(a=>{ html+=`<tr><td>${escapeHtml(a.name)}</td><td>${a.dials.toLocaleString()}</td><td>${a.connects.toLocaleString()}</td><td class="${pctClass(a.pct)}">${fmtPct(a.pct)}</td></tr>`; });
  html += `</tbody></table></div>`;
  app.innerHTML = html;
  drawTrend('trendCanvas', dayDocs.map(d=>d.date), dayDocs.map(d=>d.totalDials||0), dayDocs.map(d=>d.totalConnects||0));
}

function drawTrend(canvasId, labels, dials, connects){
  const ctx=document.getElementById(canvasId); if(!ctx) return;
  if(charts[canvasId]) charts[canvasId].destroy();
  const st=getComputedStyle(document.documentElement);
  charts[canvasId] = new Chart(ctx,{type:'line',data:{labels,datasets:[
    {label:'Dials',data:dials,borderColor:st.getPropertyValue('--accent').trim(),backgroundColor:'transparent',tension:0.25},
    {label:'Connects',data:connects,borderColor:st.getPropertyValue('--green').trim(),backgroundColor:'transparent',tension:0.25},
  ]},options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{labels:{color:st.getPropertyValue('--text').trim()}}},
    scales:{x:{ticks:{color:st.getPropertyValue('--text-dim').trim()},grid:{color:st.getPropertyValue('--border').trim()}},
            y:{ticks:{color:st.getPropertyValue('--text-dim').trim()},grid:{color:st.getPropertyValue('--border').trim()}}}}});
}
