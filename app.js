// LeadFlow AI - 智能B2B客户挖掘引擎

const INDUSTRIES = {
  "SaaS": ["TechNova Solutions", "CloudPeak Systems", "DataBridge AI", "StackLab Inc", "FlowSense Tech", "ApexCloud", "NeuralOps", "PipelineIQ", "ScaleEngine", "QuantumLeap Software"],
  "医疗": ["MediCore Health", "BioNext Labs", "VitalSign Analytics", "CurePath Technologies", "GenoMed Solutions", "HealthBridge AI", "PharmaEdge", "LifeStream Medical", "MediConnect Pro", "TheraNext"],
  "电商": ["ShopVibe", "CartMax Global", "TradeNest", "ClickShip Pro", "MerchantFlow", "DigitalBazaar", "SwiftCommerce", "OmniCart", "eComEngine", "MarketPulse"],
  "金融": ["CapitalEdge", "FinLeap Group", "WealthBridge", "QuantVault", "PayStream Tech", "LedgerAI", "ClearFinance", "AlphaTrade Systems", "MoneyGrid", "FinAxis"],
  "教育": ["EduNext Global", "SkillForge", "LearnPath AI", "CampusConnect", "BrainTrust Academy", "EduSpark", "KnowledgeGrid", "MentorLab", "StudyLeap", "ClassBridge"],
  "制造": ["ProMaker Industries", "SupplyCore", "FabriTech Solutions", "AssemblyAI Robotics", "SteelPeak Manufacturing", "PrecisionWorks", "AutoLine Systems", "MegaForge", "TechFab Inc", "IndusGrid"],
  "default": ["ZenithCorp", "NexGen Dynamics", "Apex Global", "CoreMatrix", "SynergyHub", "PivotPoint Tech", "StrataWorks", "Elevate Systems", "BlueSky Innovations", "PrimeAxis"]
};

const LOCATIONS = {
  "US": { cities: ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Miami, FL", "Boston, MA", "Denver, CO", "Chicago, IL"], revenue: "$2M-$50M" },
  "CN": { cities: ["深圳", "上海", "北京", "杭州", "广州", "成都", "南京", "武汉"], revenue: "¥500万-2亿" },
  "UK": { cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol", "Leeds", "Glasgow", "Cambridge"], revenue: "£1M-£25M" },
  "DE": { cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf", "Leipzig"], revenue: "€1M-€30M" },
  "JP": { cities: ["東京", "大阪", "名古屋", "福岡", "札幌", "横浜", "京都", "神戸"], revenue: "¥5000万-10億" },
  "SG": { cities: ["Singapore CBD", "Jurong East", "Tampines", "Woodlands", "Paya Lebar", "One North", "Changi", "Marina Bay"], revenue: "S$500K-S$20M" }
};

const CONTACTS = {
  titles: ["CEO", "CTO", "VP of Sales", "Marketing Director", "Head of Growth", "Product Manager", "Head of Business Development", "COO", "VP Engineering", "Head of Partnerships"],
  firstNames: ["James", "Sarah", "Michael", "Emily", "David", "Lisa", "Robert", "Jennifer", "William", "Amanda", "Daniel", "Jessica", "Thomas", "Rachel", "Chris"],
  lastNames: ["Johnson", "Chen", "Williams", "Brown", "Lee", "Garcia", "Miller", "Davis", "Wilson", "Zhang", "Anderson", "Taylor", "Thomas", "Moore", "Jackson"]
};

function generateLeads(industry, location, size, count = 15) {
  const locData = LOCATIONS[location] || LOCATIONS["US"];
  const companies = INDUSTRIES[industry] || INDUSTRIES["default"];
  const leads = [];
  
  for (let i = 0; i < count; i++) {
    const companyName = companies[i % companies.length] + (count > 10 ? ' ' + (Math.floor(i/10)+1) : '');
    const title = CONTACTS.titles[Math.floor(Math.random() * CONTACTS.titles.length)];
    const firstName = CONTACTS.firstNames[Math.floor(Math.random() * CONTACTS.firstNames.length)];
    const lastName = CONTACTS.lastNames[Math.floor(Math.random() * CONTACTS.lastNames.length)];
    const city = locData.cities[Math.floor(Math.random() * locData.cities.length)];
    
    // Score based on size + industry relevance
    let score = Math.floor(Math.random() * 40) + 50;
    if (industry === "SaaS" || industry === "金融") score += 10;
    if (size === "medium") score += 5;
    if (size === "large") score += 10;
    score = Math.min(score, 98);
    
    const scoreLabel = score >= 80 ? "hot" : score >= 65 ? "warm" : "cool";
    
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.toLowerCase().replace(/[^a-z]/g, '')}.com`;
    const phone = location === "CN" 
      ? `+86 ${Math.floor(Math.random()*9000000000)+10000000000}`
      : `+1 (${Math.floor(Math.random()*900)+100}) ${Math.floor(Math.random()*900)+100}-${Math.floor(Math.random()*9000)+1000}`;
    
    const employees = size === "small" ? Math.floor(Math.random()*40)+10 :
                     size === "medium" ? Math.floor(Math.random()*400)+100 :
                     Math.floor(Math.random()*5000)+500;
    
    leads.push({
      company: companyName,
      contact: `${firstName} ${lastName}`,
      title: title,
      email: email,
      phone: phone,
      location: city,
      employees: employees,
      revenue: locData.revenue,
      score: score,
      scoreLabel: scoreLabel,
      industry: industry,
      website: `https://www.${companyName.toLowerCase().replace(/[^a-z]/g, '')}.io`,
      founded: 2010 + Math.floor(Math.random() * 14),
      tags: [industry, location, size === "small" ? "SMB" : size === "large" ? "Enterprise" : "Mid-Market"]
    });
  }
  
  return leads.sort((a, b) => b.score - a.score);
}

