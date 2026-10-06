checkAuthentication();

document.addEventListener("DOMContentLoaded", async () => {

    const user = getUser();

    if (user) {
        document.getElementById("welcomeMessage").textContent =
            `Welcome, ${user.fullName}! ??`;
    }

    try {
        const data = await apiRequest("/dashboard");

        if (data) {
            document.getElementById("overallProgress").textContent =
                `${data.overallProgress || 0}%`;

            document.getElementById("progressBar").style.width =
                `${data.overallProgress || 0}%`;

            document.getElementById("subjectCount").textContent =
                data.subjectCount || 0;

            document.getElementById("pendingTopics").textContent =
                data.pendingTopics || 0;

            document.getElementById("studyHours").textContent =
                data.studyHours || 0;

            renderList("upcomingExams", data.upcomingExams, "exam");
            renderList("upcomingAssignments", data.upcomingAssignments, "assignment");
        }

    } catch {
        // Dashboard can still be used while backend modules are being developed.
        loadLocalDashboard();
    }
});

function renderList(elementId, items, type) {

    const container = document.getElementById(elementId);

    if (!items || items.length === 0) {
        container.innerHTML =
            `<div class="empty-state">No upcoming ${type}s.</div>`;
        return;
    }

    container.innerHTML = items.slice(0, 5).map(item => `
        <div class="border rounded p-3 mb-2">
            <strong>${escapeHtml(item.title || item.name)}</strong>
            <div class="small text-muted">
                ${formatDate(item.date || item.examDate || item.deadline)}
            </div>
        </div>
    `).join("");
}

function loadLocalDashboard() {

    const subjects = getLocal("subjects");
    const topics = getLocal("topics");

    const completed = topics.filter(t => t.completed).length;

    const progress = topics.length
        ? Math.round((completed / topics.length) * 100)
        : 0;

    document.getElementById("overallProgress").textContent = `${progress}%`;
    document.getElementById("progressBar").style.width = `${progress}%`;
    document.getElementById("subjectCount").textContent = subjects.length;
    document.getElementById("pendingTopics").textContent =
        topics.filter(t => !t.completed).length;
}
