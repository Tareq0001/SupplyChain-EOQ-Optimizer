/* ==========================================================================
   SupplyChain EOQ Optimizer V2 - Nordic Serene JS Core
   ========================================================================== */

const i18n = {
  en: {
    badgeEngine: "NORDIC SERENE MINIMALISM · INVENTORY & EOQ OPTIMIZER",
    appTitle: "SupplyChain Studio",
    appSub: "Nordic Balance V2",
    appDesc: "Wilson Economic Order Quantity, Stochastic Safety Stock Buffers & Multi-SKU ABC/XYZ Categorization",
    policyStateLabel: "POLICY BALANCE:",
    langLabel: "العربية",
    exportBtn: "Export Inventory Audit",
    presetsLabel: "Calibrated Industry Presets:",
    presetStd: "Standard Manufacturing (D=10k, L=7d)",
    presetFmcg: "High-Velocity FMCG (D=45k, L=3d)",
    presetAero: "Aerospace Spare Parts (High Value, L=21d)",
    presetPharma: "Cold-Chain Pharma (99.9% Service Level)",
    resetBtn: "Reset",
    kpiEOQ: "Economic Order Quantity (EOQ)",
    kpiCost: "Total Inventory Cost",
    kpiCostSub: "Holding + Ordering Minimum",
    kpiROP: "Reorder Point (ROP)",
    kpiSS: "Safety Stock Buffer (SS)",
    paramsTitle: "Inventory Parameters",
    paramsDesc: "Calibrate annual demand, replenishment setup costs, holding rates, and lead times.",
    paramD: "Annual Demand (D)",
    paramS: "Ordering / Setup Cost (S)",
    paramC: "Unit Cost (C)",
    paramH: "Holding Rate (h)",
    paramL: "Lead Time (L)",
    paramService: "Service Level",
    canvasTitle: "Total Cost Curves & Trade-Off",
    canvasDesc: "Holding cost increases linearly while ordering cost decreases asymptotically.",
    legTotal: "Total Cost Curve",
    legHolding: "Holding Cost (H · Q/2)",
    legOrdering: "Ordering Cost (S · D/Q)",
    legOpt: "Optimal EOQ Q*",
    tabSKU: "Multi-SKU Portfolio (ABC / XYZ Matrix)",
    tabMath: "Stochastic Safety Stock Formulas",
    tabPolicy: "Continuous Review (s, Q) Inventory Policy",
    footerStatus: "Nordic Serene Minimalist Supply Chain Optimizer V2"
  },
  ar: {
    badgeEngine: "النمط النوردي الاسكندنافي الهادئ · إدارة المخزون وسلاسل الإمداد",
    appTitle: "استوديو سلاسل الإمداد",
    appSub: "الاتزان النوردي V2",
    appDesc: "حجم الطلبية الاقتصادي (EOQ)، مخزون الأمان العشوائي، وتصنيف المحفظة بمصفوفة ABC/XYZ",
    policyStateLabel: "توازن السياسة:",
    langLabel: "English",
    exportBtn: "تصدير تقرير المخزون",
    presetsLabel: "السيناريوهات الصناعية الموزونة:",
    presetStd: "تصنيع قياسي (D=10k, L=7d)",
    presetFmcg: "سلع استهلاكية سريعة (D=45k, L=3d)",
    presetAero: "قطع طيران عالية القيمة (L=21d)",
    presetPharma: "أدوية وسلسلة تبريد (مستوى خدمة 99.9%)",
    resetBtn: "إعادة ضبط",
    kpiEOQ: "الحجم الاقتصادي للطلبية (EOQ)",
    kpiCost: "إجمالي تكلفة إدارة المخزون",
    kpiCostSub: "أدنى نقطة لمجموع تكاليف التخزين والطلب",
    kpiROP: "نقطة إعادة الطلب (ROP)",
    kpiSS: "مخزون الأمان الوقائي (SS)",
    paramsTitle: "معايير وسياسات المخزون",
    paramsDesc: "ضبط الطلب السنوي، تكلفة أمر التوريد، نسبة الاحتفاظ بالمخزون، وفترة التوريد.",
    paramD: "الطلب السنوي (D)",
    paramS: "تكلفة إعداد/أمر الشراء (S)",
    paramC: "سعر شراء الوحدة (C)",
    paramH: "نسبة تكلفة الاحتفاظ (h)",
    paramL: "فترة التوريد (L)",
    paramService: "مستوى الخدمة المستهدف",
    canvasTitle: "منحنيات التكلفة ونقطة الاتزان",
    canvasDesc: "تكلفة التخزين ترتفع خطياً بينما تنخفض تكلفة الطلب بشكل عكسي.",
    legTotal: "منحنى التكلفة الكلية",
    legHolding: "تكلفة التخزين (H · Q/2)",
    legOrdering: "تكلفة الطلب (S · D/Q)",
    legOpt: "الحجم الأمثل Q*",
    tabSKU: "محفظة الأصناف (مصفوفة ABC / XYZ)",
    tabMath: "معادلات مخزون الأمان الاحتمالي",
    tabPolicy: "سياسة المراجعة المستمرة (s, Q)",
    footerStatus: "استوديو سلاسل الإمداد بنمط التصميم النوردي الاسكندنافي الهادئ V2"
  }
};

