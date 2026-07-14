
const D = window.TRIP_DATA;
const start = new Date(D.tripStart);
const end = new Date(D.tripEnd);
const now = new Date();

function tripDay() {
  if (Number.isInteger(D.currentDayOverride)) return D.currentDayOverride;
  if (now < start) return -1;
  if (now > end) return 8;
  return Math.max(0, Math.min(8, Math.floor((now - start) / 86400000)));
}
const day = tripDay();

function statusText() {
  if (now < start) {
    const diff = start - now;
    const hours = Math.max(0, Math.floor(diff / 36e5));
    return `${Math.floor(hours/24)}d ${hours%24}h until departure`;
  }
  if (now <= end) return `Currently exploring • Trip day ${day}`;
  return "Adventure complete • Memories permanently unlocked";
}
document.getElementById("trip-status").textContent = statusText();

const progress = now < start ? 0 : now > end ? 100 : Math.round(((now-start)/(end-start))*100);
document.getElementById("progress-percent").textContent = `${progress}%`;
document.getElementById("progress-ring").style.setProperty("--p", progress);
document.getElementById("days-complete").textContent = Math.max(0, day);
document.getElementById("ports-complete").textContent = [3,4,5,6].filter(x => x <= day).length;
document.getElementById("photos-count").textContent = D.stats.photos;
document.getElementById("wildlife-count").textContent = D.stats.wildlifeSightings;

document.getElementById("timeline").innerHTML = D.itinerary.map(item => `
  <article class="timeline-item ${item.day <= day ? "active" : ""} ${item.day === day ? "current" : ""}">
    <div class="date">${item.date}</div>
    <div><h3>${item.title}</h3><p>${item.copy}</p></div>
  </article>
`).join("");

document.querySelectorAll(".map-stop").forEach(stop => {
  if (+stop.dataset.day <= day) stop.classList.add("active");
});
const ship = document.getElementById("ship-marker");
const positions = [
  [100,520],[170,470],[245,410],[310,340],[430,235],[560,175],[680,95],[520,220],[120,520]
];
const pos = positions[Math.max(0, Math.min(8, day < 0 ? 0 : day))];
ship.setAttribute("transform", `translate(${pos[0]-100} ${pos[1]-520})`);

document.getElementById("journal-grid").innerHTML = D.journal.map(item => `
  <article class="journal-card ${item.status}">
    <div>
      <div class="meta">${item.meta}</div>
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    </div>
    <div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
  </article>
`).join("");

document.getElementById("wildlife-grid").innerHTML = D.wildlife.map(item => `
  <article class="wildlife-card ${item.seen ? "seen" : ""}">
    <div class="icon">${item.icon}</div>
    <h3>${item.name}</h3>
    <p>${item.copy}</p>
    ${item.seen ? '<span class="sighting-badge">SPOTTED</span>' : ""}
  </article>
`).join("");

document.getElementById("gear-grid").innerHTML = D.gear.map((item,i) => `
  <article class="gear-card">
    <div class="gear-index">${String(i+1).padStart(2,"0")}</div>
    <h3>${item.name}</h3>
    <p>${item.copy}</p>
  </article>
`).join("");

const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
