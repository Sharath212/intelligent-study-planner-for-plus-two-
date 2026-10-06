const API_BASE_URL = "http://localhost:5000/api";

function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

function saveLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getLocal(key, defaultValue = []) {
    try {
        return JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch {
        return defaultValue;
    }
}

function showMessage(elementId, message, type = "success") {
    const el = document.getElementById(elementId);

    if (!el) return;

    el.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
}

function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}
