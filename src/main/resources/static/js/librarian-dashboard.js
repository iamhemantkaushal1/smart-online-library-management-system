// ==========================================
// LIBRARIAN DASHBOARD
// ==========================================

// ==========================================
// AUTHENTICATION
// ==========================================

const storedUser = localStorage.getItem("user");

if (!storedUser) {
    window.location.href = "index.html";
}

const user = JSON.parse(storedUser);

if (user.role !== "LIBRARIAN") {

    if (user.role === "ADMIN") {
        window.location.href = "admin-dashboard.html";
    } else if (user.role === "STUDENT") {
        window.location.href = "student-dashboard.html";
    } else {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    }
}

document.getElementById("librarianName").textContent =
    user.name || "Librarian";

document.getElementById("welcomeName").textContent =
    user.name || "Librarian";


// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");

        if (!response.ok) {
            throw new Error("Dashboard API failed");
        }

        const data = await response.json();

        document.getElementById("totalBooks").textContent =
            data.totalBooks ?? 0;

        document.getElementById("availableCopies").textContent =
            data.availableCopies ?? 0;

        document.getElementById("issuedBooks").textContent =
            data.issuedCopies ?? 0;

        document.getElementById("reservations").textContent =
            data.totalReservations ?? 0;

        document.getElementById("unpaidFines").textContent =
            data.unpaidFines ?? 0;

        await loadOverdueCount();

    } catch (error) {

        console.error("Dashboard error:", error);

    }
}


// ==========================================
// OVERDUE COUNT
// ==========================================

async function loadOverdueCount() {

    try {

        const response =
            await fetch("/api/reports/overdue");

        if (!response.ok) {
            throw new Error("Overdue API failed");
        }

        const data = await response.json();

        document.getElementById("overdueBooks").textContent =
            Array.isArray(data) ? data.length : 0;

    } catch (error) {

        console.error("Overdue error:", error);

        document.getElementById("overdueBooks").textContent = "0";
    }
}


// ==========================================
// BOOKS
// ==========================================

