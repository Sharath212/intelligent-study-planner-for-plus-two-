checkAuthentication();

document.addEventListener("DOMContentLoaded", async () => {

    let events = [];

    try {

        const data = await apiRequest("/calendar");

        events = data.events || data || [];

    } catch {

        const exams = getLocal("exams");
        const assignments = getLocal("assignments");
        const plan = getLocal("studyPlan");

        exams.forEach(e => {
            events.push({
                title: "?? " + (e.title || e.name),
                start: e.examDate
            });
        });

        assignments.forEach(a => {
            events.push({
                title: "?? " + (a.title || a.name),
                start: a.deadline
            });
        });

        plan.forEach(p => {
            events.push({
                title: "?? " + (p.title || p.topic),
                start: p.date
            });
        });
    }

    const calendar = new FullCalendar.Calendar(
        document.getElementById("calendar"),
        {
            initialView: "dayGridMonth",
            height: "auto",
            events
        }
    );

    calendar.render();
});
