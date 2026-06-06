let payrollData = [];

let pieChart;
let barChart;

function naira(value){

    return "₦" +
    Number(value).toLocaleString();

}

/* ==========================
   PAYE CALCULATION
========================== */

function calculatePAYE(taxableIncome){

    let tax = 0;

    let remaining =
    taxableIncome;

    const bands = [

        {limit:800000,rate:0},

        {limit:2200000,rate:0.15},

        {limit:9000000,rate:0.18},

        {limit:13000000,rate:0.21},

        {limit:25000000,rate:0.23}

    ];

    for(const band of bands){

        if(remaining <= 0)
        break;

        const amount =

        Math.min(
            remaining,
            band.limit
        );

        tax +=
        amount *
        band.rate;

        remaining -= amount;

    }

    if(remaining > 0){

        tax +=
        remaining *
        0.25;

    }

    return tax;

}

/* ==========================
   CSV PARSE
========================== */

document
.getElementById("uploadBtn")
.addEventListener(
"click",
loadCSV
);

function loadCSV(){

    const file =

    document
    .getElementById(
    "csvFile"
    )
    .files[0];

    if(!file){

        alert(
        "Select a CSV file"
        );

        return;

    }

    const reader =
    new FileReader();

    reader.onload =
    function(event){

        const csv =
        event.target.result;

        parseCSV(csv);

    };

    reader.readAsText(file);

}

function parseCSV(csv){

    payrollData = [];

    const rows =
    csv.trim().split("\n");

    rows.shift();

    rows.forEach(row=>{

        const cols =
        row.split(",");

        payrollData.push({

            name:cols[0],

            tin:cols[1],

            gross:
            Number(cols[2]),

            nhf:
            Number(cols[3]),

            nhis:
            Number(cols[4]),

            life:
            Number(cols[5]),

            mortgage:
            Number(cols[6]),

            rent:
            Number(cols[7])

        });

    });

    alert(
    payrollData.length +
    " employees loaded"
    );

}

/* ==========================
   CALCULATE PAYROLL
========================== */

document
.getElementById(
"calculatePayrollBtn"
)
.addEventListener(
"click",
calculatePayroll
);

function calculatePayroll(){

    const tableBody =

    document.getElementById(
    "tableBody"
    );

    tableBody.innerHTML = "";

    let totalGross = 0;
    let totalTax = 0;
    let totalNet = 0;

    payrollData.forEach(emp=>{

        const annualIncome =
        emp.gross * 12;

        const pension =
        annualIncome * 0.08;

        const rentRelief =
        Math.min(
        emp.rent * 0.20,
        500000
        );

        const annualNHF =
        emp.nhf * 12;

        const annualNHIS =
        emp.nhis * 12;

        const annualLife =
        emp.life * 12;

        const annualMortgage =
        emp.mortgage * 12;

        const taxable =

        annualIncome
        - pension
        - rentRelief
        - annualNHF
        - annualNHIS
        - annualLife
        - annualMortgage;

        const tax =
        calculatePAYE(
        taxable
        );

        const net =
        annualIncome
        - tax
        - pension;

        totalGross +=
        annualIncome;

        totalTax +=
        tax;

        totalNet +=
        net;

        tableBody.innerHTML += `

        <tr>

            <td>${emp.name}</td>

            <td>${emp.tin}</td>

            <td>${naira(annualIncome)}</td>

            <td>${naira(pension)}</td>

            <td>${naira(tax)}</td>

            <td>${naira(net)}</td>

        </tr>

        `;

    });

    document.getElementById(
    "employeeCount"
    ).textContent =
    payrollData.length;

    document.getElementById(
    "totalGross"
    ).textContent =
    naira(totalGross);

    document.getElementById(
    "totalTax"
    ).textContent =
    naira(totalTax);

    document.getElementById(
    "totalNet"
    ).textContent =
    naira(totalNet);

    createCharts(
    totalGross,
    totalTax,
    totalNet
    );

}

/* ==========================
   CHARTS
========================== */

function createCharts(
gross,
tax,
net
){

    if(pieChart)
    pieChart.destroy();

    if(barChart)
    barChart.destroy();

    pieChart =
    new Chart(

        document.getElementById(
        "payrollPieChart"
        ),

        {

            type:"pie",

            data:{

                labels:[
                    "PAYE",
                    "Net Income"
                ],

                datasets:[{

                    data:[
                        tax,
                        net
                    ]

                }]

            }

        }

    );

    barChart =
    new Chart(

        document.getElementById(
        "payrollBarChart"
        ),

        {

            type:"bar",

            data:{

                labels:[
                    "Gross",
                    "Tax",
                    "Net"
                ],

                datasets:[{

                    data:[
                        gross,
                        tax,
                        net
                    ]

                }]

            }

        }

    );

}