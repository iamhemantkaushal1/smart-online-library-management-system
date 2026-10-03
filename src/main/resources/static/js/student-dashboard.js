// ==========================================
// STUDENT DASHBOARD
// ==========================================

const storedUser = localStorage.getItem("user");

if (!storedUser) {
    window.location.href = "index.html";
}

const user = JSON.parse(storedUser);

if (user.role !== "STUDENT") {

    if (user.role === "ADMIN") {
        window.location.href = "admin-dashboard.html";
    } else if (user.role === "LIBRARIAN") {
        window.location.href = "librarian-dashboard.html";
    } else {
        localStorage.removeItem("user");
        window.location.href = "index.html";
    }
}

document.getElementById("studentName").textContent =
    user.name || "Student";

document.getElementById("welcomeName").textContent =
    user.name || "Student";


// ==========================================
// LOAD BOOKS
// ==========================================

let allBooks = [];

async function loadBooks() {

    try {

        const response = await fetch("/api/books");

        allBooks = await response.json();

        displayBooks(allBooks);

        displayRecommendations(allBooks);

    } catch (error) {

        console.error("Books error:", error);

        document.getElementById("bookGrid").innerHTML =
            "<p>Unable to load books.</p>";
    }
}


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(books) {

    const grid =
        document.getElementById("bookGrid");

    if (!books.length) {

        grid.innerHTML =
            "<p>No books found.</p>";

        return;
    }

    grid.innerHTML = "";

    books.forEach(book => {

        grid.innerHTML += `

            <div class="book-card">

                <div class="book-icon">
                    📚
                </div>

                <h3>
                    ${book.title || "Untitled"}
                </h3>

                <p>
                    Author:
                    ${book.author || "Unknown"}
                </p>

                <p>
                    Category:
                    ${book.category || "General"}
                </p>

                <p>
                    Available:
                    ${book.availableCopies ?? 0}
                </p>

                <button
                    onclick="addWishlist(${book.id})">

                    ❤️ Add to Wishlist

                </button>

            </div>
        `;
    });
}


// ==========================================
// SEARCH
// ==========================================

function filterBooks() {

    const search =
        document.getElementById("bookSearch")
            .value
            .toLowerCase()
            .trim();

    const filtered =
        allBooks.filter(book =>

            (book.title || "")
                .toLowerCase()
                .includes(search)

            ||

            (book.author || "")
                .toLowerCase()
                .includes(search)

            ||

            (book.category || "")
                .toLowerCase()
                .includes(search)
        );

    displayBooks(filtered);
}


// ==========================================
// WISHLIST
// ==========================================