let currentLang = 'en';

let D = 10000;
let S = 200;
let C = 25;
let h = 0.20;
let L = 7;
let sigma_d = 12;
let sigma_L = 1.5;
let serviceLevelPct = 95;

const SKU_DATA = [
  { code: "SKU-901", nameEn: "Titanium Alloy Rods 25mm", nameAr: "قضبان تيتانيوم صلب 25 مم", demand: 1200, price: 180, cv: 0.12 },
  { code: "SKU-402", nameEn: "Hydraulic Pump Assembly", nameAr: "مضخات هيدروليكية مجمعة", demand: 850, price: 120, cv: 0.18 },
  { code: "SKU-315", nameEn: "High-Temp Ceramic Bearings", nameAr: "رولمان بلي سيراميك حراري", demand: 2400, price: 35, cv: 0.28 },
  { code: "SKU-108", nameEn: "Synthetic Industrial Oil (Drum)", nameAr: "براميل زيوت صناعية تخليقية", demand: 600, price: 90, cv: 0.35 },
  { code: "SKU-650", nameEn: "Pneumatic Valves 1/2 Inch", nameAr: "صمامات هوائية نيوماتيكية", demand: 3200, price: 12, cv: 0.22 },
  { code: "SKU-077", nameEn: "M8 Stainless Steel Hex Bolts", nameAr: "مسامير استانلس ستيل M8", demand: 25000, price: 0.40, cv: 0.45 },
  { code: "SKU-021", nameEn: "Corrugated Shipping Cartons", nameAr: "كراتين شحن مقوى مزدوج", demand: 18000, price: 0.35, cv: 0.15 }
];

document.addEventListener('DOMContentLoaded', () => {
  setupLanguage();
  setupEventListeners();
  setupPresets();
  setupTabs();

  recalculateAll();
  initCostCanvas();

  window.addEventListener('resize', () => {
    initCostCanvas();
  });
});

function setupLanguage() {
  const toggle = document.getElementById('langToggle');
  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
    document.getElementById('langLabel').textContent = i18n[currentLang].langLabel;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[currentLang][key]) {
        el.textContent = i18n[currentLang][key];
      }
    });

    recalculateAll();
  });
}

function setupEventListeners() {
  const slD = document.getElementById('sliderD');
  const slS = document.getElementById('sliderS');
  const slC = document.getElementById('sliderC');
  const slH = document.getElementById('sliderH');
  const slL = document.getElementById('sliderL');
  const slServ = document.getElementById('sliderService');

  slD.addEventListener('input', (e) => {
    D = parseInt(e.target.value);
    document.getElementById('valD').textContent = D.toLocaleString() + ' units';
    clearActivePreset();
    recalculateAll();
  });

  slS.addEventListener('input', (e) => {
    S = parseInt(e.target.value);
    document.getElementById('valS').textContent = '$' + S + ' / order';
    clearActivePreset();
    recalculateAll();
  });

  slC.addEventListener('input', (e) => {
    C = parseInt(e.target.value);
    document.getElementById('valC').textContent = '$' + C.toFixed(2);
    clearActivePreset();
    recalculateAll();
  });

  slH.addEventListener('input', (e) => {
    h = parseInt(e.target.value) / 100;
    document.getElementById('valH').textContent = Math.round(h * 100) + '% ($' + (C * h).toFixed(1) + '/yr)';
    clearActivePreset();
    recalculateAll();
  });

  slL.addEventListener('input', (e) => {
    L = parseInt(e.target.value);
    document.getElementById('valL').textContent = L + ' days';
    clearActivePreset();
    recalculateAll();
  });

  slServ.addEventListener('input', (e) => {
    serviceLevelPct = parseInt(e.target.value);
    document.getElementById('valService').textContent = serviceLevelPct.toFixed(1) + '%';
    clearActivePreset();
    recalculateAll();
  });

  document.getElementById('resetDefaultsBtn').addEventListener('click', () => {
    setPreset('standard');
  });

  document.getElementById('exportReportBtn').addEventListener('click', exportAuditReport);
}

