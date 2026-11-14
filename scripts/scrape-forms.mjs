// Usage (from project root): npm run scrape-forms   (Node 18+)
// Output: src/constants/eventForms.json (all forms) + scripts/failed.txt (forms that need login / couldn't be read)
import fs from "node:fs";

const EVENTS = [
  // [category, event name, form url]
  ["cultural", "VENUST (fashion show)", "https://forms.gle/JiBW19D3yW8wqUHZ7"],
  ["cultural", "DHAROHAR", "https://forms.gle/SWgszqdVub1HeGHH7"],
  ["cultural", "FLAMENCO (dance)", "https://forms.gle/y44U6TjpMrvMxrU29"],
  ["cultural", "SWARMAY (singing)", "https://forms.gle/BJ568VtQX7vPvPv9A"],
  ["cultural", "ABHINAY (theatre & drama)", "https://forms.gle/9UdA2PLgRxFVV37Z8"],
  ["cultural", "GOT TALENT", "https://forms.gle/Xp1tZaWVxu8c8QkT9"],
  ["cultural", "NAZARIYA (photography)", "https://forms.gle/dAuPutwSrc1wnA5Y8"],
  ["cultural", "STARDUST", "https://forms.gle/m1xDmDRxuikwt9jX9"],
  ["cultural", "MEMECENTRAL", "https://forms.gle/bVuqjP4ezwajPTkT8"],
  ["cultural", "CINEMATICA", "https://forms.gle/P55HjjxcUDeHA5JG7"],

  ["art", "HISTOPATHOLOGY", "https://forms.gle/LJTUrm7RRkgVMWrW9"],
  ["art", "SCULPTURE SPECTACLE (clay art)", "https://docs.google.com/forms/d/e/1FAIpQLSeTcQiyvBozBN4sKb2-IDL9Dj4gT6xXAnXfii7cp5mQLuZLwQ/viewform?usp=header"],
  ["art", "ARIPAN (Online)", "https://forms.gle/Tpwx4o8NSPVUyaw56"],
  ["art", "ARIPAN (Offline)", "https://docs.google.com/forms/d/e/1FAIpQLSeRn8lUWh9OGIB12XRn3IUqrn8EorB7tUr4H_vAPK9Dg3NVvA/viewform?usp=header"],
  ["art", "RECYCLED WONDERS (waste art)", "https://docs.google.com/forms/d/e/1FAIpQLSfoWOSMmo_wJzEvliVBj57OkZKIIxqxFxhzZNjnCv2lRatMzg/viewform?usp=header"],
  ["art", "ANATOMICAL BODY PAINTING", "https://docs.google.com/forms/d/e/1FAIpQLSeHjhZfAN0YzcaftwxMH_7is8oKuy1hX9ZNoa-CS5P_HUatcg/viewform?usp=header"],
  ["art", "TEE SPLASH", "https://docs.google.com/forms/d/e/1FAIpQLSc8dmJLU8o_rTJRof-UxE86oRORY8myVvJ8dOAmHdP3DBKa0g/viewform?usp=header"],
  ["art", "MAGIC MASK (face painting)", "https://docs.google.com/forms/d/e/1FAIpQLSfHQHjVnIBxqG6EqC_vFOS5MsZ-DL4RQIJibHcu1ar8vRPijg/viewform?usp=header"],
  ["art", "CHITRANGANGA (painting)", "https://docs.google.com/forms/d/e/1FAIpQLSd_K6tb6_8FFS0Zzl0JrMStH2BLrW0hJUh86Tm6DwT1jFgrGg/viewform?usp=header"],
  ["art", "TATTOO TITANS", "https://docs.google.com/forms/d/e/1FAIpQLSct3J-_Zt4OfwEIaKlLfSfL0xwOTBLbFHclzrAh9TaKQTghSA/viewform?usp=header"],
  ["art", "MEHENDI DELIGHTS", "https://docs.google.com/forms/d/e/1FAIpQLSeViJcEJd2i0JyOLdFJ19Of_4z8TE94jIf1Vt61Q424nlEYdA/viewform?usp=header"],
  ["art", "DOODLE DREAMS", "https://docs.google.com/forms/d/e/1FAIpQLSe2jHc23xeXhVQK8AJlhz0TjdIRP8BkCaTFXGxTdmrioKPkpw/viewform?usp=header"],
  ["art", "CYBER CREATION (digital art)", "https://docs.google.com/forms/d/e/1FAIpQLSfzVY5BYVHCVAkBlCrN_h0h_i9g2-fGtVfH3hiB0T2zC2I5vA/viewform?usp=header"],

  ["sports", "MEN'S CRICKET", "https://docs.google.com/forms/d/e/1FAIpQLSfQNHJAj13xGFl2RaF-vC5BixO44SOHo0wSpSuMsDSZe08jbQ/viewform?usp=header"],
  ["sports", "WOMEN'S CRICKET", "https://docs.google.com/forms/d/e/1FAIpQLSfc_rQtK1m4uTNj3yHESEmchT-HWBd3vKCwLfgUXVk_kKH-wQ/viewform?usp=header"],
  ["sports", "FOOTBALL", "https://docs.google.com/forms/d/e/1FAIpQLSfz_NEcuL9WVY6rNS89GEn7BVhtqiRvDQu-fFkeGBO23teqBA/viewform?usp=header"],
  ["sports", "BGMI", "https://docs.google.com/forms/d/e/1FAIpQLScepBnHwam3Yo9L387wyIZgia-O2SoYHcOzX9wOImzMd59qoA/viewform?usp=header"],
  ["sports", "VOLLEYBALL", "https://docs.google.com/forms/d/e/1FAIpQLScaws4v39vNZ322-6jWc4oPc-ZcSWk6aA3RYpe-6-2rjP8FqQ/viewform?usp=header"],
  ["sports", "CHESS", "https://docs.google.com/forms/d/e/1FAIpQLSenKRShAZYUB4uwQ7Rxm_6NY2Xp_5z5bsIAstnoX_yP_aBDBQ/viewform?usp=header"],
  ["sports", "CARROM", "https://docs.google.com/forms/d/e/1FAIpQLSdjrmF1Wy7eoziTq3Lm1ULUnAGusUEs4P3BewCsy6iBjkW85g/viewform?usp=header"],
  ["sports", "RUBIK'S CUBE", "https://docs.google.com/forms/d/e/1FAIpQLSc6BOerjm4R-0GQMRt9K67YL-G0TZXOjgh7kL1ai8ysSeg0DA/viewform?usp=header"],
  ["sports", "TABLE TENNIS", "https://docs.google.com/forms/d/e/1FAIpQLScWaC_UlItfpNNJAeAqaWusc6vsX_xon_Q-khVunIvLExS3KQ/viewform?usp=header"],
  ["sports", "BADMINTON", "https://docs.google.com/forms/d/e/1FAIpQLSejQ7fBSAYhNsRlRR5pyWeok6cO_yDGxPehkuW1CAHbhnsVBg/viewform?usp=header"],
  ["sports", "ATHLETICS", "https://docs.google.com/forms/d/e/1FAIpQLSdMs30B3p_wTc-2mzR1Lq7y5LZR70xJRDjuRQtocyIVZclrYw/viewform?usp=header"],
  ["sports", "MEN'S KABBADI", "https://docs.google.com/forms/d/e/1FAIpQLSeZKJaQ46DlaTVzWkfIfJpJjITZNXdfOSeNuIxVHOBo1fjpVw/viewform?usp=header"],
  ["sports", "WOMEN'S KABADDI", "https://docs.google.com/forms/d/e/1FAIpQLSf2kECq6m2NpF7wtrETzgm_SzWtb387NBNw7ogWlqLAvo14Cg/viewform?usp=header"],

  ["academic", "PRE CLINICAL QUIZ", "https://docs.google.com/forms/d/e/1FAIpQLScGkPPHNEPF8K3xlEkbRvs6bJeZfYMZQnq_PU0RA6T2arKmbw/viewform?usp=header"],
  // NOTE: on the Linktree, PARA CLINICAL QUIZ has the SAME link as PRE CLINICAL QUIZ (probably a mistake there)
  ["academic", "PARA CLINICAL QUIZ", "https://docs.google.com/forms/d/e/1FAIpQLScGkPPHNEPF8K3xlEkbRvs6bJeZfYMZQnq_PU0RA6T2arKmbw/viewform?usp=header"],
  ["academic", "CLINICAL QUIZ", "https://docs.google.com/forms/d/e/1FAIpQLSeNVdoWapS5pBA_8nh4TBY1bozGyRopC7g8lqZgjrokTgGCIQ/viewform?usp=header"],
  ["academic", "GENERAL QUIZ", "https://docs.google.com/forms/d/e/1FAIpQLScPs_BKlkwiZOV8TBJUvHseMYWX5eJt9ffUThjqJQsMWCvnSA/viewform?usp=header"],
  ["academic", "AGORA (DEBATE)", "https://docs.google.com/forms/d/e/1FAIpQLSekzDyXneP4RI4IbM_Nfs0YlyJbntlrwhWiqU2t0h8iAuv45g/viewform?usp=header"],
  ["academic", "HRIDAYA (PREMCHAND-KALAM AUR KALPANA)", "https://docs.google.com/forms/d/e/1FAIpQLSf2lIRG4jKTixxOxAILzfk1AbBkKRzo1GXcaSqcx4oAoWeI7g/viewform?usp=header"],
  ["academic", "CASE PRESENTATION", "https://docs.google.com/forms/d/e/1FAIpQLSdKE5Iikz97IPT_PpvDKeLs7kCSLhbNRXhmvfAZaL7vOcFd4A/viewform?usp=header"],
  ["academic", "SUTURE WORKSHOP", "https://docs.google.com/forms/d/e/1FAIpQLSf5F1ueA-LUJJz2HrxSUiCzQpRRwtU7_ennun1HuFj_GzNXAg/viewform?usp=header"],
  ["academic", "TRAUMA CODE (BLS & ACLS WORKSHOP)", "https://docs.google.com/forms/d/e/1FAIpQLSdAZSr7cJRcOJArQY0p6Zo_0sZzpH1RqkeSFYiy3YXqOLprgA/viewform?usp=header"],
  ["academic", "POPVERSE", "https://docs.google.com/forms/d/e/1FAIpQLScoP2Ukwcd0pds6C7CTR54cwVZlFGm4Y6RJ5M9oeZh-fbas0Q/viewform?usp=header"],
  ["academic", "SPELL BEE", "https://docs.google.com/forms/d/e/1FAIpQLSeCDuvpBUJjW_tx0F4f-gdl9A3Y7FuXEIKkF_UA_Unsz8QbeA/viewform?usp=header"],
  ["academic", "CRYPTIC CROSSWORD", "https://docs.google.com/forms/d/e/1FAIpQLSdnHROXpIAiG2uGN-KKAOH-d5tGjjBDWfdJAoE51tvCy5xDgg/viewform?usp=header"],
  ["academic", "MEDIMELODY-SONG SE SYNDROME", "https://docs.google.com/forms/d/e/1FAIpQLSfNhAKc1qKZ7cI0LHLjfVZaAbMck_p8iLIvt9c_4qaxijGxKQ/viewform?usp=header"],
];

