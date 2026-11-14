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
import agoraImg from '../assets/eventcards/agora.jpeg';
import hridayaImg from '../assets/eventcards/hridaya.jpeg';
import spellBeeImg from '../assets/eventcards/spell-bee.jpeg';
import generalQuizImg from '../assets/eventcards/general-quiz.png';
import crypticImg from '../assets/eventcards/cryptic-crossword.jpeg';
import medimelodyImg from '../assets/eventcards/medimelody.jpeg';
import popCultureImg from '../assets/eventcards/pop-culture-quiz.png';
import chitragangaImg from '../assets/eventcards/chitraganga.jpeg';

export const EVENT_IMAGES = {
  'Basic Life Support Workshop': { src: blsImg, pos: '50% 60%' },
  'Suture Workshop': { src: sutureImg, pos: '50% 50%' },
  'Preclinical Quiz': { src: preclinicalImg, pos: '50% 50%' },
  'Paraclinical Quiz': { src: paraclinicalImg, pos: '50% 50%' },
  'Clinical Quiz': { src: clinicalImg, pos: '50% 50%' },
  'Case Presentation': { src: caseImg, pos: '30% 50%' },
  'Agora (Debate)': { src: agoraImg, pos: '50% 50%' },
  'Hridaya (Poetry, Shayari & Elocution)': { src: hridayaImg, pos: '52% 50%' },
  'Spell Bee': { src: spellBeeImg, pos: '50% 50%' },
  'General Quiz': { src: generalQuizImg, pos: '50% 50%' },
  'Cryptic Crossword': { src: crypticImg, pos: '50% 50%' },
  'Medimelody (Song se Syndrome)': { src: medimelodyImg, pos: '25% 50%' },
  'Pop-Culture Quiz': { src: popCultureImg, pos: '50% 50%' },
  'Chitraganga (Painting)': { src: chitragangaImg, pos: '30% 100%' },
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
