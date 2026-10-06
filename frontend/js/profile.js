checkAuthentication();

document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {

    const user = getUser();

    if (user) {
        document.getElementById("profileName").value =
            user.fullName || "";

        document.getElementById("profileEmail").value =
            user.email || "";
    }

    const goal = localStorage.getItem("studyGoal");

    if (goal) {
        document.getElementById("studyGoal").value = goal;
    }

    try {

        const data = await apiRequest("/profile");

        const profile = data.user || data;

        if (profile) {
            document.getElementById("profileName").value =
                profile.fullName || "";

            document.getElementById("profileEmail").value =
                profile.email || "";
        }

    } catch {}
}

document.getElementById("profileForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const profile = {
            fullName: document.getElementById("profileName").value.trim(),
            email: document.getElementById("profileEmail").value.trim(),
            studyGoal: Number(document.getElementById("studyGoal").value)
        };

        try {

            const data = await apiRequest("/profile", {
                method: "PUT",
                body: JSON.stringify(profile)
            });

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

        } catch {

            const user = getUser() || {};

            user.fullName = profile.fullName;
            user.email = profile.email;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        }

        localStorage.setItem(
            "studyGoal",
            profile.studyGoal
        );

        showMessage(
            "message",
            "Profile updated successfully."
        );
    });
