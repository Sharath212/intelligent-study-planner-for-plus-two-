checkAuthentication();

let assignments = getLocal("assignments");
let subjects = getLocal("subjects");

document.addEventListener("DOMContentLoaded", () => {

    loadAssignments();

    document.getElementById("assignmentForm")
        .addEventListener("submit", addAssignment);
});

async function loadAssignments() {

    try {
        const data = await apiRequest("/assignments");
        assignments = data.assignments || data || [];
        saveLocal("assignments", assignments);
    } catch {}

    subjects = getLocal("subjects");

    populateSubjects();
    renderAssignments();
}

function populateSubjects() {

    const select = document.getElementById("assignmentSubject");

    select.innerHTML = subjects.map(s =>
        `<option value="${s._id}">${escapeHtml(s.name)}</option>`
    ).join("");
}

async function addAssignment(e) {

    e.preventDefault();

    const assignment = {
        title: document.getElementById("assignmentName").value.trim(),
        subject: document.getElementById("assignmentSubject").value,
        deadline: document.getElementById("assignmentDeadline").value,
        completed: false
    };

    try {

        const data = await apiRequest("/assignments", {
            method: "POST",
            body: JSON.stringify(assignment)
        });

        assignments.push(data.assignment || data);

    } catch {

        assignment._id = Date.now().toString();
        assignments.push(assignment);
    }

    saveLocal("assignments", assignments);

    document.getElementById("assignmentForm").reset();

    renderAssignments();

    showMessage("message", "Assignment added.");
}

async function toggleAssignment(id) {

    const assignment = assignments.find(
        a => String(a._id) === String(id)
    );

    if (!assignment) return;

    assignment.completed = !assignment.completed;

    try {
        await apiRequest(`/assignments/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                completed: assignment.completed
            })
        });
    } catch {}

    saveLocal("assignments", assignments);

    renderAssignments();
}

async function deleteAssignment(id) {

    try {
        await apiRequest(`/assignments/${id}`, {
            method: "DELETE"
        });
    } catch {}

    assignments = assignments.filter(
        a => String(a._id) !== String(id)
    );

    saveLocal("assignments", assignments);

    renderAssignments();
}

function renderAssignments() {

    const container = document.getElementById("assignmentList");

    if (!assignments.length) {
        container.innerHTML =
            `<div class="empty-state">No assignments added.</div>`;
        return;
    }

    assignments.sort((a,b) =>
        new Date(a.deadline) - new Date(b.deadline)
    );

    container.innerHTML = assignments.map(a => {

        const subject = subjects.find(
            s => String(s._id) === String(a.subject)
        );

        return `
        <div class="border rounded p-3 mb-3 task-card">

            <div class="d-flex justify-content-between">

                <div>
                    <h5 class="${a.completed ? "text-decoration-line-through" : ""}">
                        ${escapeHtml(a.title || a.name)}
                    </h5>

                    <div class="text-muted">
                        ${escapeHtml(subject?.name || "Unknown Subject")}
                    </div>

                    <div class="mt-2">
                        Deadline: <strong>${formatDate(a.deadline)}</strong>
                    </div>
                </div>

                <div>
                    <button
                        onclick="toggleAssignment('${a._id}')"
                        class="btn btn-sm ${
                            a.completed ? "btn-warning" : "btn-success"
                        }">
                        ${a.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                        onclick="deleteAssignment('${a._id}')"
                        class="btn btn-sm btn-outline-danger">
                        Delete
                    </button>
                </div>

            </div>
        </div>
        `;
    }).join("");
}
