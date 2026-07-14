const tripStart = new Date('2026-07-15T06:00:00-05:00');
const tripEnd = new Date('2026-07-23T23:59:00-05:00');

const itinerary = [
  { day: 'DAY 0', date: 'JUL 15', title: 'Texas → Seattle', copy: 'Early flight, Seattle arrival, Populus check-in, and the first official travel journal entry.' },
  { day: 'DAY 1', date: 'JUL 16', title: 'Board Brilliant Lady', copy: 'Embarkation, cabin reveal, ship exploration, and sail away from Seattle.' },
  { day: 'DAY 2', date: 'JUL 17', title: 'Inside Passage', copy: 'Scenic cruising, wildlife watch, ship experiences, and Alaska finally surrounding us.' },
  { day: 'DAY 3', date: 'JUL 18', title: 'Ketchikan', copy: 'Colorful waterfronts, local character, and the first Alaska port adventure.' },
  { day: 'DAY 4', date: 'JUL 19', title: 'Sitka', copy: 'History, coastal scenery, wildlife possibilities, and another chapter of the journey.' },
  { day: 'DAY 5', date: 'JUL 20', title: 'Endicott Arm & Dawes Glacier', copy: 'The cinematic centerpiece: ice, scale, silence, and a truly unforgettable view.' },
  { day: 'DAY 6', date: 'JUL 21', title: 'Prince Rupert', copy: 'A Canadian port day with harbor views, local exploration, and one more stamp in the story.' },
  { day: 'DAY 7', date: 'JUL 22', title: 'Final Sea Day', copy: 'Favorite moments, final ship experiences, last-night energy, and reflection.' },
  { day: 'DAY 8', date: 'JUL 23', title: 'Seattle → Home', copy: 'Disembarkation, the journey home, and the beginning of the final travel journal.' }
];

const updates = [
  { meta:'PRE-TRIP', title:'The adventure begins tomorrow', copy:'Bags packed, batteries charged, storage cleared, and expectations officially unreasonable.', tag:'Ready for launch' },
  { meta:'DAY 0', title:'Texas to Seattle', copy:'Photos, highlights, favorite moment, and the first official dispatch will appear here.', tag:'Coming soon' },
  { meta:'DAY 1', title:'Embarkation & sail away', copy:'The first look at Brilliant Lady, the cabin reveal, and departure from Seattle.', tag:'Coming soon' },
  { meta:'DAY 2', title:'Inside Passage', copy:'Scenery, wildlife, ship life, and the first full day surrounded by Alaska.', tag:'Coming soon' },
  { meta:'DAY 3', title:'Ketchikan', copy:'A port-day recap featuring the best photo, meal, and unexpected moment.', tag:'Coming soon' },
  { meta:'DAY 4–8', title:'The story continues', copy:'Sitka, Dawes Glacier, Prince Rupert, the final sea day, and the journey home.', tag:'More ahead' }
];

const wildlife = [
  { icon:'🐋', name:'Whale', copy:'The dream sighting. Bonus points for a tail shot.', seen:false },
  { icon:'🦅', name:'Bald eagle', copy:'Alaska’s most photogenic overhead celebrity.', seen:false },
  { icon:'🦦', name:'Sea otter', copy:'Small, adorable, and extremely easy to over-photograph.', seen:false },
  { icon:'🐻', name:'Bear', copy:'A rare, high-priority sighting from a safe distance.', seen:false },
  { icon:'🦭', name:'Seal or sea lion', copy:'Likely harbor guests and excellent video subjects.', seen:false },
  { icon:'🫎', name:'Moose', copy:'Unlikely, but the board stays optimistic.', seen:false },
  { icon:'🐬', name:'Porpoise', copy:'Fast-moving bonus wildlife for scenic cruising days.', seen:false },
  { icon:'🌌', name:'Aurora', copy:'Not wildlife, but absolutely worthy of the board.', seen:false }
];

const gear = [
  { name:'iPhone 17 Pro Max', copy:'Primary camera, journal hub, maps, editing station, and emergency everything device.' },
  { name:'GoPro HERO10', copy:'Weather-ready action footage, wide shots, and moments where the phone should stay protected.' },
  { name:'Meta Oakley glasses', copy:'Hands-free candid clips and first-person moments without stopping the experience.' },
  { name:'Apple Watch Ultra 2', copy:'Activity, route context, quick controls, and a little extra travel telemetry.' },
  { name:'External SSD', copy:'The nightly footage vault that keeps the iPhone ready for another day.' },
  { name:'Power bank', copy:'Because Alaska scenery does not care about battery anxiety.' },
  { name:'Binoculars', copy:'Wildlife spotting before the cameras know where to aim.' },
  { name:'Travel journal', copy:'The human layer: reactions, meals, funny moments, and details photos cannot capture.' }
];

function setStatus() {
  const now = new Date();
  const el = document.getElementById('trip-status');
  if (now < tripStart) {
    const diff = tripStart - now;
    const hours = Math.max(0, Math.floor(diff / 36e5));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    el.textContent = `${days}d ${remainingHours}h until departure`;
  } else if (now <= tripEnd) {
    const day = Math.floor((now - tripStart) / 86400000);
    el.textContent = `Currently exploring • Trip day ${Math.min(day, 8)}`;
  } else {
    el.textContent = 'Adventure complete • Memories permanently unlocked';
  }
}

document.getElementById('timeline').innerHTML = itinerary.map(item => `
  <article class="timeline-item">
    <div class="date">${item.date}</div>
    <div><h3>${item.title}</h3><p>${item.copy}</p></div>
    <div class="day-number">${item.day}</div>
  </article>
`).join('');

document.getElementById('update-grid').innerHTML = updates.map(item => `
  <article class="update-card">
    <div>
      <div class="meta">${item.meta}</div>
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    </div>
    <span class="tag">${item.tag}</span>
  </article>
`).join('');

document.getElementById('wildlife-grid').innerHTML = wildlife.map(item => `
  <article class="wildlife-card ${item.seen ? 'seen' : ''}">
    <div class="icon">${item.icon}</div>
    <h3>${item.name}</h3>
    <p>${item.copy}</p>
  </article>
`).join('');

document.getElementById('gear-grid').innerHTML = gear.map(item => `
  <article class="gear-card">
    <h3>${item.name}</h3>
    <p>${item.copy}</p>
  </article>
`).join('');

setStatus();
setInterval(setStatus, 60000);
