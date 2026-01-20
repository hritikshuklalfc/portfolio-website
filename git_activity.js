document.addEventListener("DOMContentLoaded", async function () {
  const username = "hritikshuklalfc";
  const container = document.getElementById("github-grid");
  const label = document.getElementById("git-card-label");

  if (!container) return;

  const getLocalDateString = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const dates = [];
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(getLocalDateString(d));
  }

  const dateMap = {};
  const activityCounts = {};

  container.innerHTML = "";

  dates.forEach((date) => {
    const square = document.createElement("div");
    square.className =
      "rounded-[1px] bg-white/5 w-full h-full transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer";

    square.addEventListener("mouseenter", () => {
      const count = activityCounts[date] || 0;
      const d = new Date(date);
      const prettyDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (label) {
        label.innerText = `${prettyDate}: ${count} Contribution${count !== 1 ? "s" : ""}`;
        label.style.color = "var(--accent)";
      }
      square.style.outline = "1px solid var(--text)";
    });

    square.addEventListener("mouseleave", () => {
      if (label) {
        label.innerText = "Git Activity";
        label.style.color = "var(--subtext)";
      }
      square.style.outline = "none";
    });

    dateMap[date] = square;
    activityCounts[date] = 0;
    container.appendChild(square);
  });

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100&t=${Date.now()}`,
    );
    const events = await response.json();

    events.forEach((event) => {
      const date = getLocalDateString(new Date(event.created_at));
      if (activityCounts[date] !== undefined) {
        if (event.type === "PushEvent") {
          activityCounts[date] += event.payload.commits
            ? event.payload.commits.length
            : 1;
        } else if (
          ["CreateEvent", "PullRequestEvent", "IssuesEvent"].includes(
            event.type,
          )
        ) {
          activityCounts[date] += 1;
        }
      }
    });

    Object.keys(activityCounts).forEach((date) => {
      const count = activityCounts[date];
      const square = dateMap[date];
      if (square && count > 0) {
        square.style.backgroundColor = "var(--accent)";
        if (count === 1) square.style.opacity = "0.3";
        else if (count <= 3) square.style.opacity = "0.6";
        else if (count <= 6) square.style.opacity = "0.8";
        else square.style.opacity = "1";
      }
    });
  } catch (e) {
    console.error("Git load error", e);
  }
});