async function loadBooks() {

    const table = document.getElementById("booksTable");

    table.innerHTML =
        `<tr><td colspan="6">Loading books...</td></tr>`;

    try {

        const response =
            await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Books API failed");
        }

        const books = await response.json();

        if (!Array.isArray(books) || books.length === 0) {

            table.innerHTML =
                `<tr><td colspan="6">No books found</td></tr>`;

            return;
        }

        table.innerHTML = "";

        books.forEach(book => {

            table.innerHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${escapeHtml(book.title || "-")}</td>
                    <td>${escapeHtml(book.author || "-")}</td>
                    <td>${escapeHtml(book.category || "-")}</td>
                    <td>${book.totalCopies ?? 0}</td>
                    <td>${book.availableCopies ?? 0}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Books error:", error);

        table.innerHTML =
            `<tr><td colspan="6">Unable to load books</td></tr>`;
    }
}


// ==========================================
// ISSUE BOOK
// ==========================================

async function issueBook() {

    const userId =
        document.getElementById("issueUserId").value.trim();

    const copyId =
        document.getElementById("issueCopyId").value.trim();

    const days =
        document.getElementById("issueDays").value.trim();

    const message =
        document.getElementById("issueMessage");

    if (!userId || !copyId) {

        message.textContent =
            "Please enter User ID and Book Copy ID.";

        return;
    }

    try {

        const response = await fetch(
            `/api/transactions/issue?userId=${encodeURIComponent(userId)}&bookCopyId=${encodeURIComponent(copyId)}&days=${encodeURIComponent(days)}`,
            {
                method: "POST"
            }
        );

        const data = await readResponse(response);

        if (!response.ok) {

            message.textContent =
                data.message || "Unable to issue book.";

            return;
        }

        message.textContent =
            `Book issued successfully. Transaction ID: ${data.id}`;

        document.getElementById("issueUserId").value = "";
        document.getElementById("issueCopyId").value = "";

        await loadDashboard();
        await loadBooks();

    } catch (error) {

        console.error("Issue error:", error);

        message.textContent =
            "Server error while issuing book.";
    }
}


// ==========================================
// RETURN BOOK
// ==========================================

async function returnBook() {

    const transactionId =
        document.getElementById("returnTransactionId").value.trim();

    const message =
        document.getElementById("returnMessage");

    if (!transactionId) {

        message.textContent =
            "Please enter Transaction ID.";

        return;
    }

    try {

        const response = await fetch(
            `/api/transactions/${encodeURIComponent(transactionId)}/return`,
            {
                method: "PUT"
            }
        );

        const data = await readResponse(response);

        if (!response.ok) {

            message.textContent =
                data.message || "Unable to return book.";

            return;
        }

        message.textContent =
            "Book returned successfully.";

        document.getElementById("returnTransactionId").value = "";

        await loadDashboard();
        await loadBooks();

    } catch (error) {

        console.error("Return error:", error);

        message.textContent =
            "Server error while returning book.";
    }
}


// ==========================================
// RENEW BOOK
// ==========================================

async function renewBook() {

    const transactionId =
        document.getElementById("renewTransactionId").value.trim();

    const days =
        document.getElementById("renewDays").value.trim();

    const message =
        document.getElementById("renewMessage");

    if (!transactionId) {

        message.textContent =
            "Please enter Transaction ID.";

        return;
    }

    try {

        const response = await fetch(
            `/api/transactions/${encodeURIComponent(transactionId)}/renew?additionalDays=${encodeURIComponent(days)}`,
            {
                method: "PUT"
            }
        );

        const data = await readResponse(response);

        if (!response.ok) {

            message.textContent =
                data.message || "Unable to renew book.";

            return;
        }

        message.textContent =
            "Book renewed successfully.";

        document.getElementById("renewTransactionId").value = "";

        await loadDashboard();

    } catch (error) {

        console.error("Renew error:", error);

        message.textContent =
            "Server error while renewing book.";
    }
}


// ==========================================
// RESERVATIONS
// ==========================================

async function loadReservations() {

    const table =
        document.getElementById("reservationsTable");

    try {

        const response =
            await fetch("/api/reservations");

        if (!response.ok) {
            throw new Error("Reservations API failed");
        }

        const reservations =
            await response.json();

        if (!Array.isArray(reservations) ||
            reservations.length === 0) {

            table.innerHTML =
                `<tr>
                    <td colspan="5">
                        No reservations found
                    </td>
                </tr>`;

            return;
        }

        table.innerHTML = "";

        reservations.forEach(reservation => {

            table.innerHTML += `
                <tr>
                    <td>${reservation.id}</td>

                    <td>
                        ${escapeHtml(
                reservation.user?.name || "-"
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                reservation.book?.title || "-"
            )}
                    </td>

                    <td>
                        ${
                reservation.reservationDate
                    ? new Date(
                        reservation.reservationDate
                    ).toLocaleString()
                    : "-"
            }
                    </td>

                    <td>
                        ${escapeHtml(
                reservation.status || "-"
            )}
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error("Reservations error:", error);

        table.innerHTML =
            `<tr>
                <td colspan="5">
                    Unable to load reservations
                </td>
            </tr>`;
    }
}


// ==========================================
// MEMBERS
// ==========================================

async function loadMembers() {

    const table =
        document.getElementById("membersTable");

    try {

        const response =
            await fetch("/api/users");

        if (!response.ok) {
            throw new Error("Members API failed");
        }

        const users =
            await response.json();

        const members =
            users.filter(
                u => u.role === "STUDENT"
            );

        if (!members.length) {

            table.innerHTML =
                `<tr>
                    <td colspan="4">
                        No student members found
                    </td>
                </tr>`;

            return;
        }

        table.innerHTML = "";

        members.forEach(member => {

            table.innerHTML += `
                <tr>

                    <td>
                        ${member.id}
                    </td>

                    <td>
                        ${escapeHtml(
                member.name || "-"
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                member.email || "-"
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                member.role || "-"
            )}
                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error("Members error:", error);

        table.innerHTML =
            `<tr>
                <td colspan="4">
                    Unable to load members
                </td>
            </tr>`;
    }
}


// ==========================================
// FINES
// ==========================================

async function loadFines() {

    const table =
        document.getElementById("finesTable");

    try {

        const response =
            await fetch("/api/fines");

        if (!response.ok) {
            throw new Error("Fines API failed");
        }

        const fines =
            await response.json();

        if (!Array.isArray(fines) ||
            fines.length === 0) {

            table.innerHTML =
                `<tr>
                    <td colspan="5">
                        No fines found
                    </td>
                </tr>`;

            return;
        }

        table.innerHTML = "";

        fines.forEach(fine => {

            const status =
                (fine.status || "-").toUpperCase();

            table.innerHTML += `
                <tr>

                    <td>
                        ${fine.id}
                    </td>

                    <td>
                        ${fine.transaction?.id || "-"}
                    </td>

                    <td>
                        ${fine.overdueDays ?? 0}
                    </td>

                    <td>
                        ₹${fine.amount ?? 0}
                    </td>

                    <td>
                        ${escapeHtml(status)}
                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error("Fines error:", error);

        table.innerHTML =
            `<tr>
                <td colspan="5">
                    Unable to load fines
                </td>
            </tr>`;
    }
}


// ==========================================
// REPORTS
// ==========================================

async function viewReport(url) {

    try {

        const response =
            await fetch(url);

        const data =
            await readResponse(response);

        if (!response.ok) {

            showReportModal(
                "Report Error",
                `
                <div class="report-empty">
                    <div class="report-empty-icon">⚠️</div>
                    <h3>Unable to load report</h3>
                    <p>
                        ${escapeHtml(
                    data.message ||
                    "Something went wrong while loading this report."
                )}
                    </p>
                </div>
                `
            );

            return;
        }

        const reportType =
            getReportType(url);

        showReportModal(
            reportType.title,
            buildReportContent(
                reportType.type,
                data
            ),
            url
        );

    } catch (error) {

        console.error("Report error:", error);

        showReportModal(
            "Report Error",
            `
            <div class="report-empty">
                <div class="report-empty-icon">⚠️</div>
                <h3>Unable to load report</h3>
                <p>
                    Server connection failed.
                </p>
            </div>
            `
        );
    }
}


// ==========================================
// REPORT TYPE
// ==========================================

function getReportType(url) {

    if (url.includes("/issued")) {

        return {
            title: "📚 Issued Books Report",
            type: "issued"
        };
    }

    if (url.includes("/overdue")) {

        return {
            title: "⏰ Overdue Books Report",
            type: "overdue"
        };
    }

    if (url.includes("/unpaid-fines")) {

        return {
            title: "💰 Unpaid Fines Report",
            type: "unpaid-fines"
        };
    }

    if (url.includes("/reservations")) {

        return {
            title: "📋 Active Reservations Report",
            type: "reservations"
        };
    }

    if (url.includes("/transactions")) {

        return {
            title: "🔄 Transaction Report",
            type: "transactions"
        };
    }

    if (url.includes("/fines")) {

        return {
            title: "💰 Fine Report",
            type: "fines"
        };
    }

    return {
        title: "📊 Library Report",
        type: "general"
    };
}


// ==========================================
// BUILD REPORT CONTENT
// ==========================================

function buildReportContent(type, data) {

    if (!Array.isArray(data)) {

        return `
            <div class="report-empty">

                <div class="report-empty-icon">
                    📊
                </div>

                <h3>No report data</h3>

                <p>
                    The server did not return a valid report.
                </p>

            </div>
        `;
    }


    // ======================================
    // EMPTY REPORT
    // ======================================

    if (data.length === 0) {

        const emptyMessages = {

            issued:
                "There are currently no books issued.",

            overdue:
                "Great! There are currently no overdue books.",

            "unpaid-fines":
                "There are currently no unpaid fines.",

            reservations:
                "There are currently no active reservations.",

            transactions:
                "There are no transactions to display.",

            fines:
                "There are no fine records to display.",

            general:
                "There are no records to display."
        };

        return `
            <div class="report-empty">

                <div class="report-empty-icon">
                    📭
                </div>

                <h3>No Records Found</h3>

                <p>
                    ${
            emptyMessages[type] ||
            "There are no records to display."
        }
                </p>

            </div>
        `;
    }


    // ======================================
    // ISSUED / OVERDUE / TRANSACTIONS
    // ======================================

    if (
        type === "issued" ||
        type === "overdue" ||
        type === "transactions"
    ) {

        return `
            <div class="report-summary">

                <div class="report-summary-card">
                    <span>Total Records</span>
                    <strong>${data.length}</strong>
                </div>

                ${
            type === "overdue"
                ? `
                    <div class="report-summary-card">
                        <span>Overdue Books</span>
                        <strong>${data.length}</strong>
                    </div>
                    `
                : ""
        }

            </div>

            <div class="report-table-wrapper">

                <table class="report-table">

                    <thead>
                        <tr>

                            <th>Transaction ID</th>
                            <th>Member</th>
                            <th>Book</th>
                            <th>Copy</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody>

                        ${data.map(transaction => {

            const status =
                transaction.status || "-";

            const statusClass =
                getStatusClass(status);

            return `
                                <tr>

                                    <td>
                                        #${transaction.id}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                transaction.user?.name || "-"
            )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                transaction.bookCopy?.book?.title || "-"
            )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                transaction.bookCopy?.copyCode || "-"
            )}
                                    </td>

                                    <td>
                                        ${formatDate(
                transaction.issueDate
            )}
                                    </td>

                                    <td>
                                        ${formatDate(
                transaction.dueDate
            )}
                                    </td>

                                    <td>
                                        ${formatDate(
                transaction.returnDate
            )}
                                    </td>

                                    <td>
                                        <span class="report-status ${statusClass}">
                                            ${escapeHtml(status)}
                                        </span>
                                    </td>

                                </tr>
                            `;

        }).join("")}

                    </tbody>

                </table>

            </div>
        `;
    }


    // ======================================
    // RESERVATIONS
    // ======================================

    if (type === "reservations") {

        return `
            <div class="report-summary">

                <div class="report-summary-card">
                    <span>Active Reservations</span>
                    <strong>${data.length}</strong>
                </div>

            </div>

            <div class="report-table-wrapper">

                <table class="report-table">

                    <thead>
                        <tr>

                            <th>Reservation ID</th>
                            <th>Member</th>
                            <th>Email</th>
                            <th>Book</th>
                            <th>Category</th>
                            <th>Reserved On</th>
                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody>

                        ${data.map(reservation => {

            const status =
                reservation.status || "-";

            return `
                                <tr>

                                    <td>
                                        #${reservation.id}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                reservation.user?.name || "-"
            )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                reservation.user?.email || "-"
            )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                reservation.book?.title || "-"
            )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                reservation.book?.category || "-"
            )}
                                    </td>

                                    <td>
                                        ${formatDateTime(
                reservation.reservationDate
            )}
                                    </td>

                                    <td>
                                        <span class="report-status waiting">
                                            ${escapeHtml(status)}
                                        </span>
                                    </td>

                                </tr>
                            `;

        }).join("")}

                    </tbody>

                </table>

            </div>
        `;
    }


    // ======================================
    // FINES
    // ======================================

    if (
        type === "fines" ||
        type === "unpaid-fines"
    ) {

        const totalAmount =
            data.reduce(
                (sum, fine) =>
                    sum + Number(fine.amount || 0),
                0
            );

        return `
            <div class="report-summary">

                <div class="report-summary-card">
                    <span>Total Fine Records</span>
                    <strong>${data.length}</strong>
                </div>

                <div class="report-summary-card">
                    <span>Total Amount</span>
                    <strong>₹${totalAmount.toFixed(2)}</strong>
                </div>

            </div>

            <div class="report-table-wrapper">

                <table class="report-table">

                    <thead>
                        <tr>

                            <th>Fine ID</th>
                            <th>Transaction</th>
                            <th>Member</th>
                            <th>Book</th>
                            <th>Overdue Days</th>
                            <th>Amount</th>
                            <th>Status</th>

                        </tr>
                    </thead>

                    <tbody>

                        ${data.map(fine => {

            const status =
                fine.status || "-";

            return `
                                <tr>

                                    <td>
                                        #${fine.id}
                                    </td>

                                    <td>
                                        #${fine.transaction?.id || "-"}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                fine.transaction?.user?.name || "-"
            )}
                                    </td>

                                    <td>
                                        ${escapeHtml(
                fine.transaction?.bookCopy?.book?.title || "-"
            )}
                                    </td>

                                    <td>
                                        ${fine.overdueDays ?? 0}
                                    </td>

                                    <td>
                                        ₹${Number(
                fine.amount || 0
            ).toFixed(2)}
                                    </td>

                                    <td>
                                        <span class="report-status ${getStatusClass(status)}">
                                            ${escapeHtml(status)}
                                        </span>
                                    </td>

                                </tr>
                            `;

        }).join("")}

                    </tbody>

                </table>

            </div>
        `;
    }


    // ======================================
    // GENERAL
    // ======================================

    return `
        <div class="report-table-wrapper">

            <table class="report-table">

                <thead>
                    <tr>
                        <th>#</th>
                        <th>Details</th>
                    </tr>
                </thead>

                <tbody>

                    ${data.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>
                                <pre class="report-json">
${escapeHtml(JSON.stringify(item, null, 2))}
                                </pre>
                            </td>
                        </tr>
                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ==========================================
// REPORT MODAL
// ==========================================

function showReportModal(title, content, refreshUrl = null) {

    const existingModal =
        document.getElementById("libraryReportModal");

    if (existingModal) {
        existingModal.remove();
    }

    const modal =
        document.createElement("div");

    modal.id =
        "libraryReportModal";

    modal.innerHTML = `

        <div class="report-modal-overlay">

            <div class="report-modal">

                <div class="report-modal-header">

                    <div>
                        <h2>${title}</h2>

                        <p>
                            Smart Library Management System
                        </p>
                    </div>

                    <button
                        class="report-close-btn"
                        onclick="closeReportModal()"
                        title="Close">
                        ✕
                    </button>

                </div>


                <div class="report-modal-body">

                    ${content}

                </div>


                <div class="report-modal-footer">

                    ${
        refreshUrl
            ? `
                            <button
                                class="report-refresh-btn"
                                onclick="refreshCurrentReport('${refreshUrl}')">
                                🔄 Refresh Report
                            </button>
                        `
            : ""
    }

                    <button
                        class="report-close-footer-btn"
                        onclick="closeReportModal()">
                        Close
                    </button>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

    addReportModalStyles();

    document.body.style.overflow = "hidden";
}


// ==========================================
// CLOSE REPORT MODAL
// ==========================================

function closeReportModal() {

    const modal =
        document.getElementById("libraryReportModal");

    if (modal) {
        modal.remove();
    }

    document.body.style.overflow = "";
}


// ==========================================
// REFRESH REPORT
// ==========================================

async function refreshCurrentReport(url) {

    closeReportModal();

    await viewReport(url);
}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    const value =
        String(status || "")
            .toUpperCase();

    if (value === "PAID") {
        return "paid";
    }

    if (value === "UNPAID") {
        return "unpaid";
    }

    if (value === "OVERDUE") {
        return "overdue";
    }

    if (value === "RETURNED") {
        return "returned";
    }

    if (value === "ISSUED") {
        return "issued";
    }

    if (value === "WAITING") {
        return "waiting";
    }

    return "default";
}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatDateTime(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// SAFE HTML
// ==========================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// RESPONSE HANDLER
// ==========================================

async function readResponse(response) {

    const text =
        await response.text();

    if (!text) {
        return {};
    }

    try {

        return JSON.parse(text);

    } catch {

        return {
            message: text
        };
    }
}


// ==========================================
// REPORT MODAL CSS
// ==========================================

function addReportModalStyles() {

    if (
        document.getElementById(
            "libraryReportModalStyles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "libraryReportModalStyles";

    style.textContent = `

        .report-modal-overlay {

            position: fixed;
            inset: 0;

            background: rgba(5, 10, 25, 0.72);

            backdrop-filter: blur(8px);

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 24px;

            z-index: 99999;

        }


        .report-modal {

            width: min(1250px, 96vw);

            max-height: 90vh;

            background: #ffffff;

            border-radius: 20px;

            box-shadow:
                0 25px 80px rgba(0, 0, 0, 0.35);

            overflow: hidden;

            display: flex;
            flex-direction: column;

        }


        .report-modal-header {

            display: flex;

            justify-content: space-between;
            align-items: center;

            padding: 22px 26px;

            background:
                linear-gradient(
                    135deg,
                    #111827,
                    #1d4ed8
                );

            color: white;

        }


        .report-modal-header h2 {

            margin: 0 0 5px;

            font-size: 22px;

        }


        .report-modal-header p {

            margin: 0;

            font-size: 13px;

            opacity: 0.82;

        }


        .report-close-btn {

            border: none;

            background: rgba(255,255,255,0.16);

            color: white;

            width: 40px;
            height: 40px;

            border-radius: 50%;

            font-size: 18px;

            cursor: pointer;

            transition: 0.2s;

        }


        .report-close-btn:hover {

            background: rgba(255,255,255,0.28);

            transform: rotate(90deg);

        }


        .report-modal-body {

            padding: 24px;

            overflow: auto;

        }


        .report-summary {

            display: flex;

            gap: 16px;

            flex-wrap: wrap;

            margin-bottom: 20px;

        }


        .report-summary-card {

            min-width: 180px;

            padding: 18px 20px;

            border-radius: 14px;

            background: #f4f7ff;

            border: 1px solid #e2e8f0;

        }


        .report-summary-card span {

            display: block;

            font-size: 13px;

            color: #64748b;

            margin-bottom: 7px;

        }


        .report-summary-card strong {

            font-size: 25px;

            color: #172554;

        }


        .report-table-wrapper {

            width: 100%;

            overflow-x: auto;

            border: 1px solid #e2e8f0;

            border-radius: 14px;

        }


        .report-table {

            width: 100%;

            border-collapse: collapse;

            min-width: 850px;

        }


        .report-table th {

            background: #f1f5f9;

            color: #334155;

            font-size: 13px;

            font-weight: 700;

            padding: 14px;

            text-align: left;

            border-bottom: 1px solid #e2e8f0;

            white-space: nowrap;

        }


        .report-table td {

            padding: 14px;

            color: #475569;

            font-size: 13px;

            border-bottom: 1px solid #edf2f7;

            vertical-align: middle;

        }


        .report-table tbody tr:hover {

            background: #f8fafc;

        }


        .report-table tbody tr:last-child td {

            border-bottom: none;

        }


        .report-status {

            display: inline-flex;

            align-items: center;

            padding: 5px 10px;

            border-radius: 999px;

            font-size: 11px;

            font-weight: 700;

            white-space: nowrap;

        }


        .report-status.paid {

            background: #dcfce7;
            color: #166534;

        }


        .report-status.unpaid {

            background: #fee2e2;
            color: #991b1b;

        }


        .report-status.overdue {

            background: #ffedd5;
            color: #9a3412;

        }


        .report-status.returned {

            background: #dcfce7;
            color: #166534;

        }


        .report-status.issued {

            background: #dbeafe;
            color: #1d4ed8;

        }


        .report-status.waiting {

            background: #fef3c7;
            color: #92400e;

        }


        .report-status.default {

            background: #e2e8f0;
            color: #475569;

        }


        .report-empty {

            text-align: center;

            padding: 55px 20px;

        }


        .report-empty-icon {

            font-size: 48px;

            margin-bottom: 12px;

        }


        .report-empty h3 {

            margin: 0 0 8px;

            color: #1e293b;

            font-size: 21px;

        }


        .report-empty p {

            margin: 0;

            color: #64748b;

            font-size: 14px;

        }


        .report-modal-footer {

            display: flex;

            justify-content: flex-end;

            gap: 10px;

            padding: 16px 24px;

            border-top: 1px solid #e2e8f0;

            background: #f8fafc;

        }


        .report-refresh-btn,
        .report-close-footer-btn {

            border: none;

            padding: 10px 17px;

            border-radius: 9px;

            cursor: pointer;

            font-weight: 600;

            font-size: 13px;

        }


        .report-refresh-btn {

            background: #2563eb;

            color: white;

        }


        .report-close-footer-btn {

            background: #e2e8f0;

            color: #334155;

        }


        .report-refresh-btn:hover {

            background: #1d4ed8;

        }


        .report-close-footer-btn:hover {

            background: #cbd5e1;

        }


        .report-json {

            margin: 0;

            white-space: pre-wrap;

            font-size: 12px;

            color: #475569;

        }


        @media (max-width: 700px) {

            .report-modal-overlay {

                padding: 10px;

            }

            .report-modal {

                width: 100%;

                max-height: 94vh;

            }

            .report-modal-header {

                padding: 18px;

            }

            .report-modal-body {

                padding: 15px;

            }

            .report-modal-footer {

                padding: 12px 15px;

            }

            .report-summary-card {

                flex: 1;

                min-width: 140px;

            }

        }

    `;

    document.head.appendChild(style);
}


// ==========================================
// SCROLL TO SECTION
// ==========================================

function scrollToSection(id) {

    document.getElementById(id)
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function () {

        localStorage.removeItem("user");

        window.location.href =
            "index.html";
    });


// ==========================================
// INITIAL LOAD
// ==========================================

loadDashboard();
loadBooks();
loadReservations();
loadMembers();
loadFines();