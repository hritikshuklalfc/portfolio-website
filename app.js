/* -------------------------------------------------------------------------- */
/* 1. INITIALIZATION & UTILS                                                  */
/* -------------------------------------------------------------------------- */

// Time Update Logic
function updateTime() {
  const now = new Date();
  const timeOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  };

  const timeString = now.toLocaleTimeString("en-US", timeOptions);
  // Remove seconds for footer
  const shortTime = now.toLocaleTimeString("en-US", {
    ...timeOptions,
    second: undefined,
  });

  const liveClock = document.getElementById("live-clock");
  const footerTime = document.getElementById("footer-time");

  if (liveClock) liveClock.innerText = timeString;
  if (footerTime) footerTime.innerText = shortTime;
}
setInterval(updateTime, 1000);
updateTime();

/* -------------------------------------------------------------------------- */
/* 2. GLOBAL CLICK COUNTER                                                    */
/* -------------------------------------------------------------------------- */
const countDisplay = document.getElementById("click-count");
const blobContainer = document.getElementById("blob-container");
const API_NAMESPACE = "hritikshukla-portfolio";
const API_KEY = "global_clicks";

(async function initGlobalCount() {
  if (!countDisplay) return;
  try {
    const res = await fetch(
      `https://api.counterapi.dev/v1/${API_NAMESPACE}/${API_KEY}/`
    );
    const data = await res.json();
    if (data && data.count) {
      countDisplay.innerText = data.count.toLocaleString();
    } else {
      countDisplay.innerText = "0";
    }
  } catch (e) {
    console.log("Counter offline, using fallback.");
    countDisplay.innerText = "0";
  }
})();

/* -------------------------------------------------------------------------- */
/* 3. AESTHETIC BLOB LOGIC (UPDATED COLORS)                                   */
/* -------------------------------------------------------------------------- */
document.body.addEventListener("click", (e) => {
  // Prevent blobs on interactive elements
  if (
    e.target.closest("button") ||
    e.target.closest("a") ||
    e.target.closest(".no-blob")
  )
    return;

  // New Color Palette (Inkwell / Creme Brulee inspired)
  const colors = [
    "#A27B5B", // Creme Brulee
    "#DCD7C9", // Au Lait
    "#2C3639", // Inkwell (Dark)
    "#3F4E4F", // Lunar Eclipse
    "#E3CAA5", // Light Gold
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const blob = document.createElement("div");
  blob.classList.add("click-blob");
  blob.style.background = randomColor;

  // Center blob on click
  blob.style.left = `${e.pageX - 100}px`;
  blob.style.top = `${e.pageY - 100}px`;

  if (blobContainer) blobContainer.appendChild(blob);

  // Cleanup
  setTimeout(() => {
    blob.remove();
  }, 1500);

  // Update Counter optimistically
  if (countDisplay) {
    let currentVal = parseInt(countDisplay.innerText.replace(/,/g, "")) || 0;
    countDisplay.innerText = (currentVal + 1).toLocaleString();

    fetch(`https://api.counterapi.dev/v1/${API_NAMESPACE}/${API_KEY}/up`).catch(
      (err) => console.error("Sync failed:", err)
    );
  }
});

/* -------------------------------------------------------------------------- */
/* 4. MAP LOGIC                                                               */
/* -------------------------------------------------------------------------- */
if (document.getElementById("map") && typeof L !== "undefined") {
  try {
    const lat = 17.385;
    const lng = 78.4867;

    if (window.myMap) window.myMap.remove();

    window.myMap = L.map("map", {
      center: [lat, lng],
      zoom: 12,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
    });

    // Use CartoDB Dark Matter for that "Inkwell" look
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
      }
    ).addTo(window.myMap);

    setTimeout(() => {
      window.myMap.invalidateSize();
    }, 100);
  } catch (e) {
    console.error("Map failed to load:", e);
  }
}

/* -------------------------------------------------------------------------- */
/* 5. SOCIAL FEED                                                             */
/* -------------------------------------------------------------------------- */
const socialPosts = [
  {
    source: "LinkedIn",
    icon: "fab fa-linkedin",
    content:
      "Today I pushed my first ever contribution to Open Source (updating English League data for OpenFootball).",
    date: "31 Dec, 2025",
    link: "https://www.linkedin.com/posts/hritik-shukla-a81350366_coding-productivity-opensource-activity-7412149130405539840-Xa4C?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFrR3wEBxjbrLCVJ10k-eZ2CFC6aBpJHPRQ",
  },
  {
    source: "X",
    icon: "fab fa-x",
    content:
      "Stefan Bajcetic staying at Liverpool FC, how is this better for both parties?",
    date: "31 Aug, 2025",
    link: "https://x.com/hritikshukla005/status/1962128490615992390?s=20",
  },
  {
    source: "X",
    icon: "fab fa-x",
    content: "Florian Wirtz: The Leverkusen Boy Set to be the Liverpool Man",
    date: "29 May, 2025",
    link: "https://x.com/hritikshukla005/status/1928154907447611878?s=20",
  },
];

const feedContainer = document.getElementById("social-feed");
if (feedContainer) {
  feedContainer.innerHTML = socialPosts
    .map(
      (post) => `
          <li class="flex justify-between items-start group cursor-pointer border-b border-white/5 pb-2 last:border-0" onclick="window.open('${post.link}', '_blank')">
              <div class="flex gap-3">
                  <div class="mt-1 text-subtext group-hover:text-accent transition-colors">
                      <i class="${post.icon}"></i>
                  </div>
                  <div class="flex flex-col">
                      <span class="group-hover:text-text text-subtext transition-colors leading-snug font-sans">${post.content}</span>
                  </div>
              </div>
              <span class="text-subtext text-[10px] whitespace-nowrap ml-4 opacity-60">${post.date}</span>
          </li>
      `
    )
    .join("");
}
