document.addEventListener("DOMContentLoaded", async function () {
  const username = "hritikshuklalfc";
  const container = document.getElementById("github-grid");
  const label = document.getElementById("git-card-label");

  if (!container) return;

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const today = new Date();
  const dates = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date();
    d.setDate(today.getDate() - (27 - i));
    dates.push(d.toISOString().split("T")[0]);
  }

  const dateMap = {};
  const commitCounts = {};

  dates.forEach((date) => {
    const square = document.createElement("div");
    square.className =
      "rounded-[1px] bg-white/10 w-full h-full transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer";

    square.addEventListener("mouseenter", () => {
      const count = commitCounts[date] || 0;
      const datePretty = formatDate(date);

      if (label) {
        label.innerText = `${datePretty}: ${count} Commit${
          count !== 1 ? "s" : ""
        }`;
        label.classList.add("text-accent");
        label.classList.remove("text-subtext");
      }

      square.classList.add("ring-1", "ring-white");
    });

    square.addEventListener("mouseleave", () => {
      if (label) {
        label.innerText = "Git Activity";
        label.classList.remove("text-accent");
        label.classList.add("text-subtext");
      }
      square.classList.remove("ring-1", "ring-white");
    });

    dateMap[date] = square;
    commitCounts[date] = 0;
    container.appendChild(square);
  });

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`
    );
    if (!response.ok) throw new Error("GitHub API Error");
    const events = await response.json();

    events.forEach((event) => {
      if (event.type === "PushEvent") {
        const date = event.created_at.split("T")[0];
        if (commitCounts[date] !== undefined) {
          const size = event.payload.size || 1;
          commitCounts[date] += size;
        }
      }
    });

    Object.keys(commitCounts).forEach((date) => {
      const count = commitCounts[date];
      const square = dateMap[date];
      if (square && count > 0) {
        square.classList.remove("bg-white/10");
        if (count <= 2) square.classList.add("bg-accent", "opacity-50");
        else if (count <= 5) square.classList.add("bg-accent", "opacity-80");
        else square.classList.add("bg-accent", "opacity-100");
      }
    });
  } catch (error) {
    console.error("Git load error", error);
  }
});