function clearActivePreset() {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

function setupPresets() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = btn.getAttribute('data-preset');
      setPreset(p);
    });
  });
}

function setPreset(p) {
  if (p === 'standard') {
    D = 10000; S = 200; C = 25; h = 0.20; L = 7; serviceLevelPct = 95;
  } else if (p === 'fmcg') {
    D = 45000; S = 80; C = 8; h = 0.18; L = 3; serviceLevelPct = 95;
  } else if (p === 'aero') {
    D = 1500; S = 500; C = 220; h = 0.25; L = 21; serviceLevelPct = 99;
  } else if (p === 'pharma') {
    D = 12000; S = 350; C = 75; h = 0.22; L = 10; serviceLevelPct = 99;
  }

  document.getElementById('sliderD').value = D;
  document.getElementById('valD').textContent = D.toLocaleString() + ' units';

  document.getElementById('sliderS').value = S;
  document.getElementById('valS').textContent = '$' + S + ' / order';

  document.getElementById('sliderC').value = C;
  document.getElementById('valC').textContent = '$' + C.toFixed(2);

  document.getElementById('sliderH').value = Math.round(h * 100);
  document.getElementById('valH').textContent = Math.round(h * 100) + '% ($' + (C * h).toFixed(1) + '/yr)';

  document.getElementById('sliderL').value = L;
  document.getElementById('valL').textContent = L + ' days';

  document.getElementById('sliderService').value = serviceLevelPct;
  document.getElementById('valService').textContent = serviceLevelPct.toFixed(1) + '%';

  recalculateAll();
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });
}

function getZScore(sl) {
  if (sl >= 99) return 2.326;
  if (sl >= 98) return 2.054;
  if (sl >= 95) return 1.645;
  if (sl >= 90) return 1.282;
  return 1.036;
}

function recalculateAll() {
  const H = C * h;
  const eoq = Math.round(Math.sqrt((2 * D * S) / H));

  const totalHoldingCost = (eoq / 2) * H;
  const totalOrderingCost = (D / eoq) * S;
  const totalCost = totalHoldingCost + totalOrderingCost;

  // Daily demand d
  const d_daily = D / 365;
  const Z = getZScore(serviceLevelPct);

  // Safety stock: SS = Z * sqrt(L * sigma_d^2 + d^2 * sigma_L^2)
  const ssVariance = L * Math.pow(sigma_d, 2) + Math.pow(d_daily, 2) * Math.pow(sigma_L, 2);
  const ss = Math.round(Z * Math.sqrt(ssVariance));
  const leadTimeDemand = Math.round(d_daily * L);
  const rop = leadTimeDemand + ss;

  document.getElementById('kpiEOQ').textContent = eoq.toLocaleString() + ' units';
  document.getElementById('kpiTotalCost').textContent = '$' + Math.round(totalCost).toLocaleString() + ' / yr';
  document.getElementById('kpiROP').textContent = rop.toLocaleString() + ' units';
  document.getElementById('kpiSS').textContent = ss.toLocaleString() + ' units';

  renderSKUTable();
  renderMathExplainer(eoq, rop, ss, Z, H);
  renderPolicyCard(eoq, rop, ss);

  drawCostCanvas(eoq, H);
}

