// ===================================
// CONFIG
// ===================================

const API_BASE = "https://tax-system-backend.onrender.com/api/tax";

// ===================================
// ELEMENTS
// ===================================

const profileType = document.getElementById("profileType");
const businessSection = document.getElementById("businessSection");
const batchPayrollBtn = document.getElementById("batchPayrollBtn");
const calculateBtn = document.getElementById("calculateBtn");
const saveBtn = document.getElementById("saveBtn");

let pieChart;
let barChart;

// ===================================
// PROFILE SWITCHING
// ===================================

function toggleProfileSections() {
  businessSection.style.display =
    profileType.value === "Business Owner" ? "block" : "none";
}

toggleProfileSections();
profileType.addEventListener("change", toggleProfileSections);

// ===================================
// NAVIGATION
// ===================================

batchPayrollBtn.addEventListener("click", () => {
  window.location.href = "payroll/index.html";
});

makePaymentBtn.addEventListener("click", () => {
  window.location.href = "../payment/index.html";
});

// ===================================
// HELPERS
// ===================================

function naira(value) {
  return "₦" + Number(value).toLocaleString();
}

function getInput(id) {
  return Number(document.getElementById(id).value || 0);
}

// ===================================
// COLLECT DATA
// ===================================

function collectPayload() {
  const profile = profileType.value;

  let salary = 0;
  let revenue = 0;
  let expenses = 0;

  if (profile !== "Business Owner") {
    salary = getInput("grossIncome") * 12;
  } else {
    revenue = getInput("annualRevenue");
    expenses = getInput("annualExpenses");
    salary = Math.max(revenue - expenses, 0);
  }

  const deductions = {
    pension: salary * 0.08,
    rent: Math.min(getInput("annualRent") * 0.2, 500000),
    nhf: getInput("nhf") * 12,
    nhis: getInput("nhis") * 12,
    lifeInsurance: getInput("lifeInsurance") * 12,
    mortgageInterest: getInput("mortgageInterest") * 12,
  };

  return { salary, deductions, profile };
}

// ===================================
// API CALL - CALCULATE TAX
// ===================================

async function calculateTax() {
  try {
    const payload = collectPayload();

    const res = await fetch(`${API_BASE}/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Calculation failed");
      
    }

    renderResults(data.data);
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

calculateBtn.addEventListener("click", calculateTax);

// ===================================
// RENDER RESULTS
// ===================================

function renderResults(result) {
  const {
    annualIncome,
    annualPAYE,
    annualPension,
    annualRentRelief,
    annualNHF,
    annualNHIS,
    annualLifeInsurance,
    annualMortgageInterest,
    annualNet,
  } = result;

  const annualDeductions =
    annualPension +
    annualNHF +
    annualNHIS +
    annualLifeInsurance +
    annualMortgageInterest;

  // MONTHLY
  document.getElementById("monthlyGross").textContent = naira(
    annualIncome / 12,
  );

  document.getElementById("monthlyPension").textContent = naira(
    annualPension / 12,
  );

  document.getElementById("monthlyRentRelief").textContent = naira(
    annualRentRelief / 12,
  );

  document.getElementById("monthlyPAYE").textContent = naira(annualPAYE / 12);

  document.getElementById("monthlyNet").textContent = naira(annualNet / 12);

  // ANNUAL
  document.getElementById("annualGross").textContent = naira(annualIncome);

  document.getElementById("annualPension").textContent = naira(annualPension);

  document.getElementById("annualRentRelief").textContent =
    naira(annualRentRelief);

  document.getElementById("annualPAYE").textContent = naira(annualPAYE);

  document.getElementById("annualNet").textContent = naira(annualNet);

  // BREAKDOWN
  document.getElementById("grossBreakdown").textContent = naira(annualIncome);

  document.getElementById("pensionBreakdown").textContent =
    naira(annualPension);

  document.getElementById("nhfBreakdown").textContent = naira(annualNHF);

  document.getElementById("rentReliefBreakdown").textContent =
    naira(annualRentRelief);

  document.getElementById("taxBreakdown").textContent = naira(annualPAYE);

  document.getElementById("netBreakdown").textContent = naira(annualNet);

  // CHARTS
  updateCharts({
    annualIncome,
    annualPAYE,
    annualPension,
    annualRentRelief,
    annualDeductions,
    annualNet,
  });

  // SAVE LOCAL (for quick dashboard preview)
  localStorage.setItem(
    "taxeaseUser",
    JSON.stringify({
      profileType: profileType.value,
      annualIncome,
      annualPAYE,
      annualNet,
    }),
  );
}

// ===================================
// CHARTS
// ===================================

function updateCharts(data) {
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(document.getElementById("taxPieChart"), {
    type: "pie",
    data: {
      labels: ["PAYE", "Pension", "Rent Relief", "Net Income"],
      datasets: [
        {
          data: [
            data.annualPAYE,
            data.annualPension,
            data.annualRentRelief,
            data.annualNet,
          ],
        },
      ],
    },
  });

  barChart = new Chart(document.getElementById("incomeBarChart"), {
    type: "bar",
    data: {
      labels: ["Income", "Rent Relief", "PAYE", "Deductions", "Net"],
      datasets: [
        {
          label: "Annual Amount (₦)",
          data: [
            data.annualIncome,
            data.annualRentRelief,
            data.annualPAYE,
            data.annualDeductions,
            data.annualNet,
          ],
        },
      ],
    },
  });
}

// ===================================
// SAVE TO BACKEND
// ===================================

async function saveCalculation() {
  try {
    const payload = collectPayload();

    const res = await fetch(`${API_BASE}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Save failed");
    }

    alert("Calculation saved successfully");
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

if (saveBtn) {
  saveBtn.addEventListener("click", saveCalculation);
}
