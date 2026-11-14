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
import doodleImg from '../assets/eventcards/doodle-dreams.jpeg';
import magicMaskImg from '../assets/eventcards/magic-mask.jpeg';
import recycledImg from '../assets/eventcards/recycled-wonders.jpeg';
import flamencoImg from '../assets/eventcards/flamenco.jpeg';
import dharoharImg from '../assets/eventcards/dharohar.jpeg';
import gotTalentImg from '../assets/eventcards/got-talent.jpeg';
import abhinayImg from '../assets/eventcards/abhinay.jpeg';
import venustImg from '../assets/eventcards/venust.jpeg';
import stardustImg from '../assets/eventcards/stardust.jpeg';
import nazariyaImg from '../assets/eventcards/nazariya.jpeg';
import cinematicaImg from '../assets/eventcards/cinematica.jpeg';
import memeCentralImg from '../assets/eventcards/memecentral.jpeg';
import swarmayImg from '../assets/eventcards/swarmay.jpeg';

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
  'Doodle Dreams (Doodle Art)': { src: doodleImg, pos: '50% 50%' },
  'Magic Mask (Face Painting)': { src: magicMaskImg, pos: '30% 75%' },
  'Recycled Wonders (Waste Art)': { src: recycledImg, pos: '55% 95%' },
  'Flamenco (Dancing)': { src: flamencoImg, pos: '75% 100%' },
  'Dharohar (Folklore)': { src: dharoharImg, pos: '52% 50%' },
  'Got Talent': { src: gotTalentImg, pos: '50% 30%' },
  'Abhinay': { src: abhinayImg, pos: '65% 50%' },
  'Venust (Fashion Show)': { src: venustImg, pos: '50% 35%' },
  'Stardust (Bollywood Recreation)': { src: stardustImg, pos: '50% 20%' },
  'Nazariya (Photography)': { src: nazariyaImg, pos: '50% 40%' },
  'Cinematica (Film Making)': { src: cinematicaImg, pos: '38% 50%' },
  'MemeCentral (Meme Competition)': { src: memeCentralImg, pos: '50% 0%' },
  'Swarmay (Singing)': { src: swarmayImg, pos: '50% 25%' },
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