async function addWishlist(bookId) {

    try {

        const response = await fetch(
            `/api/wishlist?userId=${user.id}&bookId=${bookId}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Book could not be added to wishlist."
            );

            return;
        }

        alert("Book added to wishlist ❤️");

        loadWishlist();

    } catch (error) {

        alert("Unable to add book to wishlist.");
    }
}


async function loadWishlist() {

    try {

        const response =
            await fetch(
                `/api/wishlist/user/${user.id}`
            );

        const wishlist =
            await response.json();

        document.getElementById("wishlistCount")
            .textContent = wishlist.length;

        const grid =
            document.getElementById("wishlistGrid");

        if (!wishlist.length) {

            grid.innerHTML =
                "<p>Your wishlist is empty.</p>";

            return;
        }

        grid.innerHTML = "";

        wishlist.forEach(item => {

            const book = item.book;

            grid.innerHTML += `

                <div class="book-card">

                    <div class="book-icon">
                        ❤️
                    </div>

                    <h3>
                        ${book?.title || "Book"}
                    </h3>

                    <p>
                        ${book?.author || "Unknown author"}
                    </p>

                    <button
                        onclick="removeWishlist(${item.id})">

                        Remove

                    </button>

                </div>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}


async function removeWishlist(id) {

    try {

        await fetch(
            `/api/wishlist/${id}`,
            {
                method: "DELETE"
            }
        );

        loadWishlist();

    } catch (error) {

        console.error(error);
    }
}


// ==========================================
// MY BOOKS
// ==========================================

async function loadMyBooks() {

    try {

        const response =
            await fetch(
                `/api/transactions/user/${user.id}`
            );

        const transactions =
            await response.json();

        const issued =
            transactions.filter(
                t => t.status === "ISSUED" ||
                    t.status === "RENEWED"
            );

        const history =
            transactions;

        document.getElementById("myBooks")
            .textContent = issued.length;

        let dueSoonCount = 0;

        const today = new Date();

        issued.forEach(transaction => {

            if (transaction.dueDate) {

                const due =
                    new Date(transaction.dueDate);

                const difference =
                    (due - today) /
                    (1000 * 60 * 60 * 24);

                if (difference >= 0 &&
                    difference <= 3) {

                    dueSoonCount++;
                }
            }
        });

        document.getElementById("dueSoon")
            .textContent = dueSoonCount;

        const table =
            document.getElementById("issuedTable");

        if (!issued.length) {

            table.innerHTML =
                `<tr>
                    <td colspan="5">
                        No issued books.
                    </td>
                </tr>`;

        } else {

            table.innerHTML = "";

            issued.forEach(t => {

                table.innerHTML += `
                    <tr>

                        <td>${t.id}</td>

                        <td>
                            ${t.bookCopy?.book?.title || "-"}
                        </td>

                        <td>
                            ${t.issueDate || "-"}
                        </td>

                        <td>
                            ${t.dueDate || "-"}
                        </td>

                        <td>
                            ${t.status || "-"}
                        </td>

                    </tr>
                `;

            });
        }


        // HISTORY

        const historyTable =
            document.getElementById("historyTable");

        if (!history.length) {

            historyTable.innerHTML =
                `<tr>
                    <td colspan="5">
                        No borrowing history.
                    </td>
                </tr>`;

        } else {

            historyTable.innerHTML = "";

            history.forEach(t => {

                historyTable.innerHTML += `
                    <tr>

                        <td>${t.id}</td>

                        <td>
                            ${t.bookCopy?.book?.title || "-"}
                        </td>

                        <td>
                            ${t.issueDate || "-"}
                        </td>

                        <td>
                            ${t.returnDate || "-"}
                        </td>

                        <td>
                            ${t.status || "-"}
                        </td>

                    </tr>
                `;

            });
        }

    } catch (error) {

        console.error("My books error:", error);
    }
}


// ==========================================
// RESERVATIONS
// ==========================================

async function loadReservations() {

    try {

        const response =
            await fetch(
                `/api/reservations/user/${user.id}`
            );

        const reservations =
            await response.json();

        document.getElementById("myReservations")
            .textContent = reservations.length;

        const table =
            document.getElementById("reservationTable");

        if (!reservations.length) {

            table.innerHTML =
                `<tr>
                    <td colspan="4">
                        No reservations.
                    </td>
                </tr>`;

            return;
        }

        table.innerHTML = "";

        reservations.forEach(r => {

            table.innerHTML += `
                <tr>

                    <td>${r.id}</td>

                    <td>
                        ${r.book?.title || "-"}
                    </td>

                    <td>
                        ${r.reservationDate
                ? new Date(r.reservationDate)
                    .toLocaleString()
                : "-"}
                    </td>

                    <td>
                        ${r.status || "-"}
                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error(error);
    }
}


// ==========================================
// FINES
// ==========================================

async function loadFines() {

    try {

        const response =
            await fetch(
                `/api/fines/user/${user.id}`
            );

        const fines =
            await response.json();

        let total = 0;

        fines.forEach(fine => {

            if (fine.status === "UNPAID") {
                total += Number(fine.amount || 0);
            }

        });

        document.getElementById("myFines")
            .textContent = `₹${total}`;

        const table =
            document.getElementById("finesTable");

        if (!fines.length) {

            table.innerHTML =
                `<tr>
                    <td colspan="5">
                        No fines found.
                    </td>
                </tr>`;

            return;
        }

        table.innerHTML = "";

        fines.forEach(fine => {

            table.innerHTML += `
                <tr>

                    <td>${fine.id}</td>

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
                        ${fine.status || "-"}
                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error("Fine error:", error);
    }
}


// ==========================================
// NOTIFICATIONS
// ==========================================

async function loadNotifications() {

    try {

        const response =
            await fetch(
                `/api/notifications/user/${user.id}`
            );

        const notifications =
            await response.json();

        const list =
            document.getElementById("notificationList");

        if (!notifications.length) {

            list.innerHTML =
                "<p>No notifications.</p>";

            return;
        }

        list.innerHTML = "";

        notifications.forEach(n => {

            list.innerHTML += `
                <div class="notification-card">

                    <strong>
                        ${n.title || "Notification"}
                    </strong>

                    <p>
                        ${n.message || ""}
                    </p>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);
    }
}


// ==========================================
// RECOMMENDATIONS
// ==========================================

function displayRecommendations(books) {

    const grid =
        document.getElementById(
            "recommendationGrid"
        );

    const recommendations =
        books.slice(0, 4);

    grid.innerHTML = "";

    recommendations.forEach(book => {

        grid.innerHTML += `

            <div class="book-card">

                <div class="book-icon">
                    ✨
                </div>

                <h3>
                    ${book.title || "Book"}
                </h3>

                <p>
                    ${book.author || "Unknown author"}
                </p>

                <p>
                    ${book.category || "General"}
                </p>

            </div>
        `;
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

loadBooks();
loadMyBooks();
loadReservations();
loadWishlist();
loadFines();
loadNotifications();