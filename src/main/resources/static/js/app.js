/* =========================================
   SMART LIBRARY INTRO
========================================= */

window.addEventListener("load", function () {

    const introScreen =
        document.getElementById("introScreen");

    const loginScreen =
        document.getElementById("loginScreen");


    /*
     * 3.7 seconds ke baad
     * Intro -> Login
     */

    setTimeout(function () {

        introScreen.style.opacity = "0";

        introScreen.style.transition =
            "opacity 0.8s ease";


        setTimeout(function () {

            introScreen.classList.add("hidden");

            loginScreen.classList.remove("hidden");

        }, 800);

    }, 3700);

});


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        message.textContent =
            "Logging in...";


        try {

            const response =
                await fetch("/api/auth/login", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })

                });


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Invalid email or password";

                return;
            }


            /*
             * User information save
             */

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );


            message.textContent =
                "Login successful!";


            /*
             * Role based dashboard
             */

            setTimeout(function () {

                if (data.role === "ADMIN") {

                    window.location.href =
                        "admin-dashboard.html";

                }

                else if (
                    data.role === "LIBRARIAN"
                ) {

                    window.location.href =
                        "librarian-dashboard.html";

                }

                else if (
                    data.role === "STUDENT"
                ) {

                    window.location.href =
                        "student-dashboard.html";

                }

                else {

                    message.textContent =
                        "Unknown user role";

                }

            }, 600);


        }

        catch (error) {

            console.error(
                "Login error:",
                error
            );

            message.textContent =
                "Unable to connect to server.";

        }

    }
);