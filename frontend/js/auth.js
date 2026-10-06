function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function checkAuthentication() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

function showCurrentUser() {
    const user = getUser();

    document.querySelectorAll("[data-user-name]").forEach(el => {
        el.textContent = user?.fullName || "Student";
    });

    document.querySelectorAll("[data-user-email]").forEach(el => {
        el.textContent = user?.email || "";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    showCurrentUser();
});

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showMessage("message", "Passwords do not match.", "danger");
            return;
        }

        try {
            await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    confirmPassword
                })
            });

            showMessage(
                "message",
                "Registration successful! Redirecting to login...",
                "success"
            );

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            showMessage("message", error.message, "danger");
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            localStorage.setItem("token", data.token);

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            window.location.href = "dashboard.html";

        } catch (error) {
            showMessage("loginMessage", error.message, "danger");
        }
    });
}
