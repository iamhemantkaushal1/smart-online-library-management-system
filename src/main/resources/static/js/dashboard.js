// ===============================
// SMART LIBRARY DASHBOARD
// ===============================

// Get logged-in user
const storedUser = localStorage.getItem("user");


// If user is not logged in,
// send them back to login page
if (!storedUser) {

    window.location.href = "index.html";

}


// Convert stored JSON string into JavaScript object
const user = JSON.parse(storedUser);


// ===============================
// DISPLAY USER INFORMATION
// ===============================

document.getElementById("userName").textContent =
    user.name || "User";

document.getElementById("welcomeName").textContent =
    user.name || "User";

document.getElementById("userRole").textContent =
    user.role || "USER";


// ===============================
// LOAD DASHBOARD DATA
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");

        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard data"
            );

        }

        const data = await response.json();


        // ===============================
        // UPDATE STATISTICS
        // ===============================

        document.getElementById("totalUsers").textContent =
            data.totalUsers ?? 0;

        document.getElementById("totalBooks").textContent =
            data.totalBooks ?? 0;

        document.getElementById("availableCopies").textContent =
            data.availableCopies ?? 0;

        document.getElementById("issuedCopies").textContent =
            data.issuedCopies ?? 0;

        document.getElementById("totalReservations").textContent =
            data.totalReservations ?? 0;

        document.getElementById("totalFines").textContent =
            data.totalFines ?? 0;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        // Keep default 0 values if API fails
        document.getElementById("totalUsers").textContent = "0";
        document.getElementById("totalBooks").textContent = "0";
        document.getElementById("availableCopies").textContent = "0";
        document.getElementById("issuedCopies").textContent = "0";
        document.getElementById("totalReservations").textContent = "0";
        document.getElementById("totalFines").textContent = "0";

    }

}


// ===============================
// LOGOUT
// ===============================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("user");

        window.location.href = "index.html";

    });


// ===============================
// INITIALIZE DASHBOARD
// ===============================

loadDashboard();