checkAuthentication();

document.addEventListener("DOMContentLoaded", async () => {

    let subjects = getLocal("subjects");
    let topics = getLocal("topics");

    try {

        const data = await apiRequest("/reports");

        subjects = data.subjects || subjects;
        topics = data.topics || topics;

    } catch {}

    createTopicChart(topics);
    createSubjectChart(subjects, topics);
});

function createTopicChart(topics) {

    const completed = topics.filter(t => t.completed).length;
    const pending = topics.length - completed;

    new Chart(
        document.getElementById("topicChart"),
        {
            type: "doughnut",
            data: {
                labels: ["Completed", "Pending"],
                datasets: [{
                    data: [completed, pending]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );
}

function createSubjectChart(subjects, topics) {

    const labels = [];
    const values = [];

    subjects.forEach(subject => {

        const list = topics.filter(
            t => String(t.subject) === String(subject._id)
        );

        const completed = list.filter(t => t.completed).length;

        const progress = list.length
            ? Math.round(completed / list.length * 100)
            : 0;

        labels.push(subject.name);
        values.push(progress);
    });

    new Chart(
        document.getElementById("subjectChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Progress %",
                    data: values
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        }
    );
}
