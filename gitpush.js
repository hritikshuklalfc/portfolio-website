async function fetchGitHubActivity(hritikshuklalfc) {
  const repoNameEl = document.getElementById("repo-name");
  const repoDescEl = document.getElementById("repo-desc");
  const repoStatusEl = document.getElementById("repo-status");

  try {
    // Fetching repos sorted by last updated
    const response = await fetch(
      `https://api.github.com/users/${hritikshuklalfc}/repos?sort=updated&per_page=1`,
    );
    const data = await response.json();

    if (data.length > 0) {
      const latestRepo = data[0];

      // Update the UI with your site's data
      repoNameEl.innerText = latestRepo.name;
      repoDescEl.innerText =
        latestRepo.description || "No description provided.";

      // Format the date (e.g., "Updated 2 days ago")
      const updatedDate = new Date(latestRepo.updated_at).toLocaleDateString();
      repoStatusEl.innerText = `Updated: ${updatedDate}`;
    }
  } catch (error) {
    repoNameEl.innerText = "Connection Error";
    repoDescEl.innerText = "Could not load GitHub data.";
    console.error("Error fetching GitHub data:", error);
  }
}

// Initialize with your username
fetchGitHubActivity("hritikshuklalfc");
