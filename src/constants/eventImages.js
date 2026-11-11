// Photos shown on the event cards (Events page).
// The key is the event name WITHOUT the emoji (case-insensitive), same as eventGuidelines.js.
// `pos` is the CSS object-position used when the photo is cropped to fit the card.
// Events with no entry here keep the plain gradient card.

import blsImg from '../assets/eventcards/basic-life-support.jpeg';
import sutureImg from '../assets/eventcards/suture.jpeg';
import preclinicalImg from '../assets/eventcards/preclinical-quiz.png';
import paraclinicalImg from '../assets/eventcards/paraclinical-quiz.png';
import clinicalImg from '../assets/eventcards/clinical-quiz.png';
import caseImg from '../assets/eventcards/case-presentation.png';

export const EVENT_IMAGES = {
  'Basic Life Support Workshop': { src: blsImg, pos: 'center' },
  'Suture Workshop': { src: sutureImg, pos: 'center' },
  'Preclinical Quiz': { src: preclinicalImg, pos: 'center' },
  'Paraclinical Quiz': { src: paraclinicalImg, pos: 'center' },
  'Clinical Quiz': { src: clinicalImg, pos: 'center' },
  'Case Presentation': { src: caseImg, pos: '30% center' },
};

const normalize = (name = '') =>
  name
    .replace(/^[^A-Za-z0-9]+/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const LOOKUP = Object.fromEntries(
  Object.entries(EVENT_IMAGES).map(([k, v]) => [normalize(k), v])
);

export function getEventImage(eventName) {
  return LOOKUP[normalize(eventName)] || null;
}
