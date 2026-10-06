checkAuthentication();

let exams = getLocal("exams");
let subjects = getLocal("subjects");

document.addEventListener("DOMContentLoaded", () => {
    loadExams();

    document.getElementById("examForm")
        .addEventListener("submit", addExam);
});

async function loadExams() {

    subjects = getLocal("subjects");

    try {
        const data = await apiRequest("/exams");
        exams = data.exams || data || [];
        saveLocal("exams", exams);
    } catch {}

    populateSubjects();
    renderExams();
}

function populateSubjects() {

    const select = document.getElementById("examSubject");

    select.innerHTML = subjects.map(s =>
        `<option value="${s._id}">${escapeHtml(s.name)}</option>`
    ).join("");

    if (!subjects.length) {
        select.innerHTML = `<option value="">Add a subject first</option>`;
    }
}

async function addExam(e) {

    e.preventDefault();

    const exam = {
        title: document.getElementById("examName").value.trim(),
        subject: document.getElementById("examSubject").value,
        examDate: document.getElementById("examDate").value
    };

    try {

        const data = await apiRequest("/exams", {
            method: "POST",
            body: JSON.stringify(exam)
        });

        exams.push(data.exam || data);

    } catch {

        exam._id = Date.now().toString();
        exams.push(exam);
    }

    saveLocal("exams", exams);

    document.getElementById("examForm").reset();

    renderExams();
    showMessage("message", "Exam added.");
}

async function deleteExam(id) {

    if (!confirm("Delete this exam?")) return;

    try {
        await apiRequest(`/exams/${id}`, {
            method: "DELETE"
        });
    } catch {}

    exams = exams.filter(e => String(e._id) !== String(id));

    saveLocal("exams", exams);

    renderExams();
}

function daysUntil(date) {

    const today = new Date();
    today.setHours(0,0,0,0);

    const exam = new Date(date);
    exam.setHours(0,0,0,0);

    return Math.ceil((exam - today) / 86400000);
}

function renderExams() {

    const container = document.getElementById("examList");

    if (!exams.length) {
        container.innerHTML =
            `<tr><td colspan="5" class="text-center">No exams added.</td></tr>`;
        return;
    }

    exams.sort((a,b) =>
        new Date(a.examDate) - new Date(b.examDate)
    );

    container.innerHTML = exams.map(exam => {

        const subject = subjects.find(
            s => String(s._id) === String(exam.subject)
        );

        const days = daysUntil(exam.examDate);

        return `
        <tr>
            <td><strong>${escapeHtml(exam.title || exam.name)}</strong></td>
            <td>${escapeHtml(subject?.name || "Unknown")}</td>
            <td>${formatDate(exam.examDate)}</td>
            <td>
                <span class="badge ${
                    days <= 7 ? "bg-danger" :
                    days <= 14 ? "bg-warning text-dark" :
                    "bg-success"
                }">
                    ${days < 0 ? "Passed" : days + " days"}
                </span>
            </td>
            <td>
                <button
                    onclick="deleteExam('${exam._id}')"
                    class="btn btn-sm btn-outline-danger">
                    Delete
                </button>
            </td>
        </tr>
        `;
    }).join("");
}
