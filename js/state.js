// ===== STATE: shared variables + tab list. Add a new tab here. =====
// ===================== STATE =====================
function safeGet(key){ try{ return localStorage.getItem(key); }catch(e){ return null; } }
function safeSet(key,val){ try{ localStorage.setItem(key,val); }catch(e){} }

let session=null, canWrite=false;
let range = {start:startOfMonth(todayStr()), end:todayStr(), label:'This Month'};
let typeFilter = 'all';
let activeTab = 'overview';
let dayDocs=[], conversionDocs=[];
let rowsCache={};
let convRowsCache={};
let charts={};

const TABS = [
  {id:'overview', label:'Overview'},
  {id:'campaigns', label:'Campaigns'},
  {id:'agents', label:'Agents'},
  {id:'insights', label:'Insights & VoC'},
  {id:'flags', label:'Flags'},
  {id:'conversion', label:'Conversion'},
  {id:'bangalore', label:'Bangalore'},
  {id:'mumbai', label:'Mumbai'},
  {id:'ncr', label:'NCR'},
];
