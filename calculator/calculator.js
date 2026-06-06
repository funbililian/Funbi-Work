// ===================================
// ELEMENTS
// ===================================

const profileType =
document.getElementById("profileType");

const businessSection =
document.getElementById("businessSection");

const batchPayrollBtn =
document.getElementById("batchPayrollBtn");

const calculateBtn =
document.getElementById("calculateBtn");

let pieChart;
let barChart;

// ===================================
// PROFILE TYPE SWITCHING
// ===================================

function toggleProfileSections(){

    if(
        profileType.value ===
        "Business Owner"
    ){

        businessSection.style.display =
        "block";

    }

    else{

        businessSection.style.display =
        "none";

    }

}

toggleProfileSections();

profileType.addEventListener(
    "change",
    toggleProfileSections
);

// ===================================
// PAYROLL PAGE REDIRECT
// ===================================

batchPayrollBtn.addEventListener(
    "click",
    () => {

        window.location.href =
        "payroll.html";

    }
);

// ===================================
// PAYE TAX BANDS
// ===================================

function calculatePAYE(
    taxableIncome
){

    let tax = 0;

    let remaining =
    taxableIncome;

    const bands = [

        {
            limit:800000,
            rate:0
        },

        {
            limit:2200000,
            rate:0.15
        },

        {
            limit:9000000,
            rate:0.18
        },

        {
            limit:13000000,
            rate:0.21
        },

        {
            limit:25000000,
            rate:0.23
        }

    ];

    for(const band of bands){

        if(
            remaining <= 0
        ){
            break;
        }

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

    if(
        remaining > 0
    ){

        tax +=
        remaining *
        0.25;

    }

    return Math.round(tax);

}

// ===================================
// FORMAT CURRENCY
// ===================================

function naira(value){

    return "₦" +
    Number(value)
    .toLocaleString();

}

// ===================================
// CALCULATE
// ===================================

calculateBtn.addEventListener(
    "click",
    calculateTax
);

function calculateTax(){

    const currentProfile =
    profileType.value;

    let annualIncome = 0;

    // ===================================
    // EMPLOYEE / FREELANCER
    // ===================================

    if(
        currentProfile !==
        "Business Owner"
    ){

        const monthlyIncome =

        Number(
            document.getElementById(
                "grossIncome"
            ).value
        );

        annualIncome =
        monthlyIncome * 12;

    }

    // ===================================
    // BUSINESS OWNER
    // ===================================

    else{

        const revenue =

        Number(
            document.getElementById(
                "annualRevenue"
            ).value
        );

        const expenses =

        Number(
            document.getElementById(
                "annualExpenses"
            ).value
        );

        annualIncome =
        Math.max(
            revenue - expenses,
            0
        );

    }

    // ===================================
    // PENSION (8%)
    // ===================================

    const annualPension =

    annualIncome * 0.08;

    // ===================================
    // RENT RELIEF
    // ===================================

    const annualRent =

    Number(
        document.getElementById(
            "annualRent"
        ).value
    );

    const annualRentRelief =

    Math.min(
        annualRent * 0.20,
        500000
    );

    // ===================================
    // OTHER RELIEFS
    // ===================================

    const annualNHF =

    Number(
        document.getElementById(
            "nhf"
        ).value
    ) * 12;

    const annualNHIS =

    Number(
        document.getElementById(
            "nhis"
        ).value
    ) * 12;

    const annualLifeInsurance =

    Number(
        document.getElementById(
            "lifeInsurance"
        ).value
    ) * 12;

    const annualMortgageInterest =

    Number(
        document.getElementById(
            "mortgageInterest"
        ).value
    ) * 12;

    // ===================================
    // TAXABLE INCOME
    // ===================================

    let taxableIncome =

        annualIncome

        - annualPension

        - annualRentRelief

        - annualNHF

        - annualNHIS

        - annualLifeInsurance

        - annualMortgageInterest;

    if(
        taxableIncome < 0
    ){

        taxableIncome = 0;

    }

    // ===================================
    // PAYE
    // ===================================

    const annualPAYE =

    calculatePAYE(
        taxableIncome
    );

    const annualDeductions =

        annualPension

        + annualNHF

        + annualNHIS

        + annualLifeInsurance

        + annualMortgageInterest;

    const annualNet =

        annualIncome

        - annualPAYE

        - annualDeductions;

    // ===================================
    // MONTHLY FIGURES
    // ===================================

    const monthlyGross =
    annualIncome / 12;

    const monthlyPension =
    annualPension / 12;

    const monthlyRentRelief =
    annualRentRelief / 12;

    const monthlyPAYE =
    annualPAYE / 12;

    const monthlyNet =
    annualNet / 12;

    // ===================================
    // MONTHLY SUMMARY
    // ===================================

    document.getElementById(
        "monthlyGross"
    ).textContent =
    naira(monthlyGross);

    document.getElementById(
        "monthlyPension"
    ).textContent =
    naira(monthlyPension);

    document.getElementById(
        "monthlyRentRelief"
    ).textContent =
    naira(monthlyRentRelief);

    document.getElementById(
        "monthlyPAYE"
    ).textContent =
    naira(monthlyPAYE);

    document.getElementById(
        "monthlyNet"
    ).textContent =
    naira(monthlyNet);

    // ===================================
    // ANNUAL SUMMARY
    // ===================================

    document.getElementById(
        "annualGross"
    ).textContent =
    naira(annualIncome);

    document.getElementById(
        "annualPension"
    ).textContent =
    naira(annualPension);

    document.getElementById(
        "annualRentRelief"
    ).textContent =
    naira(annualRentRelief);

    document.getElementById(
        "annualPAYE"
    ).textContent =
    naira(annualPAYE);

    document.getElementById(
        "annualNet"
    ).textContent =
    naira(annualNet);

    // ===================================
    // BREAKDOWN TABLE
    // ===================================

    document.getElementById(
        "grossBreakdown"
    ).textContent =
    naira(annualIncome);

    document.getElementById(
        "pensionBreakdown"
    ).textContent =
    naira(annualPension);

    document.getElementById(
        "nhfBreakdown"
    ).textContent =
    naira(annualNHF);

    document.getElementById(
        "rentReliefBreakdown"
    ).textContent =
    naira(annualRentRelief);

    document.getElementById(
        "taxBreakdown"
    ).textContent =
    naira(annualPAYE);

    document.getElementById(
        "netBreakdown"
    ).textContent =
    naira(annualNet);

    // ===================================
    // PIE CHART
    // ===================================

    if(pieChart){
        pieChart.destroy();
    }

    pieChart = new Chart(

        document.getElementById(
            "taxPieChart"
        ),

        {

            type:"pie",

            data:{

                labels:[

                    "PAYE",
                    "Pension",
                    "Rent Relief",
                    "Net Income"

                ],

                datasets:[{

                    data:[

                        annualPAYE,
                        annualPension,
                        annualRentRelief,
                        annualNet

                    ]

                }]

            }

        }

    );

    // ===================================
    // BAR CHART
    // ===================================

    if(barChart){
        barChart.destroy();
    }

    barChart = new Chart(

        document.getElementById(
            "incomeBarChart"
        ),

        {

            type:"bar",

            data:{

                labels:[

                    "Income",
                    "Rent Relief",
                    "PAYE",
                    "Deductions",
                    "Net"

                ],

                datasets:[{

                    label:
                    "Annual Amount (₦)",

                    data:[

                        annualIncome,
                        annualRentRelief,
                        annualPAYE,
                        annualDeductions,
                        annualNet

                    ]

                }]

            }

        }

    );

    // ===================================
    // SAVE FOR DASHBOARD
    // ===================================

    const userData = {

        name:
        document.getElementById(
            "fullName"
        ).value,

        email:
        document.getElementById(
            "email"
        ).value,

        profileType:
        currentProfile,

        tin:
        document.getElementById(
            "tin"
        ).value,

        annualIncome,
        annualPension,
        annualRentRelief,
        annualPAYE,
        annualNet

    };

    localStorage.setItem(
        "taxeaseUser",
        JSON.stringify(
            userData
        )
    );

}