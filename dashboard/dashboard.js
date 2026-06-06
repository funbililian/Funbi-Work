// =============================
// LOAD USER DATA FROM LOCALSTORAGE
// =============================

let user = JSON.parse(
    localStorage.getItem("taxeaseUser")
);

// Demo data if none exists

if (!user) {

    user = {

        name: "John Doe",

        email: "john@example.com",

        profileType: "Employee",

        tin: "TIN123456",

        companyName: "ABC Limited",

        jobTitle: "Software Developer",

        grossIncome: 300000,

        payeTax: 45000,

        pension: 15000,

        nhf: 5000,

        deductions: 20000,

        netIncome: 235000,

        taxHistory: [
            {
                month: "January",
                income: 300000,
                tax: 45000,
                netIncome: 235000
            },
            {
                month: "February",
                income: 320000,
                tax: 47000,
                netIncome: 253000
            }
        ]

    };

}

// =============================
// PROFILE DETAILS
// =============================

document.getElementById("userName").textContent =
user.name || "N/A";

document.getElementById("userEmail").textContent =
user.email || "N/A";

document.getElementById("profileType").textContent =
user.profileType || "N/A";

document.getElementById("tin").textContent =
user.tin || "N/A";

// =============================
// DYNAMIC PROFILE SECTION
// =============================

const dynamicProfile =
document.getElementById("dynamicProfile");

if(user.profileType === "Employee"){

    dynamicProfile.innerHTML = `

        <div class="dynamic-grid">

            <div>
                <span>Company Name</span>
                <h3>${user.companyName || "-"}</h3>
            </div>

            <div>
                <span>Job Title</span>
                <h3>${user.jobTitle || "-"}</h3>
            </div>

            <div>
                <span>Monthly Salary</span>
                <h3>₦${(user.grossIncome || 0).toLocaleString()}</h3>
            </div>

        </div>

    `;

}

else if(user.profileType === "Freelancer"){

    dynamicProfile.innerHTML = `

        <div class="dynamic-grid">

            <div>
                <span>Profession</span>
                <h3>${user.profession || "-"}</h3>
            </div>

            <div>
                <span>Monthly Income</span>
                <h3>₦${(user.grossIncome || 0).toLocaleString()}</h3>
            </div>

            <div>
                <span>Years of Experience</span>
                <h3>${user.experience || "-"}</h3>
            </div>

        </div>

    `;

}

else if(user.profileType === "Business Owner"){

    dynamicProfile.innerHTML = `

        <div class="dynamic-grid">

            <div>
                <span>Business Name</span>
                <h3>${user.businessName || "-"}</h3>
            </div>

            <div>
                <span>CAC Number</span>
                <h3>${user.cacNumber || "-"}</h3>
            </div>

            <div>
                <span>Monthly Revenue</span>
                <h3>₦${(user.grossIncome || 0).toLocaleString()}</h3>
            </div>

        </div>

    `;

}

// =============================
// TAX SUMMARY CARDS
// =============================

document.getElementById("grossIncome")
.textContent =
"₦" +
(user.grossIncome || 0)
.toLocaleString();

document.getElementById("payeTax")
.textContent =
"₦" +
(user.payeTax || 0)
.toLocaleString();

document.getElementById("deductions")
.textContent =
"₦" +
(user.deductions || 0)
.toLocaleString();

document.getElementById("netIncome")
.textContent =
"₦" +
(user.netIncome || 0)
.toLocaleString();

// =============================
// TAX HISTORY TABLE
// =============================

const historyTable =
document.getElementById("historyTable");

if(user.taxHistory){

    user.taxHistory.forEach(item => {

        historyTable.innerHTML += `

            <tr>

                <td>${item.month}</td>

                <td>
                    ₦${item.income.toLocaleString()}
                </td>

                <td>
                    ₦${item.tax.toLocaleString()}
                </td>

                <td>
                    ₦${item.netIncome.toLocaleString()}
                </td>

            </tr>

        `;

    });

}

// =============================
// PIE CHART
// =============================

new Chart(
    document.getElementById("pieChart"),
    {
        type: "pie",

        data: {

            labels: [
                "PAYE Tax",
                "Pension",
                "NHF",
                "Net Income"
            ],

            datasets: [{

                data: [

                    user.payeTax || 0,
                    user.pension || 0,
                    user.nhf || 0,
                    user.netIncome || 0

                ],

                backgroundColor: [

                    "#028A07",
                    "#026805",
                    "#6B7280",
                    "#1F2937"

                ]

            }]
        }
    }
);

// =============================
// BAR CHART
// =============================

new Chart(
    document.getElementById("barChart"),
    {

        type: "bar",

        data: {

            labels: [
                "Income",
                "PAYE",
                "Pension",
                "NHF",
                "Net"
            ],

            datasets: [{

                label: "Amount (₦)",

                data: [

                    user.grossIncome || 0,
                    user.payeTax || 0,
                    user.pension || 0,
                    user.nhf || 0,
                    user.netIncome || 0

                ],

                backgroundColor: "#028A07"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    }
);

// =============================
// PDF BUTTON
// =============================

document
.querySelector(".pdf-btn")
.addEventListener("click", () => {

    window.print();

});

// =============================
// EXPORT REPORT
// =============================

document
.querySelector(".export-btn")
.addEventListener("click", () => {

    const report = `

TAXEASE TAX REPORT

Name: ${user.name}

Email: ${user.email}

Profile Type: ${user.profileType}

TIN: ${user.tin}

Gross Income:
₦${user.grossIncome.toLocaleString()}

PAYE Tax:
₦${user.payeTax.toLocaleString()}

Deductions:
₦${user.deductions.toLocaleString()}

Net Income:
₦${user.netIncome.toLocaleString()}

`;

    const blob =
    new Blob(
        [report],
        { type: "text/plain" }
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "Taxease_Report.txt";

    link.click();

});