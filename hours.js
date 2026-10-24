/* ===== ÅBNINGSTIDER: ret kun her =====
   Ugedage: 0 = søndag, 1 = mandag ... 6 = lørdag.
   Skriv ["15:00", "19:00"] for åbent, "lukket" for lukket, eller null hvis tiden ikke er kendt.
   Lukketid ved eller efter midnat skrives som fx "00:00" eller "02:00".
   Tilføj "senere" som tredje værdi, hvis der ofte er åbent længere, fx ["15:00", "00:00", "senere"]. */
const AABNINGSTIDER = {
  1: ["15:00", "19:00"], // mandag
  2: ["15:00", "19:00"], // tirsdag
  3: ["15:00", "19:00"], // onsdag
  4: ["15:00", "19:00"], // torsdag
  5: ["15:00", "00:00", "senere"], // fredag
  6: ["15:00", "00:00", "senere"], // lørdag
  0: ["15:00", "19:00"]  // søndag
};
/* Særlige dage (helligdage, events) går forud for ugeplanen. Format "ÅÅÅÅ-MM-DD".
   Eksempel: "2026-12-24": { tid: "lukket", note: "Juleaften" } */
const SAERLIGE_DAGE = {
};
/* ===================================== */

(function () {
  const TZ = "Europe/Copenhagen";

  // Nuværende dato og klokkeslæt i dansk tid, uanset hvor den besøgende er.
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const today = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day));
  const nowMin = (+parts.hour) * 60 + (+parts.minute);

  const iso = d => d.toISOString().slice(0, 10);
  const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
  const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmt = t => { const [h, m] = t.split(":"); const hh = String(+h).padStart(2, "0"); return m === "00" ? hh : hh + "." + m; };
  const wdFmt = new Intl.DateTimeFormat("da-DK", { weekday: "short", timeZone: "UTC" });
  const dtFmt = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", timeZone: "UTC" });

  function dayInfo(d) {
    const s = SAERLIGE_DAGE[iso(d)];
    if (s) return { tid: s.tid, note: s.note || "" };
    return { tid: AABNINGSTIDER[d.getUTCDay()], note: "" };
  }
  // Åbningsvindue i minutter fra dagens midnat; lukketid efter midnat lægges oven i.
  function windowOf(tid) {
    if (!Array.isArray(tid)) return null;
    const o = toMin(tid[0]); let c = toMin(tid[1]);
    if (c <= o) c += 1440;
    return [o, c];
  }
  const later = tid => Array.isArray(tid) && tid[2] === "senere";
  const label = tid => tid === "lukket" ? "Lukket" : Array.isArray(tid) ? fmt(tid[0]) + "–" + fmt(tid[1]) + (later(tid) ? "+" : "") : "Ukendt";
  const closes = tid => later(tid) ? "til kl. " + fmt(tid[1]) + " eller senere" : "lukker kl. " + fmt(tid[1]);

  // Status lige nu, også når gårsdagens åbning løber efter midnat.
  function statusNow() {
    const y = dayInfo(addDays(today, -1)), t = dayInfo(today);
    const yWin = windowOf(y.tid), tWin = windowOf(t.tid);
    if (yWin && nowMin + 1440 < yWin[1]) return { cls: "open", text: "Åbent nu · " + closes(y.tid) };
    // Efter den faste lukketid på en aften med "senere" ved vi ikke, om der stadig er åbent.
    if (yWin && later(y.tid) && nowMin < 6 * 60) return null;
    if (tWin && nowMin >= tWin[0] && nowMin < tWin[1]) return { cls: "open", text: "Åbent nu · " + closes(t.tid) };
    if (tWin && nowMin < tWin[0]) return { cls: "closed", text: "Lukket · åbner i dag kl. " + fmt(t.tid[0]) };
    for (let i = 1; i < 7; i++) {
      const n = dayInfo(addDays(today, i));
      if (Array.isArray(n.tid)) {
        const when = i === 1 ? "i morgen" : wdFmt.format(addDays(today, i)).replace(".", "");
        return { cls: "closed", text: "Lukket · åbner " + when + " kl. " + fmt(n.tid[0]) };
      }
    }
    return null;
  }

  const st = statusNow();
  document.querySelectorAll("[data-status]").forEach(el => {
    if (!st) return;
    el.textContent = st.text;
    el.classList.add("status", st.cls);
    el.hidden = false;
  });
  document.querySelectorAll("[data-today]").forEach(el => { el.textContent = label(dayInfo(today).tid); });

  const list = document.getElementById("hours-days");
  if (!list) return;
  for (let i = 0; i < 7; i++) {
    const d = addDays(today, i);
    const info = dayInfo(d);
    const tid = info.tid, note = info.note || (later(info.tid) ? "Ofte senere" : "");
    const li = document.createElement("li");
    li.className = "day" + (i === 0 ? " today" : "");
    if (tid === "lukket") li.classList.add("is-closed");
    else if (!Array.isArray(tid)) li.classList.add("is-unknown");
    const wd = i === 0 ? "I dag" : i === 1 ? "I morgen" : wdFmt.format(d).replace(".", "");
    li.innerHTML = '<span class="wd"></span><span class="dt"></span><span class="tm"></span>' + (note ? '<span class="special"></span>' : "");
    li.querySelector(".wd").textContent = wd;
    li.querySelector(".dt").textContent = dtFmt.format(d).replace(".", "");
    li.querySelector(".tm").textContent = label(tid);
    if (note) li.querySelector(".special").textContent = note;
    if (i === 0) li.setAttribute("aria-current", "date");
    list.appendChild(li);
  }
})();
