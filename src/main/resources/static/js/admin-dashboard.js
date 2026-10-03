// ============================================================
// ADMIN DASHBOARD - SMART LIBRARY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // AUTHENTICATION / ROLE GUARD
    // ========================================================

    const userData = localStorage.getItem("user");

    if (!userData) {
        window.location.href = "index.html";
        return;
    }

    let currentUser;

    try {
        currentUser = JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem("user");
        window.location.href = "index.html";
        return;
    }

    if (currentUser.role !== "ADMIN") {
        if (currentUser.role === "LIBRARIAN") {
            window.location.href = "librarian-dashboard.html";
        } else if (currentUser.role === "STUDENT") {
            window.location.href = "student-dashboard.html";
        } else {
            window.location.href = "index.html";
        }

        return;
    }


    // ========================================================
    // PROFILE
    // ========================================================

    const adminName = document.getElementById("adminName");
    const welcomeName = document.getElementById("welcomeName");

    if (adminName) {
        adminName.textContent = currentUser.name || "Admin";
    }

    if (welcomeName) {
        welcomeName.textContent = currentUser.name || "Admin";
    }


    // ========================================================
    // GLOBAL DATA
    // ========================================================

    let users = [];
    let books = [];
    let copies = [];
    let fines = [];


    // ========================================================
    // HELPER FUNCTIONS
    // ========================================================

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    async function getJSON(url, options = {}) {

        const response = await fetch(url, options);

        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (!response.ok) {

            const message =
                data?.message ||
                data?.error ||
                `Request failed: ${response.status}`;

            throw new Error(message);
        }

        return data;
    }


    function showMessage(elementId, message, type = "success") {

        const element = document.getElementById(elementId);

        if (!element) {
            return;
        }

        element.textContent = message;
        element.className = `form-message ${type}`;

    }


    function clearMessage(elementId) {

        const element = document.getElementById(elementId);

        if (!element) {
            return;
        }

        element.textContent = "";
        element.className = "form-message";
    }


    // ========================================================
    // NAVIGATION
    // ========================================================

    const navItems =
        document.querySelectorAll(".nav-item");

    const quickCards =
        document.querySelectorAll(".quick-card");

    const sections =
        document.querySelectorAll(".content-section");

    const pageTitle =
        document.getElementById("pageTitle");


    const sectionTitles = {

        dashboard: "Admin Dashboard",

        users: "User Management",

        books: "Book Management",

        copies: "Book Copies",

        fines: "Fine Management",

        reports: "Reports & Analytics",

        notifications: "Notifications",

        audit: "Audit Logs",

        settings: "System Settings"

    };


    function openSection(sectionId) {

        sections.forEach(section => {

            section.classList.remove("active");

        });


        const target =
            document.getElementById(sectionId);

        if (target) {
            target.classList.add("active");
        }


        navItems.forEach(item => {

            item.classList.remove("active");

            if (item.dataset.section === sectionId) {
                item.classList.add("active");
            }

        });


        if (pageTitle) {
            pageTitle.textContent =
                sectionTitles[sectionId] ||
                "Admin Dashboard";
        }


        // Load section data

        if (sectionId === "users") {
            loadUsers();
        }

        if (sectionId === "books") {
            loadBooks();
        }

        if (sectionId === "copies") {
            loadCopies();
        }

        if (sectionId === "fines") {
            loadFines();
        }

        if (sectionId === "dashboard") {
            loadDashboard();
        }

    }


    navItems.forEach(item => {

        item.addEventListener("click", () => {

            openSection(item.dataset.section);

        });

    });


    quickCards.forEach(card => {

        card.addEventListener("click", () => {

            openSection(card.dataset.section);

        });

    });


    // ========================================================
    // DASHBOARD
    // ========================================================

    async function loadDashboard() {

        try {

            const data =
                await getJSON("/api/dashboard");


            const totalUsers =
                document.getElementById("totalUsers");

            const totalBooks =
                document.getElementById("totalBooks");

            const totalCopies =
                document.getElementById("totalCopies");

            const issuedCopies =
                document.getElementById("issuedCopies");

            const reservations =
                document.getElementById("reservations");

            const unpaidFines =
                document.getElementById("unpaidFines");


            if (totalUsers) {
                totalUsers.textContent =
                    data.totalUsers ?? 0;
            }

            if (totalBooks) {
                totalBooks.textContent =
                    data.totalBooks ?? 0;
            }

            if (totalCopies) {
                totalCopies.textContent =
                    data.totalBookCopies ?? 0;
            }

            if (issuedCopies) {
                issuedCopies.textContent =
                    data.issuedCopies ?? 0;
            }

            if (reservations) {
                reservations.textContent =
                    data.totalReservations ?? 0;
            }

            if (unpaidFines) {
                unpaidFines.textContent =
                    data.unpaidFines ?? 0;
            }

        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        }

    }


    // ========================================================
    // USER MANAGEMENT
    // ========================================================

    const userModal =
        document.getElementById("userModal");

    const userForm =
        document.getElementById("userForm");

    const addUserBtn =
        document.getElementById("addUserBtn");

    const closeUserModal =
        document.getElementById("closeUserModal");

    const cancelUserBtn =
        document.getElementById("cancelUserBtn");

    const refreshUsersBtn =
        document.getElementById("refreshUsersBtn");

    const userSearch =
        document.getElementById("userSearch");


    function openUserModal(user = null) {

        clearMessage("userFormMessage");

        userForm.reset();

        const userId =
            document.getElementById("userId");

        const userNameInput =
            document.getElementById("userNameInput");

        const userEmailInput =
            document.getElementById("userEmailInput");

        const userPasswordInput =
            document.getElementById("userPasswordInput");

        const userRoleInput =
            document.getElementById("userRoleInput");

        const userModalTitle =
            document.getElementById("userModalTitle");


        if (user) {

            userModalTitle.textContent =
                "Edit User";

            userId.value =
                user.id;

            userNameInput.value =
                user.name || "";

            userEmailInput.value =
                user.email || "";

            userPasswordInput.required = false;

            userPasswordInput.placeholder =
                "Leave blank to keep current password";

            userRoleInput.value =
                user.role || "STUDENT";

        } else {

            userModalTitle.textContent =
                "Add User";

            userId.value = "";

            userPasswordInput.required = true;

            userPasswordInput.placeholder =
                "Enter password";

        }


        userModal.classList.add("show");

    }


    function closeUserModalFunction() {

        userModal.classList.remove("show");

        userForm.reset();

        clearMessage("userFormMessage");

        document.getElementById(
            "userPasswordInput"
        ).required = true;

    }


    addUserBtn?.addEventListener(
        "click",
        () => openUserModal()
    );


    closeUserModal?.addEventListener(
        "click",
        closeUserModalFunction
    );


    cancelUserBtn?.addEventListener(
        "click",
        closeUserModalFunction
    );


    userModal?.addEventListener(
        "click",
        event => {

            if (event.target === userModal) {
                closeUserModalFunction();
            }

        }
    );


    async function loadUsers() {

        const tbody =
            document.getElementById(
                "usersTableBody"
            );

        if (!tbody) {
            return;
        }


        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    Loading users...
                </td>
            </tr>
        `;


        try {

            users =
                await getJSON("/api/users");


            renderUsers(users);

        } catch (error) {

            console.error(
                "Users loading error:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        Failed to load users.
                    </td>
                </tr>
            `;

        }

    }


    function renderUsers(data) {

        const tbody =
            document.getElementById(
                "usersTableBody"
            );

        if (!tbody) {
            return;
        }


        if (!data.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        No users found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML =
            data.map(user => {

                const roleClass =
                    String(user.role || "")
                        .toLowerCase();


                return `
                    <tr>

                        <td>
                            ${escapeHTML(user.id)}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(user.name)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(user.email)}
                        </td>

                        <td>

                            <span class="role-badge ${roleClass}">
                                ${escapeHTML(user.role)}
                            </span>

                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    class="table-btn edit"
                                    onclick="editUser(${user.id})">

                                    Edit

                                </button>


                                <button
                                    class="table-btn delete"
                                    onclick="deleteUser(${user.id})">

                                    Delete

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    }


    window.editUser = function (id) {

        const user =
            users.find(
                item => Number(item.id) === Number(id)
            );

        if (user) {
            openUserModal(user);
        }

    };


    window.deleteUser = async function (id) {

        const user =
            users.find(
                item => Number(item.id) === Number(id)
            );


        if (!user) {
            return;
        }


        const confirmed =
            confirm(
                `Delete user "${user.name}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await getJSON(
                `/api/users/${id}`,
                {
                    method: "DELETE"
                }
            );


            alert("User deleted successfully.");

            await loadUsers();
            await loadDashboard();

        } catch (error) {

            alert(
                error.message ||
                "Unable to delete user."
            );

        }

    };


    userForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "userId"
                ).value;


            const name =
                document.getElementById(
                    "userNameInput"
                ).value.trim();


            const email =
                document.getElementById(
                    "userEmailInput"
                ).value.trim();


            const password =
                document.getElementById(
                    "userPasswordInput"
                ).value;


            const role =
                document.getElementById(
                    "userRoleInput"
                ).value;


            const payload = {

                name,
                email,
                role

            };


            if (password.trim()) {
                payload.password = password;
            }


            try {

                if (id) {

                    // Current backend update endpoint
                    // expects password too.
                    // Send existing password only if
                    // the user entered a new one.

                    if (!password.trim()) {

                        showMessage(
                            "userFormMessage",
                            "For editing this user, enter a password.",
                            "error"
                        );

                        return;
                    }


                    await getJSON(
                        `/api/users/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );


                    showMessage(
                        "userFormMessage",
                        "User updated successfully.",
                        "success"
                    );

                } else {

                    await getJSON(
                        "/api/users",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );


                    showMessage(
                        "userFormMessage",
                        "User added successfully.",
                        "success"
                    );

                }


                setTimeout(
                    async () => {

                        closeUserModalFunction();

                        await loadUsers();
                        await loadDashboard();

                    },
                    500
                );


            } catch (error) {

                showMessage(
                    "userFormMessage",
                    error.message ||
                    "Unable to save user.",
                    "error"
                );

            }

        }
    );


    refreshUsersBtn?.addEventListener(
        "click",
        loadUsers
    );


    userSearch?.addEventListener(
        "input",
        () => {

            const query =
                userSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                users.filter(user =>

                    String(user.name || "")
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(user.email || "")
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(user.role || "")
                        .toLowerCase()
                        .includes(query)

                );


            renderUsers(filtered);

        }
    );


    // ========================================================
    // BOOK MANAGEMENT
    // ========================================================

    const bookModal =
        document.getElementById("bookModal");

    const bookForm =
        document.getElementById("bookForm");

    const addBookBtn =
        document.getElementById("addBookBtn");

    const closeBookModal =
        document.getElementById("closeBookModal");

    const cancelBookBtn =
        document.getElementById("cancelBookBtn");

    const refreshBooksBtn =
        document.getElementById("refreshBooksBtn");

    const bookSearch =
        document.getElementById("bookSearch");


    function openBookModal(book = null) {

        clearMessage("bookFormMessage");

        bookForm.reset();


        const bookId =
            document.getElementById("bookId");

        const bookModalTitle =
            document.getElementById(
                "bookModalTitle"
            );


        if (book) {

            bookModalTitle.textContent =
                "Edit Book";


            bookId.value =
                book.id;


            document.getElementById(
                "bookTitleInput"
            ).value =
                book.title || "";


            document.getElementById(
                "bookIsbnInput"
            ).value =
                book.isbn || "";


            document.getElementById(
                "bookAuthorInput"
            ).value =
                book.author || "";


            document.getElementById(
                "bookCategoryInput"
            ).value =
                book.category || "";


            document.getElementById(
                "bookPublisherInput"
            ).value =
                book.publisher || "";


            document.getElementById(
                "bookYearInput"
            ).value =
                book.publicationYear || "";


            document.getElementById(
                "bookTotalInput"
            ).value =
                book.totalCopies ?? 0;


            document.getElementById(
                "bookAvailableInput"
            ).value =
                book.availableCopies ?? 0;

        } else {

            bookModalTitle.textContent =
                "Add Book";

            bookId.value = "";

        }


        bookModal.classList.add("show");

    }


    function closeBookModalFunction() {

        bookModal.classList.remove("show");

        bookForm.reset();

        clearMessage("bookFormMessage");

    }


    addBookBtn?.addEventListener(
        "click",
        () => openBookModal()
    );


    closeBookModal?.addEventListener(
        "click",
        closeBookModalFunction
    );


    cancelBookBtn?.addEventListener(
        "click",
        closeBookModalFunction
    );


    bookModal?.addEventListener(
        "click",
        event => {

            if (event.target === bookModal) {
                closeBookModalFunction();
            }

        }
    );


    async function loadBooks() {

        const tbody =
            document.getElementById(
                "booksTableBody"
            );


        if (!tbody) {
            return;
        }


        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    Loading books...
                </td>
            </tr>
        `;


        try {

            books =
                await getJSON("/api/books");


            renderBooks(books);

        } catch (error) {

            console.error(
                "Books loading error:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty">
                        Failed to load books.
                    </td>
                </tr>
            `;

        }

    }


    function renderBooks(data) {

        const tbody =
            document.getElementById(
                "booksTableBody"
            );


        if (!tbody) {
            return;
        }


        if (!data.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty">
                        No books found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML =
            data.map(book => {

                return `
                    <tr>

                        <td>
                            ${escapeHTML(book.id)}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(book.title)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(book.isbn)}
                        </td>

                        <td>
                            ${escapeHTML(book.author)}
                        </td>

                        <td>
                            ${escapeHTML(book.category)}
                        </td>

                        <td>
                            ${escapeHTML(book.publicationYear)}
                        </td>

                        <td>
                            ${escapeHTML(book.totalCopies)}
                        </td>

                        <td>

                            <span class="availability">
                                ${escapeHTML(book.availableCopies)}
                            </span>

                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    class="table-btn edit"
                                    onclick="editBook(${book.id})">

                                    Edit

                                </button>


                                <button
                                    class="table-btn delete"
                                    onclick="deleteBook(${book.id})">

                                    Delete

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    }


    window.editBook = function (id) {

        const book =
            books.find(
                item => Number(item.id) === Number(id)
            );


        if (book) {
            openBookModal(book);
        }

    };


    window.deleteBook = async function (id) {

        const book =
            books.find(
                item => Number(item.id) === Number(id)
            );


        if (!book) {
            return;
        }


        const confirmed =
            confirm(
                `Delete book "${book.title}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await getJSON(
                `/api/books/${id}`,
                {
                    method: "DELETE"
                }
            );


            alert("Book deleted successfully.");

            await loadBooks();
            await loadDashboard();

        } catch (error) {

            alert(
                error.message ||
                "Unable to delete book."
            );

        }

    };


    bookForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                document.getElementById(
                    "bookId"
                ).value;


            const payload = {

                title:
                    document.getElementById(
                        "bookTitleInput"
                    ).value.trim(),

                isbn:
                    document.getElementById(
                        "bookIsbnInput"
                    ).value.trim(),

                author:
                    document.getElementById(
                        "bookAuthorInput"
                    ).value.trim(),

                category:
                    document.getElementById(
                        "bookCategoryInput"
                    ).value.trim(),

                publisher:
                    document.getElementById(
                        "bookPublisherInput"
                    ).value.trim(),

                publicationYear:
                    Number(
                        document.getElementById(
                            "bookYearInput"
                        ).value
                    ) || null,

                totalCopies:
                    Number(
                        document.getElementById(
                            "bookTotalInput"
                        ).value
                    ),

                availableCopies:
                    Number(
                        document.getElementById(
                            "bookAvailableInput"
                        ).value
                    )

            };


            if (
                payload.availableCopies >
                payload.totalCopies
            ) {

                showMessage(
                    "bookFormMessage",
                    "Available copies cannot be greater than total copies.",
                    "error"
                );

                return;
            }


            try {

                if (id) {

                    await getJSON(
                        `/api/books/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );


                    showMessage(
                        "bookFormMessage",
                        "Book updated successfully.",
                        "success"
                    );

                } else {

                    await getJSON(
                        "/api/books",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(payload)
                        }
                    );


                    showMessage(
                        "bookFormMessage",
                        "Book added successfully.",
                        "success"
                    );

                }


                setTimeout(
                    async () => {

                        closeBookModalFunction();

                        await loadBooks();
                        await loadDashboard();

                    },
                    500
                );


            } catch (error) {

                showMessage(
                    "bookFormMessage",
                    error.message ||
                    "Unable to save book.",
                    "error"
                );

            }

        }
    );


    refreshBooksBtn?.addEventListener(
        "click",
        loadBooks
    );


    bookSearch?.addEventListener(
        "input",
        () => {

            const query =
                bookSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                books.filter(book =>

                    String(book.title || "")
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(book.author || "")
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(book.isbn || "")
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(book.category || "")
                        .toLowerCase()
                        .includes(query)

                );


            renderBooks(filtered);

        }
    );


    // ========================================================
    // BOOK COPIES
    // ========================================================

    const copyModal =
        document.getElementById("copyModal");

    const copyForm =
        document.getElementById("copyForm");

    const addCopyBtn =
        document.getElementById("addCopyBtn");

    const closeCopyModal =
        document.getElementById("closeCopyModal");

    const cancelCopyBtn =
        document.getElementById("cancelCopyBtn");

    const refreshCopiesBtn =
        document.getElementById(
            "refreshCopiesBtn"
        );

    const copySearch =
        document.getElementById("copySearch");


    function openCopyModal() {

        clearMessage("copyFormMessage");

        copyForm.reset();

        populateBookDropdown();

        copyModal.classList.add("show");

    }


    function closeCopyModalFunction() {

        copyModal.classList.remove("show");

        copyForm.reset();

        clearMessage("copyFormMessage");

    }


    function populateBookDropdown() {

        const select =
            document.getElementById(
                "copyBookInput"
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Select Book
            </option>
        `;


        books.forEach(book => {

            const option =
                document.createElement("option");


            option.value =
                book.id;


            option.textContent =
                `${book.title} — ${book.isbn}`;


            select.appendChild(option);

        });

    }


    addCopyBtn?.addEventListener(
        "click",
        async () => {

            if (!books.length) {
                await loadBooks();
            }

            openCopyModal();

        }
    );


    closeCopyModal?.addEventListener(
        "click",
        closeCopyModalFunction
    );


    cancelCopyBtn?.addEventListener(
        "click",
        closeCopyModalFunction
    );


    copyModal?.addEventListener(
        "click",
        event => {

            if (event.target === copyModal) {
                closeCopyModalFunction();
            }

        }
    );


    async function loadCopies() {

        const tbody =
            document.getElementById(
                "copiesTableBody"
            );


        if (!tbody) {
            return;
        }


        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Loading copies...
                </td>
            </tr>
        `;


        try {

            copies =
                await getJSON(
                    "/api/book-copies"
                );


            renderCopies(copies);

        } catch (error) {

            console.error(
                "Copies loading error:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        Failed to load copies.
                    </td>
                </tr>
            `;

        }

    }


    function renderCopies(data) {

        const tbody =
            document.getElementById(
                "copiesTableBody"
            );


        if (!tbody) {
            return;
        }


        if (!data.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">
                        No book copies found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML =
            data.map(copy => {

                const book =
                    copy.book || {};


                const status =
                    String(
                        copy.status || ""
                    ).toUpperCase();


                return `
                    <tr>

                        <td>
                            ${escapeHTML(copy.id)}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(copy.copyCode)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(book.title)}
                        </td>

                        <td>
                            ${escapeHTML(book.isbn)}
                        </td>

                        <td>

                            <span
                                class="status-badge ${status.toLowerCase()}">

                                ${escapeHTML(status)}

                            </span>

                        </td>

                        <td>

                            <div class="action-buttons">

                                <select
                                    class="status-select"
                                    onchange="changeCopyStatus(${copy.id}, this.value)">

                                    <option
                                        value="AVAILABLE"
                                        ${status === "AVAILABLE" ? "selected" : ""}>

                                        AVAILABLE

                                    </option>

                                    <option
                                        value="ISSUED"
                                        ${status === "ISSUED" ? "selected" : ""}>

                                        ISSUED

                                    </option>

                                    <option
                                        value="LOST"
                                        ${status === "LOST" ? "selected" : ""}>

                                        LOST

                                    </option>

                                    <option
                                        value="DAMAGED"
                                        ${status === "DAMAGED" ? "selected" : ""}>

                                        DAMAGED

                                    </option>

                                </select>


                                <button
                                    class="table-btn delete"
                                    onclick="deleteCopy(${copy.id})">

                                    Delete

                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    }


    window.changeCopyStatus =
        async function (id, status) {

            try {

                await getJSON(
                    `/api/book-copies/${id}/status?status=${encodeURIComponent(status)}`,
                    {
                        method: "PUT"
                    }
                );


                await loadCopies();
                await loadDashboard();

            } catch (error) {

                alert(
                    error.message ||
                    "Unable to update copy status."
                );

                await loadCopies();

            }

        };


    window.deleteCopy =
        async function (id) {

            const confirmed =
                confirm(
                    "Delete this book copy?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await getJSON(
                    `/api/book-copies/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                alert(
                    "Book copy deleted successfully."
                );


                await loadCopies();
                await loadDashboard();

            } catch (error) {

                alert(
                    error.message ||
                    "Unable to delete book copy."
                );

            }

        };


    copyForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const bookId =
                document.getElementById(
                    "copyBookInput"
                ).value;


            const copyCode =
                document.getElementById(
                    "copyCodeInput"
                ).value.trim();


            if (!bookId) {

                showMessage(
                    "copyFormMessage",
                    "Please select a book.",
                    "error"
                );

                return;
            }


            if (!copyCode) {

                showMessage(
                    "copyFormMessage",
                    "Please enter a copy code.",
                    "error"
                );

                return;
            }


            try {

                await getJSON(
                    `/api/book-copies/book/${bookId}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                copyCode: copyCode
                            })
                    }
                );


                showMessage(
                    "copyFormMessage",
                    "Book copy added successfully.",
                    "success"
                );


                setTimeout(
                    async () => {

                        closeCopyModalFunction();

                        await loadCopies();
                        await loadDashboard();

                    },
                    500
                );


            } catch (error) {

                showMessage(
                    "copyFormMessage",
                    error.message ||
                    "Unable to add book copy.",
                    "error"
                );

            }

        }
    );


    refreshCopiesBtn?.addEventListener(
        "click",
        loadCopies
    );


    copySearch?.addEventListener(
        "input",
        () => {

            const query =
                copySearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                copies.filter(copy => {

                    const book =
                        copy.book || {};


                    return (

                        String(
                            copy.copyCode || ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            copy.status || ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            book.title || ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            book.isbn || ""
                        )
                            .toLowerCase()
                            .includes(query)

                    );

                });


            renderCopies(filtered);

        }
    );


    // ========================================================
    // FINE MANAGEMENT
    // ========================================================

    const refreshFinesBtn =
        document.getElementById(
            "refreshFinesBtn"
        );

    const fineSearch =
        document.getElementById(
            "fineSearch"
        );


    async function loadFines() {

        const tbody =
            document.getElementById(
                "finesTableBody"
            );


        if (!tbody) {
            return;
        }


        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Loading fines...
                </td>
            </tr>
        `;


        try {

            fines =
                await getJSON(
                    "/api/fines"
                );


            renderFines(fines);

        } catch (error) {

            console.error(
                "Fines loading error:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty">
                        Failed to load fines.
                    </td>
                </tr>
            `;

        }

    }


    function renderFines(data) {

        const tbody =
            document.getElementById(
                "finesTableBody"
            );


        if (!tbody) {
            return;
        }


        if (!data.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty">
                        No fines found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML =
            data.map(fine => {

                const transaction =
                    fine.transaction || {};


                const user =
                    transaction.user || {};


                const copy =
                    transaction.bookCopy || {};


                const book =
                    copy.book || {};


                const status =
                    String(
                        fine.status || ""
                    ).toUpperCase();


                const amount =
                    Number(
                        fine.amount || 0
                    ).toFixed(2);


                let actionHTML = "";


                if (status === "UNPAID") {

                    actionHTML = `
                        <button
                            class="table-btn pay"
                            onclick="payFine(${fine.id})">

                            Mark Paid

                        </button>
                    `;

                } else {

                    actionHTML = `
                        <span class="paid-label">
                            ${escapeHTML(status)}
                        </span>
                    `;

                }


                return `
                    <tr>

                        <td>
                            ${escapeHTML(fine.id)}
                        </td>

                        <td>

                            <strong>
                                ${escapeHTML(user.name)}
                            </strong>

                            <small class="table-subtext">
                                ${escapeHTML(user.email)}
                            </small>

                        </td>

                        <td>
                            ${escapeHTML(book.title)}
                        </td>

                        <td>
                            ${escapeHTML(fine.overdueDays)}
                        </td>

                        <td>
                            ₹${escapeHTML(amount)}
                        </td>

                        <td>
                            ${escapeHTML(fine.fineDate)}
                        </td>

                        <td>

                            <span
                                class="status-badge ${status.toLowerCase()}">

                                ${escapeHTML(status)}

                            </span>

                        </td>

                        <td>
                            ${actionHTML}
                        </td>

                    </tr>
                `;

            }).join("");

    }


    window.payFine =
        async function (id) {

            const confirmed =
                confirm(
                    "Mark this fine as PAID?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await getJSON(
                    `/api/fines/${id}/pay`,
                    {
                        method: "PUT"
                    }
                );


                alert(
                    "Fine marked as paid."
                );


                await loadFines();
                await loadDashboard();

            } catch (error) {

                alert(
                    error.message ||
                    "Unable to mark fine as paid."
                );

            }

        };


    refreshFinesBtn?.addEventListener(
        "click",
        loadFines
    );


    fineSearch?.addEventListener(
        "input",
        () => {

            const query =
                fineSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                fines.filter(fine => {

                    const transaction =
                        fine.transaction || {};

                    const user =
                        transaction.user || {};

                    const copy =
                        transaction.bookCopy || {};

                    const book =
                        copy.book || {};


                    return (

                        String(
                            user.name || ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            user.email || ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            book.title || ""
                        )
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            fine.status || ""
                        )
                            .toLowerCase()
                            .includes(query)

                    );

                });


            renderFines(filtered);

        }
    );


    // ========================================================
    // LOGOUT
    // ========================================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    logoutBtn?.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem("user");

            window.location.href =
                "index.html";

        }
    );


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    loadDashboard();

    loadUsers();

    loadBooks();

    loadCopies();

    loadFines();

});