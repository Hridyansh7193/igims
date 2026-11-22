// Single source of truth for event registration fees (INR).
// Used by the server (api/create-event-order.js) to compute the payable amount,
// and by the UI (src/components/common/EventFormModal.jsx) to display it.
// Fees were taken from the old Google Forms - please verify before going live.
//
// modes:
//   flat        -> fixed amount
//   per_head    -> amount x number of participants      (selection.qty)
//   solo_group  -> solo / group amount                  (selection.type)
//   per_choice  -> amount x number of games chosen      (selection.qty)
//   badminton   -> persons x (first game + extra x (games-1))
//   photos      -> price by number of photographs       (selection.qty)

const flat = (amount) => ({ mode: 'flat', amount });
const perHead = (amount) => ({ mode: 'per_head', amount, max: 12 });
const soloGroup = (solo, group) => ({ mode: 'solo_group', solo, group });

export const EVENT_FEES = {
  // Academic
  'pre-clinical-quiz': flat(50),
  'para-clinical-quiz': flat(50),
  'clinical-quiz': flat(50),
  'case-presentation': flat(50),
  'suture-workshop': flat(200),
  'trauma-code-bls-acls-workshop': flat(200),

  // Literary
  'agora-debate': flat(50),
  'hridaya-premchand-kalam-aur-kalpana': flat(50),
  'spell-bee': flat(50),
  'cryptic-crossword': flat(50),
  'medimelody-song-se-syndrome': flat(50),
  'popverse': flat(50),
  'general-quiz': flat(50),

  // Sports
  'men-s-cricket': flat(4500),
  'women-s-cricket': flat(1200),
  'football': flat(3750),
  'volleyball': flat(1500),
  'badminton': { mode: 'badminton', first: 200, extra: 100, maxPersons: 6, maxGames: 3 },
  'men-s-kabbadi': flat(1000),
  'women-s-kabaddi': flat(750),
  'chess': flat(100),
  'table-tennis': perHead(150),
  'carrom': perHead(50),
  'athletics': { mode: 'per_choice', amount: 100, max: 10 },
  'rubik-s-cube': flat(50),
  'bgmi': flat(200),

  // Cultural
  'swarmay-singing': flat(25),
  'flamenco-dance': soloGroup(50, 100),
  'cinematica': soloGroup(50, 100),
  'abhinay-theatre-drama': soloGroup(50, 100),
  'nazariya-photography': { mode: 'photos', prices: { 1: 25, 2: 50, 3: 70 } },
  'got-talent': flat(25),
  'memecentral': flat(25),
  'stardust': perHead(25),
  'dharohar': soloGroup(50, 100),
  'venust-fashion-show': soloGroup(100, 200),
  'histopathology': perHead(25),

  // Art
  'chitranganga-painting': flat(50),
  'doodle-dreams': flat(25),
  'sculpture-spectacle-clay-art': flat(25),
  'tattoo-titans': flat(25),
  'mehendi-delights': flat(25),
  'aripan-online': perHead(25),
  'aripan-offline': perHead(25),
  'recycled-wonders-waste-art': flat(25),
  'cyber-creation-digital-art': flat(25),
  'tee-splash': perHead(50),
  'magic-mask-face-painting': flat(25),
  'anatomical-body-painting': flat(25),
};

export const getFeeConfig = (slug) => EVENT_FEES[slug] || null;

const int = (v, min, max) => {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
};

/**
 * Computes the payable amount. Returns { amount, label } or { error }.
 * selection = { qty?, type?, games? }
 */
export function computeFee(slug, selection = {}) {
  const cfg = getFeeConfig(slug);
  if (!cfg) return { error: 'No fee configured for this event.' };

  switch (cfg.mode) {
    case 'flat':
      return { amount: cfg.amount, label: `Registration fee` };

    case 'per_head': {
      const qty = int(selection.qty, 1, cfg.max);
      if (qty == null) return { error: `Participants must be between 1 and ${cfg.max}.` };
      return { amount: qty * cfg.amount, label: `${qty} x \u20B9${cfg.amount}` };
    }

    case 'solo_group': {
      const type = selection.type;
      if (type !== 'solo' && type !== 'group') return { error: 'Choose solo or group.' };
      return { amount: cfg[type], label: type === 'solo' ? 'Solo entry' : 'Group entry' };
    }

    case 'per_choice': {
      const qty = int(selection.qty, 1, cfg.max);
      if (qty == null) return { error: `Number of games must be between 1 and ${cfg.max}.` };
      return { amount: qty * cfg.amount, label: `${qty} game(s) x \u20B9${cfg.amount}` };
    }

    case 'badminton': {
      const persons = int(selection.qty, 1, cfg.maxPersons);
      const games = int(selection.games, 1, cfg.maxGames);
      if (persons == null || games == null) return { error: 'Choose number of players and games.' };
      const each = cfg.first + cfg.extra * (games - 1);
      return { amount: persons * each, label: `${persons} player(s) x \u20B9${each}` };
    }

    case 'photos': {
      const qty = int(selection.qty, 1, 3);
      if (qty == null) return { error: 'Choose 1, 2 or 3 photographs.' };
      return { amount: cfg.prices[qty], label: `${qty} photograph(s)` };
    }

    default:
      return { error: 'Unsupported fee mode.' };
  }
}
