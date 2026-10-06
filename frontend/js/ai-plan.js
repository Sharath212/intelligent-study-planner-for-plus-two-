checkAuthentication();

async function generateAIPlan() {

    const result = document.getElementById("aiResult");

    result.innerHTML = `
        <div class="text-center p-4">
            <div class="spinner-border"></div>
            <p class="mt-3">Analyzing your study progress...</p>
        </div>
    `;

    try {

        const data = await apiRequest("/ai/study-plan", {
            method: "POST",
            body: JSON.stringify({
                subjects: getLocal("subjects"),
                topics: getLocal("topics"),
                exams: getLocal("exams"),
                assignments: getLocal("assignments")
            })
        });

        renderAIPlan(data);

    } catch {

        createLocalRecommendation();
    }
}

function renderAIPlan(data) {

    const result = document.getElementById("aiResult");

    const recommendations =
        data.recommendations ||
        data.plan ||
        [];

    if (typeof recommendations === "string") {
        result.innerHTML = `
            <div class="alert alert-info">
                ${escapeHtml(recommendations)}
            </div>
        `;
        return;
    }

    if (!recommendations.length) {
        createLocalRecommendation();
        return;
    }

    result.innerHTML = recommendations.map((item, index) => `
        <div class="border rounded p-3 mb-3">
            <h5>${index + 1}. ${escapeHtml(item.title || item.topic || "Recommendation")}</h5>
            <p class="mb-0">
                ${escapeHtml(item.description || item.reason || "")}
            </p>
        </div>
    `).join("");
}

function createLocalRecommendation() {

    const subjects = getLocal("subjects");
    const topics = getLocal("topics");
    const exams = getLocal("exams");

    const weakSubjects = subjects
        .map(subject => {

            const subjectTopics = topics.filter(
                t => String(t.subject) === String(subject._id)
            );

            const completed = subjectTopics.filter(t => t.completed).length;

            const progress = subjectTopics.length
                ? completed / subjectTopics.length
                : 0;

            return {
                subject,
                progress
            };
        })
        .sort((a,b) => a.progress - b.progress);

    let html = "";

    if (weakSubjects.length) {

        const weak = weakSubjects[0];

        html += `
        <div class="alert alert-warning">
            <strong>Focus Area:</strong>
            Spend additional time on
            <strong>${escapeHtml(weak.subject.name)}</strong>
            because it currently has lower topic completion.
        </div>
        `;
    }

    if (exams.length) {

        const upcoming = [...exams]
            .sort((a,b) =>
                new Date(a.examDate) - new Date(b.examDate)
            )[0];

        html += `
        <div class="alert alert-info">
            <strong>Upcoming Exam:</strong>
            Prioritize revision for
            <strong>${escapeHtml(upcoming.title || upcoming.name)}</strong>
            scheduled on ${formatDate(upcoming.examDate)}.
        </div>
        `;
    }

    html += `
    <div class="border rounded p-4">
        <h5>Recommended Daily Routine</h5>

        <ul>
            <li>Start with your highest-priority unfinished topic.</li>
            <li>Spend 45–60 minutes on difficult subjects.</li>
            <li>Take short breaks between study sessions.</li>
            <li>Review previously completed topics.</li>
            <li>Complete assignments before their deadlines.</li>
        </ul>
    </div>
    `;

    document.getElementById("aiResult").innerHTML = html;
}
