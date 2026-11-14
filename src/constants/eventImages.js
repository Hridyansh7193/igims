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
import aripanImg from '../assets/eventcards/aripan.jpeg';
import mehendiImg from '../assets/eventcards/mehendi-delights.jpeg';
import anatomicalImg from '../assets/eventcards/anatomical-body-painting.jpeg';
import cyberImg from '../assets/eventcards/cyber-creation.jpeg';
import sculptureImg from '../assets/eventcards/sculpture-spectacle.jpeg';
import tattooImg from '../assets/eventcards/tattoo-titans.jpeg';
import teeSplashImg from '../assets/eventcards/tee-splash.jpeg';

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
  'Aripan (Rangoli)': { src: aripanImg, pos: '50% 60%' },
  'Mehendi Delights (Mehendi)': { src: mehendiImg, pos: '60% 100%' },
  'Anatomical Body Painting': { src: anatomicalImg, pos: '60% 75%' },
  'Cyber-Creation (Digital Art)': { src: cyberImg, pos: '50% 40%' },
  'Sculpture Spectacle (Clay Art)': { src: sculptureImg, pos: '50% 0%' },
  'Tattoo Titans (Tattoo Art)': { src: tattooImg, pos: '50% 45%' },
  'Tee-Splash (T-Shirt Painting)': { src: teeSplashImg, pos: '65% 50%' },
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
