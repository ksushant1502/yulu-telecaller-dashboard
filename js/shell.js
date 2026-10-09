// ===== SHELL: page start-up, tab bar, filter bar, upload buttons =====
// ===================== INIT =====================
async function init(){
  renderTabNav();
  renderFilterControls();
  await initAuth();
  renderRoleBadge();
  renderUploadControls();
  await refreshTab();
}

function renderRoleBadge(){
  const wrap = document.getElementById('roleBadgeWrap');
  wrap.innerHTML = canWrite
    ? '<span class="badge admin">Editor</span>'
    : '<span class="badge public">View only</span>';
}

function renderTabNav(){
  const nav = document.getElementById('tabNav');
  nav.innerHTML = TABS.map(t=>`<button class="tab-btn ${activeTab===t.id?'active':''}" data-tab="${t.id}">${t.label}</button>`).join('');
  nav.querySelectorAll('[data-tab]').forEach(btn=>{
    btn.onclick = ()=>{ activeTab = btn.getAttribute('data-tab'); renderTabNav(); renderFilterControls(); refreshTab(); };
  });
}

function needsRangeAndType(tab){ return ['overview','campaigns','agents','insights','flags','bangalore','mumbai','ncr'].includes(tab); }

function renderFilterControls(){
  const el = document.getElementById('filterControls');
  let html = '';
  if(needsRangeAndType(activeTab) || activeTab==='conversion'){
    const presets = ['Today','This Week','Last 7 Days','This Month'];
    html += '<div class="controls-row">';
    presets.forEach(label=> html += `<button data-preset="${label}" class="${range.label===label?'active':''}">${label}</button>`);
    html += `<input type="date" id="customStart" value="${range.start}"><span style="color:var(--text-dim);font-size:12px;">to</span><input type="date" id="customEnd" value="${range.end}">`;
    html += `<button id="applyCustom">Apply</button>`;
    html += '</div>';
  }
  if(needsRangeAndType(activeTab)){
    html += `<select id="typeFilterSel" style="margin-left:6px;">
      <option value="all" ${typeFilter==='all'?'selected':''}>All Types</option>
      <option value="acquisition" ${typeFilter==='acquisition'?'selected':''}>Acquisition</option>
      <option value="retention" ${typeFilter==='retention'?'selected':''}>Retention</option>
      <option value="experience" ${typeFilter==='experience'?'selected':''}>Experience</option>
    </select>`;
  }
  el.innerHTML = html;

  if(needsRangeAndType(activeTab) || activeTab==='conversion'){
    const presetFns = {
      'Today': ()=>setRange(todayStr(), todayStr(), 'Today'),
      'This Week': ()=>setRange(startOfWeek(todayStr()), todayStr(), 'This Week'),
      'Last 7 Days': ()=>setRange(addDays(todayStr(),-6), todayStr(), 'Last 7 Days'),
      'This Month': ()=>setRange(startOfMonth(todayStr()), todayStr(), 'This Month'),
    };
    Object.entries(presetFns).forEach(([label,fn])=>{ const b=el.querySelector(`[data-preset="${label}"]`); if(b) b.onclick=fn; });
    const ap = el.querySelector('#applyCustom');
    if(ap) ap.onclick = ()=>{
      const s=el.querySelector('#customStart').value, e=el.querySelector('#customEnd').value;
      if(s&&e&&s<=e) setRange(s,e,'Custom'); else toast('Pick a valid start/end date');
    };
  }
  const tf = el.querySelector('#typeFilterSel');
  if(tf) tf.onchange = ()=>{ typeFilter = tf.value; refreshTab(); };
}

function setRange(start,end,label){ range={start,end,label}; renderFilterControls(); refreshTab(); }

function renderUploadControls(){
  const el = document.getElementById('uploadControls');
  if(!canWrite){ el.innerHTML = `<button id="loginBtn">Editor Login</button>`; document.getElementById('loginBtn').onclick=openLoginModal; return; }
  el.innerHTML = `<button class="primary" id="uploadCallBtn">＋ Upload Daily CSV</button><button id="uploadConvBtn">＋ Upload Conversion CSV</button><button id="logoutBtn">Log Out</button>`;
  el.querySelector('#uploadCallBtn').onclick = openUploadModal;
  el.querySelector('#uploadConvBtn').onclick = openConversionUploadModal;
  el.querySelector('#logoutBtn').onclick = logout;
}
