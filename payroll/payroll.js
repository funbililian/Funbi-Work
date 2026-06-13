let pieChart;
let barChart;

// ===================================
// FORMAT CURRENCY
// ===================================

function naira(value) {
    return "₦" + Number(value || 0).toLocaleString();
}

// ===================================
// UPLOAD CSV
// ===================================

document
    .getElementById("uploadBtn")
    .addEventListener("click", uploadPayrollFile);

function uploadPayrollFile() {
    const fileInput = document.getElementById("csvFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const csv = e.target.result;

        const employees = parseCSV(csv);

        renderPayrollTable(employees);

        localStorage.setItem(
            "batchPayrollResults",
            JSON.stringify(employees)
        );

        alert(
            `Payroll processed: ${employees.length} employees`
        );
    };

    reader.readAsText(file);
}

// ===================================
// CSV PARSER
// Expected:
// Name,Email,Salary
// ===================================

function parseCSV(csvText) {
    const rows = csvText.trim().split("\n");

    rows.shift(); // remove header

    return rows.map(row => {
        const cols = row.split(",");

        const name = cols[0];
        const email = cols[1];
        const salary = Number(cols[2]);

        const taxableIncome = salary * 0.8;
        const tax = taxableIncome * 0.1;
        const netSalary = salary - tax;

        return {
            name,
            email,
            result: {
                grossSalary: salary,
                taxableIncome,
                annualTax: tax,
                netSalary
            }
        };
    });
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

        const gross = emp.result.grossSalary;
        const tax = emp.result.annualTax;
        const net = emp.result.netSalary;

        totalGross += gross;
        totalTax += tax;
        totalNet += net;

        tableBody.innerHTML += `
        <tr>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${naira(gross)}</td>
            <td>${naira(emp.result.taxableIncome)}</td>
            <td>${naira(tax)}</td>
            <td>${naira(net)}</td>
        </tr>
        `;
    });

    document.getElementById("employeeCount").textContent =
        employees.length;

    document.getElementById("totalGross").textContent =
        naira(totalGross);

    document.getElementById("totalTax").textContent =
        naira(totalTax);

    document.getElementById("totalNet").textContent =
        naira(totalNet);

    createCharts(
        totalGross,
        totalTax,
        totalNet
    );
}

// ===================================
// CHARTS
// ===================================

function createCharts(gross, tax, net) {

    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();

    pieChart = new Chart(
        document.getElementById("payrollPieChart"),
        {
            type: "pie",
            data: {
                labels: ["Tax", "Net Income"],
                datasets: [{
                    data: [tax, net]
                }]
            }
        }
    );

    barChart = new Chart(
        document.getElementById("payrollBarChart"),
        {
            type: "bar",
            data: {
                labels: ["Gross", "Tax", "Net"],
                datasets: [{
                    label: "Payroll Summary",
                    data: [gross, tax, net]
                }]
            }
        }
    );
}

// ===================================
// LOAD SAVED RESULTS
// ===================================

window.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem(
        "batchPayrollResults"
    );

    if (saved) {
        renderPayrollTable(
            JSON.parse(saved)
        );
    }
});
