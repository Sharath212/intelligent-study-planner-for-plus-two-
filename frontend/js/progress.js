checkAuthentication();

document.addEventListener("DOMContentLoaded", loadProgress);

async function loadProgress() {

    let subjects = getLocal("subjects");
    let topics = getLocal("topics");

    try {

        const data = await apiRequest("/progress");

        if (data) {
            subjects = data.subjects || subjects;
            topics = data.topics || topics;
        }

    } catch {}

    const completed = topics.filter(t => t.completed).length;
    const pending = topics.length - completed;

    const overall = topics.length
        ? Math.round((completed / topics.length) * 100)
        : 0;

    document.getElementById("overallProgress").textContent =
        `${overall}%`;

    document.getElementById("completedTopics").textContent =
        completed;

    document.getElementById("pendingTopics").textContent =
        pending;

    renderSubjectProgress(subjects, topics);
}

function renderSubjectProgress(subjects, topics) {

    const container = document.getElementById("subjectProgress");

    if (!subjects.length) {
        container.innerHTML =
            `<div class="empty-state">No subjects available.</div>`;
        return;
    }

    container.innerHTML = subjects.map(subject => {

        const subjectTopics = topics.filter(
            t => String(t.subject) === String(subject._id)
        );

        const completed = subjectTopics.filter(
            t => t.completed
        ).length;

        const progress = subjectTopics.length
            ? Math.round((completed / subjectTopics.length) * 100)
            : 0;

        return `
        <div class="mb-4">

            <div class="d-flex justify-content-between mb-1">
                <strong>${escapeHtml(subject.name)}</strong>
                <span>${progress}%</span>
            </div>

            <div class="progress">
                <div class="progress-bar"
                     style="width:${progress}%">
                </div>
            </div>

            <small class="text-muted">
                ${completed} of ${subjectTopics.length} topics completed
            </small>

        </div>
        `;

    }).join("");
}