function renderSKUTable() {
  const table = document.getElementById('skuTable');
  let html = `
    <thead>
      <tr>
        <th>SKU Code</th>
        <th>Description</th>
        <th>Annual Demand</th>
        <th>Unit Price</th>
        <th>Annual Spend</th>
        <th>ABC Category</th>
        <th>XYZ Predictability</th>
      </tr>
    </thead>
    <tbody>
  `;

  SKU_DATA.forEach(sku => {
    const spend = sku.demand * sku.price;
    const name = currentLang === 'ar' ? sku.nameAr : sku.nameEn;
    const abc = spend > 50000 ? 'Class A (High Value)' : spend > 15000 ? 'Class B (Moderate)' : 'Class C (Low Value)';
    const xyz = sku.cv < 0.20 ? 'Class X (Stable)' : sku.cv < 0.35 ? 'Class Y (Variable)' : 'Class Z (Erratic)';

    html += `
      <tr>
        <td><strong>${sku.code}</strong></td>
        <td>${name}</td>
        <td>${sku.demand.toLocaleString()}</td>
        <td>$${sku.price.toFixed(2)}</td>
        <td>$${spend.toLocaleString()}</td>
        <td style="color:${spend > 50000 ? 'var(--nordic-sage)' : 'var(--nordic-muted)'}; font-weight:700;">${abc}</td>
        <td>${xyz}</td>
      </tr>
    `;
  });

  html += '</tbody>';
  table.innerHTML = html;
}

function renderMathExplainer(eoq, rop, ss, Z, H) {
  const box = document.getElementById('mathExplainer');
  box.innerHTML = `
    [STOCHASTIC SAFETY STOCK FORMULA]<br>
    SS = Z × √(L · σd² + d² · σL²)<br>
    - Z-Score @ ${serviceLevelPct}%: <strong>${Z.toFixed(3)}</strong><br>
    - Expected Lead Time Demand (d × L): <strong>${Math.round((D / 365) * L)} units</strong><br>
    - Safety Stock Buffer (SS): <strong>${ss} units</strong><br>
    - Reorder Point Trigger (ROP = dL + SS): <strong>${rop} units</strong><br>
    <br>
    [WILSON EOQ FORMULA]<br>
    Q* = √(2 · D · S / H) = √(2 × ${D} × $${S} / $${H.toFixed(2)}) = <strong>${eoq} units</strong>
  `;
}

function renderPolicyCard(eoq, rop, ss) {
  const card = document.getElementById('policyCard');
  card.innerHTML = `
    [CONTINUOUS REVIEW (s, Q) OPERATING POLICY]<br>
    1. Continuous Telemetry: Track inventory level I = On-Hand + On-Order - Backorders.<br>
    2. Replenishment Trigger (s): When inventory position drops to or below <strong>${rop} units</strong>, instantaneously dispatch order.<br>
    3. Order Quantity (Q): Place order of exactly <strong>${eoq} units</strong>.<br>
    4. Buffer Protection: The <strong>${ss} units</strong> safety buffer protects against 95%+ of demand spikes during supplier transit.
  `;
}

