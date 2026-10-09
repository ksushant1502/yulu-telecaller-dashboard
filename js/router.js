// ===== ROUTER: decides which tab renders when the tab or filter changes =====
// ===================== TAB DISPATCH =====================
async function refreshTab(){
  renderLoading();
  if(needsRangeAndType(activeTab)){
    dayDocs = await loadDaySummaries();
  }
  if(activeTab==='conversion' || activeTab==='overview' || activeTab==='campaigns' || activeTab==='agents'){
    conversionDocs = await loadConversionSummaries();
  }
  document.getElementById('rangeSummary').textContent =
    (needsRangeAndType(activeTab)||activeTab==='conversion')
      ? `Showing ${range.start} → ${range.end} · ${(activeTab==='conversion'?conversionDocs:dayDocs).length} day(s) with data`
      : '';
  renderCoverage();
  switch(activeTab){
    case 'overview': renderOverview(); break;
    case 'campaigns': renderCampaigns(); break;
    case 'agents': await renderAgents(); break;
    case 'insights': await renderInsights(); break;
    case 'flags': await renderFlags(); break;
    case 'conversion': renderConversion(); break;
    case 'bangalore': await renderCityTab('Bangalore'); break;
    case 'mumbai': await renderCityTab('Mumbai'); break;
    case 'ncr': await renderCityTab('NCR'); break;
  }
}
