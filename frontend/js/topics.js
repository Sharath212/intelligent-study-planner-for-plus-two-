checkAuthentication();

let topics = getLocal("topics");
let subjects = getLocal("subjects");

document.addEventListener("DOMContentLoaded", () => {

    loadTopics();

    document.getElementById("topicForm")
        .addEventListener("submit", addTopic);
});

async function loadTopics() {

    subjects = getLocal("subjects");

    try {
        const data = await apiRequest("/topics");
        topics = data.topics || data || [];
        saveLocal("topics", topics);
    } catch {}

    populateSubjects();
    renderTopics();
}

function populateSubjects() {

    const select = document.getElementById("topicSubject");

    if (!subjects.length) {
        select.innerHTML = `<option value="">Add a subject first</option>`;
        return;
    }

    select.innerHTML = subjects.map(s =>
        `<option value="${s._id}">${escapeHtml(s.name)}</option>`
    ).join("");
}

async function addTopic(e) {

    e.preventDefault();

    const topic = {
        title: document.getElementById("topicName").value.trim(),
        subject: document.getElementById("topicSubject").value,
        difficulty: document.getElementById("topicDifficulty").value,
        estimatedHours: Number(document.getElementById("topicHours").value),
        completed: false
    };

    try {

        const data = await apiRequest("/topics", {
            method: "POST",
            body: JSON.stringify(topic)
        });

        topics.push(data.topic || data);

    } catch {

        topic._id = Date.now().toString();
        topics.push(topic);
    }

    saveLocal("topics", topics);

    document.getElementById("topicForm").reset();

    renderTopics();
    showMessage("message", "Topic added successfully.");
}

async function toggleTopic(id) {

    const topic = topics.find(t => String(t._id) === String(id));

    if (!topic) return;

    topic.completed = !topic.completed;

    try {
        await apiRequest(`/topics/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                completed: topic.completed
            })
        });
    } catch {}

    saveLocal("topics", topics);

    renderTopics();
}

async function deleteTopic(id) {

    if (!confirm("Delete this topic?")) return;

    try {
        await apiRequest(`/topics/${id}`, {
            method: "DELETE"
        });
    } catch {}

    topics = topics.filter(t => String(t._id) !== String(id));

    saveLocal("topics", topics);

    renderTopics();
}

function renderTopics() {

    const container = document.getElementById("topicsList");

    if (!topics.length) {
        container.innerHTML =
            `<div class="empty-state">No topics added yet.</div>`;
        return;
    }

    container.innerHTML = topics.map(topic => {

        const subject = subjects.find(
            s => String(s._id) === String(topic.subject)
        );

        return `
        <div class="border rounded p-3 mb-3 task-card
            ${topic.completed ? "opacity-50" : ""}">

            <div class="d-flex justify-content-between align-items-center">

                <div>
                    <h5 class="${topic.completed ? "text-decoration-line-through" : ""}">
                        ${escapeHtml(topic.title || topic.name)}
                    </h5>

                    <span class="badge bg-secondary">
                        ${escapeHtml(subject?.name || "Unknown Subject")}
                    </span>

                    <span class="badge bg-info text-dark">
                        ${topic.difficulty || "Medium"}
                    </span>

                    <small class="text-muted ms-2">
                        ${topic.estimatedHours || 0} hour(s)
                    </small>
                </div>

                <div>
                    <button
                        onclick="toggleTopic('${topic._id}')"
                        class="btn btn-sm ${
                            topic.completed
                            ? "btn-warning"
                            : "btn-success"
                        }">
                        ${topic.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                        onclick="deleteTopic('${topic._id}')"
                        class="btn btn-sm btn-outline-danger">
                        Delete
                    </button>
                </div>

            </div>
        </div>
        `;
    }).join("");
}
