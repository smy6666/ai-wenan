// ============================
// PAYMENT INTEGRATION MODULE
// ============================

// Payment configuration - user can update these
const PAYMENT_CONFIG = {
  // Buy Me a Coffee (free to setup at buymeacoffee.com)
  buymeacoffee: "https://buymeacoffee.com/smy6666",
  
  // Gumroad products (create at gumroad.com)
  gumroadPro: "https://smy6666.gumroad.com/l/leadflow-pro",
  gumroadEnterprise: "https://smy6666.gumroad.com/l/leadflow-enterprise",
  
  // Free usage limits
  freeSearchesPerMonth: 10,
  freeExportPerMonth: 2
};

// Track usage
const USAGE_KEY = "leadflow_usage";
function getUsage() {
  try {
    const stored = localStorage.getItem(USAGE_KEY);
    const data = stored ? JSON.parse(stored) : { searches: 0, exports: 0, month: new Date().getMonth() };
    // Reset if new month
    if (data.month !== new Date().getMonth()) {
      data.searches = 0;
      data.exports = 0;
      data.month = new Date().getMonth();
    }
    return data;
  } catch(e) { return { searches: 0, exports: 0, month: new Date().getMonth() }; }
}

function trackSearch() {
  const usage = getUsage();
  usage.searches++;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

function canSearch() {
  const usage = getUsage();
  return usage.searches < PAYMENT_CONFIG.freeSearchesPerMonth;
}

function canExport() {
  const usage = getUsage();
  return usage.exports < PAYMENT_CONFIG.freeExportPerMonth;
}

function showPaywall(type) {
  const overlay = document.createElement("div");
  overlay.id = "paywall-overlay";
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.85);z-index:9999;
    display:flex;align-items:center;justify-content:center;
  `;
  
  overlay.innerHTML = `
    <div style="background:#13131a;border:1px solid #6366f1;border-radius:16px;padding:40px;max-width:500px;text-align:center;color:#fff;">
      <div style="font-size:3rem;margin-bottom:16px;">🔒</div>
      <h2 style="color:#6366f1;margin-bottom:12px;">升级到专业版</h2>
      <p style="color:#888;margin-bottom:8px;">
        免费版已用完（${PAYMENT_CONFIG.freeSearchesPerMonth}次搜索/${PAYMENT_CONFIG.freeExportPerMonth}次导出）
      </p>
      <div style="margin:24px 0;text-align:left;padding:16px;background:#0a0a0f;border-radius:8px;">
        <p style="margin:4px 0;">✅ 无限搜索</p>
        <p style="margin:4px 0;">✅ 邮箱 & 电话数据</p>
        <p style="margin:4px 0;">✅ CSV 批量导出</p>
        <p style="margin:4px 0;">✅ 智能评分排序</p>
      </div>
      <div style="font-size:2rem;font-weight:700;color:#10b981;margin:16px 0;">$99<span style="font-size:0.9rem;color:#888;">/月</span></div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="${PAYMENT_CONFIG.gumroadPro}" target="_blank" style="padding:12px 24px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          💳 立即订阅 $99/月
        </a>
        <a href="${PAYMENT_CONFIG.buymeacoffee}" target="_blank" style="padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          ☕ 请我喝咖啡
        </a>
      </div>
      <button onclick="document.getElementById('paywall-overlay').remove()" style="margin-top:20px;padding:8px 20px;background:transparent;border:1px solid #333;color:#888;border-radius:6px;cursor:pointer;">
        继续使用免费版
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

function showLimitedMessage(type) {
  const container = document.getElementById("results");
  container.innerHTML = `
    <div style="text-align:center;padding:40px;background:#13131a;border-radius:12px;border:1px solid #6366f1;">
      <h3 style="color:#6366f1;">🔒 免费版限制</h3>
      <p style="color:#888;margin:12px 0;">本月${type === 'search' ? '搜索' : '导出'}次数已用完</p>
      <p style="color:#888;">升级到专业版获得无限使用</p>
      <button onclick="showPaywall('${type}')" style="margin-top:16px;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">
        查看升级方案 →
      </button>
      <p style="margin-top:12px;font-size:0.8rem;color:#666;">
        已有 ${PAYMENT_CONFIG.freeSearchesPerMonth - getUsage().searches} 次搜索 / ${PAYMENT_CONFIG.freeExportPerMonth - getUsage().exports} 次导出可用
      </p>
    </div>`;
}

// Override the export function to enforce limits
const originalExportCSV = window.exportCSV;
window.exportCSV = function() {
  if (!canExport()) {
    showPaywall("export");
    return;
  }
  const usage = getUsage();
  usage.exports++;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  originalExportCSV();
};

// Override search to enforce limits
const originalSearch = window.searchLeads;
window.searchLeads = function() {
  if (!canSearch()) {
    showPaywall("search");
    return;
  }
  trackSearch();
  originalSearch();
};

console.log("💰 Payment integration loaded");
console.log("   Free: " + PAYMENT_CONFIG.freeSearchesPerMonth + " searches / " + PAYMENT_CONFIG.freeExportPerMonth + " exports per month");
console.log("   Pro: $99/mo (Gumroad)");
console.log("   Support: Buy Me a Coffee");
