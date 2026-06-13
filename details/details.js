const API_BASE = "https://tax-system-backend.onrender.com/api";

const profileType = document.getElementById("profileType");
const profileForm = document.getElementById("profileForm");

const employeeFields = document.getElementById("employeeFields");
const freelancerFields = document.getElementById("freelancerFields");
const businessFields = document.getElementById("businessFields");

// =========================
// HELPER FUNCTION
// =========================

function getValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function getNumber(id) {
  return Number(document.getElementById(id)?.value) || 0;
}

// =========================
// PROFILE TYPE SWITCHING
// =========================

if (profileType) {
  profileType.addEventListener("change", () => {
    employeeFields?.classList.add("hidden");
    freelancerFields?.classList.add("hidden");
    businessFields?.classList.add("hidden");

    if (profileType.value === "employee") {
      employeeFields?.classList.remove("hidden");
    }

    if (profileType.value === "freelancer") {
      freelancerFields?.classList.remove("hidden");
    }

    if (profileType.value === "business") {
      businessFields?.classList.remove("hidden");
    }
  });
}

// =========================
// SAVE PROFILE
// =========================

if (profileForm) {
  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const selectedProfileType = getValue("profileType");

      if (!selectedProfileType) {
        alert("Please select a profile type.");
        profileType?.focus();
        return;
      }

      // Validate only visible required fields
      const requiredFields = document.querySelectorAll("[required]");

      for (let field of requiredFields) {
        const parentSection = field.closest(".hidden");

        // Skip hidden fields
        if (parentSection) {
          continue;
        }

        if (!field.value.trim()) {
          alert("Please complete all compulsory fields.");
          field.focus();
          return;
        }
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in. Please login again.");
        window.location.href = "../login/index.html";
        return;
      }

      const profileData = {
        profileType: selectedProfileType,

        // =====================
        // EMPLOYEE
        // =====================
        employerName: getValue("employerName"),
        monthlySalary: getNumber("monthlySalary"),

        // =====================
        // FREELANCER
        // =====================
        freelancerType: getValue("freelancerType"),
        averageMonthlyIncome: getNumber("averageMonthlyIncome"),

        // =====================
        // BUSINESS
        // =====================
        businessName: getValue("businessName"),
        businessType: getValue("businessType"),
        industry: getValue("industry"),
        cacNumber: getValue("cacNumber"),
        businessAddress: getValue("businessAddress"),
        monthlyRevenue: getNumber("monthlyRevenue"),
        annualRevenue: getNumber("annualRevenue"),
        employeeCount: getNumber("employeeCount"),
        bankName: getValue("bankName"),
        accountNumber: getValue("accountNumber"),

        // =====================
        // TAX INFORMATION
        // =====================
        annualRent: getNumber("annualRent"),
        nhf: getNumber("nhf"),
        nhis: getNumber("nhis"),
        lifeInsurance: getNumber("lifeInsurance"),
        mortgageInterest: getNumber("mortgageInterest"),
      };

      console.log("Profile Data:", profileData);

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      alert("Profile saved successfully!");

      window.location.href = "../dashboard/index.html";
    } catch (error) {
      console.error("Profile save error:", error);
      alert(error.message || "Something went wrong");
    }
  });
}