const TYPES = {
  0: "short_text", 1: "paragraph", 2: "radio", 3: "dropdown", 4: "checkbox",
  5: "scale", 7: "grid", 9: "date", 10: "time", 13: "file_upload",
};

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseItem(item) {
  const typeId = item[3];
  const label = item[1] || "";
  const help = item[2] || "";

  if (typeId === 8) return { type: "section", label, help };
  if (typeId === 6) return { type: "info", label, help };

  const type = TYPES[typeId] || `unknown_${typeId}`;
  const subs = item[4] || [];
  const q = subs[0] || [];

  const field = {
    entry_id: q[0] ? `entry.${q[0]}` : null,
    label,
    help,
    type,
    required: q[2] === 1,
  };

  if (type === "grid") {
    field.rows = subs.map((r) => (r[3] && r[3][0]) || "");
    field.columns = (q[1] || []).map((o) => o[0]);
    field.entry_ids = subs.map((r) => `entry.${r[0]}`);
  } else if (["radio", "dropdown", "checkbox", "scale"].includes(type)) {
    field.options = (q[1] || []).map((o) => o[0]).filter((o) => o !== "" && o != null);
    field.allow_other = (q[1] || []).some((o) => o[4] === 1);
    if (type === "scale" && q[3]) field.scale_labels = q[3];
  }
  return field;
}

