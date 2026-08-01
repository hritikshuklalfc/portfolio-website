document.addEventListener("DOMContentLoaded", async function () {
  const username = "hritikshuklalfc";
  const container = document.getElementById("github-grid");
  const label = document.getElementById("git-card-label");

  if (!container) {
    console.error("Container not found");
    return;
  }

  // Generate last 28 days
  const dates = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split("T")[0];
  });

  console.log("Date range:", dates[0], "to", dates[dates.length - 1]);

  const activityCounts = Object.fromEntries(dates.map((d) => [d, 0]));
  const dateMap = {};

  // Create grid
  container.innerHTML = "";
  dates.forEach((date) => {
    const square = document.createElement("div");
    square.className =
      "rounded-[1px] bg-white/5 w-full h-full transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer";

    square.onmouseenter = () => {
      const count = activityCounts[date];
      const prettyDate = new Date(date + "T12:00:00").toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
        },
      );
      if (label) {
        label.innerText = `${prettyDate}: ${count} Contribution${count !== 1 ? "s" : ""}`;
        label.style.color = "var(--accent)";
      }
      square.style.outline = "1px solid var(--text)";
    };

    square.onmouseleave = () => {
      if (label) {
        label.innerText = "Git Activity";
        label.style.color = "var(--subtext)";
      }
      square.style.outline = "none";
    };

    dateMap[date] = square;
    container.appendChild(square);
  });

  console.log("Grid created with", dates.length, "squares");

  // Fetch contribution data
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.contributions) {
      console.error("No contributions data in response");
      return;
    }

    let foundCount = 0;
    data.contributions.forEach((contribution) => {
      const date = contribution.date;
      if (date in activityCounts) {
        activityCounts[date] = contribution.count;
        foundCount++;
      }
    });

    console.log("Matched contributions for", foundCount, "dates");
    console.log("Activity counts:", activityCounts);

    // Apply colors
    Object.entries(activityCounts).forEach(([date, count]) => {
      const square = dateMap[date];
      if (square && count > 0) {
        square.style.backgroundColor = "var(--accent)";
        square.style.opacity =
          count === 1 ? "0.3" : count <= 3 ? "0.6" : count <= 6 ? "0.8" : "1";
      }
    });

    console.log("Colors applied");
  } catch (e) {
    console.error("Git load error:", e);
  }
});
