const API_BASE = "https://tax-system-backend.onrender.com/api";

let payments = [];

// ==============================
// FETCH PAYMENTS FROM BACKEND
// ==============================

async function loadPayments() {
  try {
    const res = await fetch(`${API_BASE}/payments/history`, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load payments");
    }

    payments = data.data || [];

    renderPayments();

  } catch (error) {
    console.error("Error loading payments:", error);

    // fallback empty state
    payments = [];
    renderPayments();
  }
}

// ==============================
// RENDER TABLE
// ==============================

function renderPayments(filter = "all") {

  const table = document.getElementById("historyTable");
  table.innerHTML = "";

  let filtered = payments;

  if (filter !== "all") {
    filtered = payments.filter(p => p.status === filter);
  }

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">No payments found</td>
      </tr>
    `;
    return;
  }

  filtered.forEach(p => {

    table.innerHTML += `
      <tr>
        <td>${p.reference || "N/A"}</td>
        <td>₦${(p.amount || 0).toLocaleString()}</td>
        <td class="${p.status === "success" ? "status-success" : "status-failed"}">
          ${p.status || "unknown"}
        </td>
        <td>${new Date(p.createdAt || p.date).toLocaleString()}</td>
      </tr>
    `;

  });
}

// ==============================
// FILTER BUTTONS
// ==============================

function filterPayments(type) {
  renderPayments(type);
}

// ==============================
// INIT
// ==============================

loadPayments();
