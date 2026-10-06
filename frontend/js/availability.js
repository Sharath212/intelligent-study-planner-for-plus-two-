checkAuthentication();

let availability = getLocal("availability");

document.addEventListener("DOMContentLoaded", () => {

    loadAvailability();

    document.getElementById("availabilityForm")
        .addEventListener("submit", saveAvailability);
});

async function loadAvailability() {

    try {
        const data = await apiRequest("/availability");
        availability = data.availability || data || [];
        saveLocal("availability", availability);
    } catch {}

    renderAvailability();
}

async function saveAvailability(e) {

    e.preventDefault();

    const item = {
        day: document.getElementById("day").value,
        startTime: document.getElementById("startTime").value,
        endTime: document.getElementById("endTime").value
    };

    try {
        await apiRequest("/availability", {
            method: "POST",
            body: JSON.stringify(item)
        });
    } catch {}

    item._id = Date.now().toString();

    availability.push(item);

    saveLocal("availability", availability);

    renderAvailability();

    showMessage("message", "Availability saved.");
}

function deleteAvailability(id) {

    availability = availability.filter(
        a => String(a._id) !== String(id)
    );

    saveLocal("availability", availability);

    renderAvailability();
}

function renderAvailability() {

    const container = document.getElementById("availabilityList");

    if (!availability.length) {
        container.innerHTML =
            `<div class="empty-state">No availability added.</div>`;
        return;
    }

    container.innerHTML = availability.map(a => `
        <div class="border rounded p-3 mb-2 d-flex justify-content-between">
            <strong>${a.day}</strong>

            <span>
                ${a.startTime} - ${a.endTime}

                <button
                    onclick="deleteAvailability('${a._id}')"
                    class="btn btn-sm btn-outline-danger ms-3">
                    Delete
                </button>
            </span>
        </div>
    `).join("");
}
