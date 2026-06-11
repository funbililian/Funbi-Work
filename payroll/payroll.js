let pieChart;
let barChart;
let currentBatchId = null;

const API_BASE = "https://tax-system-backend.onrender.com/api/payroll";

// ===================================
// FORMAT CURRENCY
// ===================================

function naira(value) {
    return "₦" + Number(value || 0).toLocaleString();
}

// ===================================
// UPLOAD CSV TO BACKEND
// ===================================

document.getElementById("uploadBtn").addEventListener("click", uploadPayrollFile);

async function uploadPayrollFile() {
    const fileInput = document.getElementById("csvFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Upload failed");
        }

        alert(`Payroll processed: ${data.totalProcessed} employees`);

        currentBatchId = data.batchJobId;

        // auto load results
        loadBatchResults(currentBatchId);

    } catch (error) {
        alert(error.message);
        console.error(error);
    }
    if (data.success) {

    localStorage.setItem(
        "batchJobId",
        data.batchJobId
    );

    alert(
        `Payroll uploaded successfully. ${data.totalProcessed} employees processed.`
    );

    }
}

// ===================================
// LOAD BATCH RESULTS
// ===================================

async function loadBatchResults(batchId) {
    try {
        const res = await fetch(`${API_BASE}/uploads/${batchId}/results`, {
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to load results");
        }

        renderPayrollTable(data.data);

    } catch (error) {
        console.error(error);
    }
}

// ===================================
// RENDER TABLE
// ===================================

function renderPayrollTable(employees) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    let totalGross = 0;
    let totalTax = 0;
    let totalNet = 0;

    employees.forEach(emp => {
        const result = emp.result;

        const gross = result.grossSalary;
        const tax = result.annualTax;
        const net = result.netSalary;

        totalGross += gross;
        totalTax += tax;
        totalNet += net;

        tableBody.innerHTML += `
            <tr>
                <td>${emp.userId?.first_name || "N/A"}</td>
                <td>${emp.userId?.email || "N/A"}</td>
                <td>${naira(gross)}</td>
                <td>${naira(result.taxableIncome)}</td>
                <td>${naira(tax)}</td>
                <td>${naira(net)}</td>
            </tr>
        `;
    });

    document.getElementById("employeeCount").textContent = employees.length;
    document.getElementById("totalGross").textContent = naira(totalGross);
    document.getElementById("totalTax").textContent = naira(totalTax);
    document.getElementById("totalNet").textContent = naira(totalNet);

    createCharts(totalGross, totalTax, totalNet);
}

// ===================================
// LOAD ALL UPLOAD HISTORY
// ===================================

async function loadUploadsHistory() {
    try {
        const res = await fetch(`${API_BASE}/uploads`, {
            credentials: "include"
        });

        const data = await res.json();

        console.log("Upload History:", data.data);

    } catch (error) {
        console.error(error);
    }
}

// ===================================
// CHARTS
// ===================================

function createCharts(gross, tax, net) {
    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    pieChart = new Chart(document.getElementById("payrollPieChart"), {
        type: "pie",
        data: {
            labels: ["Tax", "Net Income"],
            datasets: [{
                data: [tax, net]
            }]
        }
    });

    barChart = new Chart(document.getElementById("payrollBarChart"), {
        type: "bar",
        data: {
            labels: ["Gross", "Tax", "Net"],
            datasets: [{
                label: "Payroll Summary",
                data: [gross, tax, net]
            }]
        }
    });
}
