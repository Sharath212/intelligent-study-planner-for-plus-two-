checkAuthentication();

let plan = getLocal("studyPlan");

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("planStart").value =
        new Date().toISOString().split("T")[0];

    document.getElementById("plannerForm")
        .addEventListener("submit", generatePlan);

    renderPlan();
});

async function generatePlan(e) {

    e.preventDefault();

    const startDate = document.getElementById("planStart").value;
    const dailyHours = Number(document.getElementById("dailyHours").value);

    try {

        const data = await apiRequest("/planner/generate", {
            method: "POST",
            body: JSON.stringify({
                startDate,
                dailyHours
            })
        });

        plan = data.plan || data.schedule || data;

    } catch {

        plan = createLocalPlan(startDate, dailyHours);
    }

    saveLocal("studyPlan", plan);

    renderPlan();

    showMessage("message", "Study plan generated successfully.");
}

function createLocalPlan(startDate, dailyHours) {

    const topics = getLocal("topics")
        .filter(t => !t.completed);

    const subjects = getLocal("subjects");

    let result = [];
    let current = new Date(startDate);

    topics.forEach((topic, index) => {

        const subject = subjects.find(
            s => String(s._id) === String(topic.subject)
        );

        result.push({
            _id: Date.now().toString() + index,
            date: current.toISOString().split("T")[0],
            title: topic.title || topic.name,
            subject: subject?.name || "General",
            hours: Math.min(topic.estimatedHours || 1, dailyHours),
            completed: false
        });

        current.setDate(current.getDate() + 1);
    });

    return result;
}

function renderPlan() {

    const container = document.getElementById("plannerList");

    if (!plan || !plan.length) {
        container.innerHTML =
            `<div class="empty-state">
                No study plan generated yet.
            </div>`;
        return;
    }

    container.innerHTML = plan.map(item => `
        <div class="border rounded p-3 mb-3 task-card">

            <div class="row align-items-center">

                <div class="col-md-3">
                    <strong>${formatDate(item.date)}</strong>
                </div>

                <div class="col-md-4">
                    <strong>${escapeHtml(item.title || item.topic)}</strong>
                    <div class="small text-muted">
                        ${escapeHtml(item.subject || "")}
                    </div>
                </div>

                <div class="col-md-2">
                    ${item.hours || 1} hour(s)
                </div>

                <div class="col-md-3 text-md-end">
                    <span class="badge ${
                        item.completed ? "bg-success" : "bg-warning text-dark"
                    }">
                        ${item.completed ? "Completed" : "Pending"}
                    </span>
                </div>

            </div>

        </div>
    `).join("");
}