// Canvas
let cCanvas, cCtx;
function initCostCanvas() {
  cCanvas = document.getElementById('costCanvas');
  if (!cCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = cCanvas.parentElement.getBoundingClientRect();
  cCanvas.width = rect.width * dpr;
  cCanvas.height = rect.height * dpr;
  cCtx = cCanvas.getContext('2d');
  cCtx.scale(dpr, dpr);
  drawCostCanvas(Math.round(Math.sqrt((2 * D * S) / (C * h))), C * h);
}

function drawCostCanvas(eoq, H) {
  if (!cCanvas || !cCtx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = cCanvas.width / dpr;
  const h = cCanvas.height / dpr;

  cCtx.clearRect(0, 0, w, h);

  const pad = { top: 25, right: 30, bottom: 40, left: 55 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const maxQ = eoq * 2.5;
  const minCost = 2 * Math.sqrt(2 * D * S * H);
  const maxCost = minCost * 2.2;

  // Grid
  cCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  cCtx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (plotH / 4) * i;
    cCtx.beginPath();
    cCtx.moveTo(pad.left, y);
    cCtx.lineTo(pad.left + plotW, y);
    cCtx.stroke();
  }

  // 1. Holding Cost Line (H * Q / 2)
  cCtx.beginPath();
  cCtx.moveTo(pad.left, pad.top + plotH);
  const yHoldMax = pad.top + ((maxCost - (H * maxQ / 2)) / maxCost) * plotH;
  cCtx.lineTo(pad.left + plotW, Math.max(pad.top, yHoldMax));
  cCtx.strokeStyle = "#f59e0b";
  cCtx.lineWidth = 2;
  cCtx.stroke();

  // 2. Ordering Cost Curve (S * D / Q)
  cCtx.beginPath();
  const steps = 80;
  for (let i = 1; i <= steps; i++) {
    const q = (i / steps) * maxQ;
    const costOrd = (S * D) / q;
    const x = pad.left + (q / maxQ) * plotW;
    const y = pad.top + ((maxCost - costOrd) / maxCost) * plotH;
    if (i === 1) cCtx.moveTo(x, Math.min(pad.top + plotH, y));
    else cCtx.lineTo(x, Math.max(pad.top, Math.min(pad.top + plotH, y)));
  }
  cCtx.strokeStyle = "#38bdf8";
  cCtx.lineWidth = 2;
  cCtx.stroke();

  // 3. Total Cost Curve
  cCtx.beginPath();
  for (let i = 1; i <= steps; i++) {
    const q = (i / steps) * maxQ;
    const costTot = (H * q / 2) + (S * D / q);
    const x = pad.left + (q / maxQ) * plotW;
    const y = pad.top + ((maxCost - costTot) / maxCost) * plotH;
    if (i === 1) cCtx.moveTo(x, y);
    else cCtx.lineTo(x, y);
  }
  cCtx.strokeStyle = "#10b981";
  cCtx.lineWidth = 3;
  cCtx.stroke();

  // Draw EOQ vertical guideline
  const xEOQ = pad.left + (eoq / maxQ) * plotW;
  cCtx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  cCtx.lineWidth = 1.5;
  cCtx.setLineDash([4, 4]);
  cCtx.beginPath();
  cCtx.moveTo(xEOQ, pad.top);
  cCtx.lineTo(xEOQ, pad.top + plotH);
  cCtx.stroke();
  cCtx.setLineDash([]);

  // Circle at minimum point
  const yEOQ = pad.top + ((maxCost - minCost) / maxCost) * plotH;
  cCtx.beginPath();
  cCtx.arc(xEOQ, yEOQ, 5, 0, Math.PI * 2);
  cCtx.fillStyle = "#10b981";
  cCtx.fill();
  cCtx.strokeStyle = "#fff";
  cCtx.stroke();

  cCtx.fillStyle = "#10b981";
  cCtx.font = "bold 11px JetBrains Mono";
  cCtx.textAlign = "center";
  cCtx.fillText(`Q* = ${eoq}`, xEOQ, yEOQ - 12);
}

function exportAuditReport() {
  const H = C * h;
  const eoq = Math.round(Math.sqrt((2 * D * S) / H));
  const totalCost = (eoq / 2) * H + (D / eoq) * S;

  const reportLines = [
    "=========================================================",
    "      NORDIC INVENTORY & SUPPLY CHAIN AUDIT REPORT",
    "=========================================================",
    `Generated: ${new Date().toISOString()}`,
    `Author: Tareq Abu Ashee (أ. طارق ابوعشي)`,
    "",
    "INVENTORY PARAMETERS:",
    `  - Annual Demand (D): ${D.toLocaleString()} units`,
    `  - Order / Setup Cost (S): $${S} / order`,
    `  - Unit Purchase Price (C): $${C}`,
    `  - Annual Holding Cost (H): $${H.toFixed(2)}/unit/year`,
    `  - Supplier Lead Time (L): ${L} days`,
    "",
    "OPTIMAL CONTINUOUS POLICY (s, Q):",
    `  - Economic Order Quantity (EOQ): ${eoq} units`,
    `  - Safety Stock Buffer (SS): ${document.getElementById('kpiSS').textContent}`,
    `  - Reorder Point Trigger (ROP): ${document.getElementById('kpiROP').textContent}`,
    `  - Total Annual Inventory Cost: $${Math.round(totalCost).toLocaleString()}`,
    "",
    "OPERATING DIRECTIVE: Enforce automated PO generation when inventory touches ROP."
  ];

  const report = reportLines.join("\n");
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `SupplyChain_Nordic_Audit_${Date.now()}.txt`;
  a.click();
}
