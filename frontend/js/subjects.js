checkAuthentication();

let subjects = getLocal("subjects");

document.addEventListener("DOMContentLoaded", () => {
    loadSubjects();

    document.getElementById("subjectForm").addEventListener("submit", addSubject);
});

async function loadSubjects() {

    try {
        const data = await apiRequest("/subjects");

        subjects = data.subjects || data || [];
        saveLocal("subjects", subjects);

    } catch {
        subjects = getLocal("subjects");
    }

    renderSubjects();
}

async function addSubject(e) {

    e.preventDefault();

    const subject = {
        name: document.getElementById("subjectName").value.trim(),
        difficulty: document.getElementById("subjectDifficulty").value,
        targetHours: Number(document.getElementById("targetHours").value)
    };

    if (!subject.name) return;

    try {

        const data = await apiRequest("/subjects", {
            method: "POST",
            body: JSON.stringify(subject)
        });

        subjects.push(data.subject || data);

    } catch {

        subject._id = Date.now().toString();
        subjects.push(subject);
    }

    saveLocal("subjects", subjects);

    document.getElementById("subjectForm").reset();

    showMessage("message", "Subject added successfully.");

    renderSubjects();
}

async function deleteSubject(id) {

    if (!confirm("Delete this subject?")) return;

    try {
        await apiRequest(`/subjects/${id}`, {
            method: "DELETE"
        });
    } catch {}

    subjects = subjects.filter(s => String(s._id) !== String(id));

    saveLocal("subjects", subjects);

    renderSubjects();
}

function renderSubjects() {

    const container = document.getElementById("subjectsList");

    if (!subjects.length) {
        container.innerHTML =
            `<div class="empty-state">No subjects added yet.</div>`;
        return;
    }

    container.innerHTML = subjects.map(subject => {

        const progress = subject.progress || 0;

        return `
        <div class="col-md-4">
            <div class="border rounded p-4 h-100 card-hover">
                <h5>${escapeHtml(subject.name)}</h5>

                <span class="badge bg-${
                    subject.difficulty === "Hard"
                    ? "danger"
                    : subject.difficulty === "Medium"
                    ? "warning text-dark"
                    : "success"
                }">
                    ${subject.difficulty || "Medium"}
                </span>

                <p class="mt-3 mb-1">Progress: ${progress}%</p>

                <div class="progress mb-3">
                    <div class="progress-bar" style="width:${progress}%"></div>
                </div>

                <small class="text-muted">
                    Target: ${subject.targetHours || 0} hours
                </small>

                <div class="mt-3">
                    <a href="topics.html?subject=${subject._id}"
                       class="btn btn-sm btn-primary">
                       Topics
                    </a>

                    <button
                        onclick="deleteSubject('${subject._id}')"
                        class="btn btn-sm btn-outline-danger">
                        Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join("");
}
