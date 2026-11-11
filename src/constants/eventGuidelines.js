// Event guidelines shown in the "Guidelines" popup on each event card.
//
// HOW TO EDIT / ADD:
//  - The key is the event name WITHOUT the emoji (matching is case-insensitive
//    and ignores the emoji and extra spaces), e.g. 'Preclinical Quiz'.
//  - `blocks` is rendered top to bottom. Block types:
//      { type: 'p',  text: '...' }                 -> paragraph
//      { type: 'h',  text: '...' }                 -> small section heading
//      { type: 'ul', items: ['...', '...'] }       -> bullet list
//      { type: 'ol', items: ['...', '...'] }       -> numbered list
//      { type: 'tag', text: '...' }                -> highlighted tagline
//  - Events with no entry here show a "will be announced soon" message.

export const EVENT_GUIDELINES = {
  'Suture Workshop': {
    blocks: [
      {
        type: 'p',
        text:
          'Suture Workshop, presented by CEREBREXIA \u201926 at IGIMS, Patna, is a hands-on clinical skills workshop designed to introduce participants to the fundamentals of suturing. The workshop aims to provide an opportunity to learn essential suturing techniques, practise under guidance, and develop precision, confidence, and practical skills crucial for surgical procedures.',
      },
      {
        type: 'tag',
        text: 'Learn, Practice, Perfect! Join us to take your first step towards mastering an essential surgical skill.',
      },
    ],
  },

  'Preclinical Quiz': {
    blocks: [
      { type: 'h', text: 'Eligibility' },
      {
        type: 'ul',
        items: [
          'Students of 2021, 2022, 2023 and 2024 batches are eligible to participate.',
          'Follow @igimsfest and @medminds.hub on Instagram to be eligible to participate.',
          'Each team can have a maximum of 2 members (intra/inter batch).',
          'Lone wolves are also welcome.',
          'No limit on no. of teams from any college.',
        ],
      },
      { type: 'h', text: 'Registration Fee' },
      { type: 'p', text: '50 rupees' },
      { type: 'h', text: 'Pattern of Questions' },
      {
        type: 'p',
        text: 'A variety of questions which will test your thinking, memory & understanding:',
      },
      {
        type: 'ul',
        items: ['MCQ', 'Connect Questions', 'Fill in the blanks', 'Image based', 'Match the following'],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Medals and certificates for all three winners! Along with these -' },
      {
        type: 'ul',
        items: ['1st Place: One delegate pass', '2nd Place: 50% off on one delegate pass'],
      },
    ],
  },

  // Guidelines supplied as "TRAUMA CODE (BLS)" – shown on the Basic Life Support Workshop card.
  'Basic Life Support Workshop': {
    blocks: [
      {
        type: 'p',
        text:
          'TRAUMA CODE is a flagship medical workshop under CEREBREXIA \u201926, organized at IGIMS Patna to enhance essential life-saving skills and emergency response capabilities among medical students. The workshop will focus on Advanced Cardiovascular Life Support (ACLS), bag-mask ventilation, Cardiopulmonary Resuscitation (CPR), and acute trauma management.',
      },
      {
        type: 'p',
        text:
          'Through practical learning and hands-on training, participants will gain valuable exposure to critical emergency care techniques, empowering them to respond confidently and effectively in life-threatening situations.',
      },
      { type: 'tag', text: 'TRAUMA CODE \u2014 Learn to Respond. Train to Save Lives.' },
    ],
  },

  'Case Presentation': {
    blocks: [
      {
        type: 'ol',
        items: [
          'Only MBBS students from recognized medical colleges are eligible.',
          'Abstract must be submitted within 500 words.',
          'Abstract must include case history, clinical findings, investigations, diagnosis, management, and outcome.',
          'Presentation must be in PowerPoint (PPT) format or PDF format.',
          'Presentation time limit: 5\u20137 minutes, followed by a Q&A session.',
          'Only original, genuine clinical cases are permitted.',
          'Patient confidentiality must be strictly maintained; identifying details must not be disclosed.',
          'Plagiarism or fabricated clinical data will lead to disqualification.',
          'Judging will be based on clinical knowledge, diagnostic approach, originality, presentation skills, and responses to questions.',
          'The judges\u2019 decision will be final.',
        ],
      },
    ],
  },
};

// Strip the leading emoji / symbols and normalise, so '📝 Preclinical Quiz'
// and 'Preclinical Quiz' both match.
const normalize = (name = '') =>
  name
    .replace(/^[^A-Za-z0-9]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const LOOKUP = Object.fromEntries(
  Object.entries(EVENT_GUIDELINES).map(([k, v]) => [normalize(k), v])
);

export function getEventGuidelines(eventName) {
  return LOOKUP[normalize(eventName)] || null;
}
