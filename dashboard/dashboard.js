const API_BASE = "https://tax-system-backend.onrender.com/api";

// =============================
// STATE
// =============================

let user = null;

// =============================
// FETCH CURRENT USER (YOU NEED BACKEND ENDPOINT)
// =============================

async function loadUserProfile() {
    try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
            method: "GET",
            credentials: "include"
        });

        if (!res.ok) throw new Error("Failed to load user");

        const data = await res.json();
        user = data.data;

    } catch (error) {
        console.error(error);

        // fallback demo user
        user = {
            name: "Demo User",
            email: "demo@example.com",
            profileType: "Employee",
            tin: "N/A",
            grossIncome: 0,
            payeTax: 0,
            pension: 0,
            nhf: 0,
            deductions: 0,
            netIncome: 0
        };
    }
}

// =============================
// FETCH TAX HISTORY (REAL API)
// =============================

async function loadTaxHistory() {
    try {
        const res = await fetch(`${API_BASE}/tax/history`, {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        return data.data;

    } catch (error) {
        console.error("History error:", error);
        return [];
    }
}

// =============================
// RENDER PROFILE
// =============================

function renderProfile() {

    document.getElementById("userName").textContent = user.name || "N/A";
    document.getElementById("userEmail").textContent = user.email || "N/A";
    document.getElementById("profileType").textContent = user.profileType || "N/A";
    document.getElementById("tin").textContent = user.tin || "N/A";

    const dynamicProfile = document.getElementById("dynamicProfile");

    if (user.profileType === "Employee") {
        dynamicProfile.innerHTML = `
            <div class="dynamic-grid">
                <div><span>Company</span><h3>${user.companyName || "-"}</h3></div>
                <div><span>Job Title</span><h3>${user.jobTitle || "-"}</h3></div>
                <div><span>Salary</span><h3>₦${(user.grossIncome || 0).toLocaleString()}</h3></div>
            </div>
        `;
    }

    else if (user.profileType === "Freelancer") {
        dynamicProfile.innerHTML = `
            <div class="dynamic-grid">
                <div><span>Profession</span><h3>${user.profession || "-"}</h3></div>
                <div><span>Income</span><h3>₦${(user.grossIncome || 0).toLocaleString()}</h3></div>
                <div><span>Experience</span><h3>${user.experience || "-"}</h3></div>
            </div>
        `;
    }

    else if (user.profileType === "Business Owner") {
        dynamicProfile.innerHTML = `
            <div class="dynamic-grid">
                <div><span>Business</span><h3>${user.businessName || "-"}</h3></div>
                <div><span>CAC</span><h3>${user.cacNumber || "-"}</h3></div>
                <div><span>Revenue</span><h3>₦${(user.grossIncome || 0).toLocaleString()}</h3></div>
            </div>
        `;
    }
}

// =============================
// TAX CARDS
// =============================

function renderCards() {
    document.getElementById("grossIncome").textContent = "₦" + (user.grossIncome || 0).toLocaleString();
    document.getElementById("payeTax").textContent = "₦" + (user.payeTax || 0).toLocaleString();
    document.getElementById("deductions").textContent = "₦" + (user.deductions || 0).toLocaleString();
    document.getElementById("netIncome").textContent = "₦" + (user.netIncome || 0).toLocaleString();
}

// =============================
// TAX HISTORY TABLE (REAL API)
// =============================

async function renderHistory() {

    const history = await loadTaxHistory();

    const table = document.getElementById("historyTable");

    table.innerHTML = "";

    history.forEach(item => {

        table.innerHTML += `
            <tr>
                <td>${new Date(item.createdAt).toDateString()}</td>
                <td>₦${item.result.grossSalary?.toLocaleString() || 0}</td>
                <td>₦${item.result.annualTax?.toLocaleString() || 0}</td>
                <td>₦${item.result.netSalary?.toLocaleString() || 0}</td>
            </tr>
        `;

    });
}

// =============================
// CHARTS (REAL DATA)
// =============================

function renderCharts() {

    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: ["Tax", "Pension", "NHF", "Net"],
            datasets: [{
                data: [
                    user.payeTax || 0,
                    user.pension || 0,
                    user.nhf || 0,
                    user.netIncome || 0
                ]
            }]
        }
    });

    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: ["Income", "Tax", "Pension", "NHF", "Net"],
            datasets: [{
                data: [
                    user.grossIncome || 0,
                    user.payeTax || 0,
                    user.pension || 0,
                    user.nhf || 0,
                    user.netIncome || 0
                ]
            }]
        }
    });
}

// =============================
// CALCULATOR
// =============================

const calculatorBtn = document.getElementById("calculatorBtn");

if (calculatorBtn) {
  calculatorBtn.addEventListener("click", () => {
    window.location.href = "../calculator/index.html";
  });
}


// =============================
// REPORT DOWNLOAD (API INTEGRATION)
// =============================

document.querySelector(".pdf-btn").addEventListener("click", async () => {
    const res = await fetch(`${API_BASE}/reports/individual/pdf`, {
        method: "GET",
        credentials: "include"
    });

    const data = await res.json();

    window.location.href = `${API_BASE}/reports/${data.reportId}/download`;
});

// =============================
// EXPORT PAYROLL REPORT (CSV)
// =============================

document.querySelector(".export-btn").addEventListener(
    "click",
    async () => {

        try {

            const batchJobId =
            localStorage.getItem(
                "batchJobId"
            );

            if (!batchJobId) {

                alert(
                    "No payroll batch found. Please upload and process payroll first."
                );

                return;
            }

            const response =
            await fetch(
                `${API_BASE}/reports/payroll/csv`,
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        batchJobId
                    })
                }
            );

            const data =
            await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to generate report"
                );

            }

            if (!data.reportId) {

                throw new Error(
                    "No report ID returned from server"
                );

            }

            // Download generated report

            window.location.href =
            `${API_BASE}/reports/${data.reportId}/download`;

        }

        catch (error) {

            console.error(
                "Export Error:",
                error
            );

            alert(
                error.message ||
                "Unable to export report"
            );

        }

    }
);

// =============================
// INIT DASHBOARD
// =============================

async function initDashboard() {

    await loadUserProfile();

    renderProfile();
    renderCards();
    await renderHistory();
    renderCharts();
}

initDashboard();