let debugSaved = false;

async function scrape(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  const html = await res.text();
  const host = new URL(res.url).hostname;
  const m = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*([\s\S]*?);\s*<\/script>/);
  if (!m) {
    if (!debugSaved) {
      fs.writeFileSync("scripts/debug.html", html);
      debugSaved = true;
    }
    const why = /accounts\.google\.com/.test(host)
      ? "form needs Google sign-in"
      : res.status !== 200
      ? "blocked / not found"
      : "page has no form data";
    throw new Error(`${why} (HTTP ${res.status}, ended at ${host})`);
  }
  const d = JSON.parse(m[1]);
  return {
    form_title: d[3] || (d[1] && d[1][8]) || "",
    description: (d[1] && d[1][0]) || "",
    final_url: res.url,
    fields: ((d[1] && d[1][1]) || []).map(parseItem),
  };
}

const out = {};
const failed = [];

const FILTER = (process.argv[2] || "").toLowerCase();

for (const [category, name, url] of EVENTS) {
  if (FILTER && !name.toLowerCase().includes(FILTER)) continue;
  try {
    const data = await scrape(url);
    out[slug(name)] = { category, name, source_url: url, ...data };
    console.log(`OK    ${name} (${data.fields.length} items)`);
  } catch (e) {
    failed.push(`${name}\t${url}\t${e.message}`);
    console.log(`FAIL  ${name}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 400));
}

if (Object.keys(out).length > 0) fs.writeFileSync("src/constants/eventForms.json", JSON.stringify(out, null, 2));
fs.writeFileSync("scripts/failed.txt", failed.join("\n"));
console.log(`\nDone: ${Object.keys(out).length} ok, ${failed.length} failed. See src/constants/eventForms.json / scripts/failed.txt`);