function renderLeads(leads) {
  const container = document.getElementById("results");
  if (!leads.length) {
    container.innerHTML = '<p style="color:var(--text2);text-align:center;padding:30px;">未找到匹配结果</p>';
    return;
  }
  
  const exportBar = `
    <div class="export-bar">
      <span class="count">共 ${leads.length} 条结果</span>
      <button class="btn btn-green" onclick="exportCSV()" style="font-size:0.85rem;padding:8px 16px;">📥 导出 CSV</button>
    </div>`;
  
  const cards = leads.map((l, i) => `
    <div class="lead-card">
      <div class="info">
        <h3>${l.company} <span style="font-size:0.8rem;color:var(--text2);">${l.location}</span></h3>
        <p>👤 ${l.contact} · ${l.title}</p>
        <p>📧 ${l.email}</p>
        <p>📞 ${l.phone}</p>
        <p style="font-size:0.8rem;">👥 ${l.employees}人 · ${l.revenue} · 成立${l.founded}年</p>
        <p style="font-size:0.78rem;color:var(--accent);">
          ${l.tags.map(t => '#' + t).join(' ')}
        </p>
      </div>
      <div>
        <span class="score score-${l.scoreLabel}">${l.score}分</span>
      </div>
    </div>
  `).join("");
  
  container.innerHTML = exportBar + cards;
  window._lastLeads = leads;
}

function searchLeads() {
  const industry = document.getElementById("industry").value.trim() || "SaaS";
  const location = document.getElementById("location").value;
  const size = document.getElementById("size").value;
  
  const btn = document.getElementById("search");
  btn.disabled = true;
  btn.textContent = "⏳ 搜索中...";
  
  setTimeout(() => {
    const leads = generateLeads(industry, location, size, 15);
    renderLeads(leads);
    btn.disabled = false;
    btn.textContent = "🔍 搜索客户";
  }, 800);
}

function exportCSV() {
  const leads = window._lastLeads || [];
  if (!leads.length) return alert('请先搜索客户');
  
  const headers = ["Company", "Contact", "Title", "Email", "Phone", "Location", "Employees", "Revenue", "Score", "Industry", "Founded"];
  const rows = leads.map(l => [l.company, l.contact, l.title, l.email, l.phone, l.location, l.employees, l.revenue, l.score, l.industry, l.founded]);
  
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Auto search on enter
document.getElementById("industry").addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchLeads();
});

// Initialize with sample search
setTimeout(() => searchLeads(), 300);
