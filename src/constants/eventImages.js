// Photos shown on the event cards (Events page).
// The key is the event name WITHOUT the emoji (case-insensitive), same as eventGuidelines.js.
// `pos` is the CSS object-position used when the photo is cropped to fit the card.
// Events with no entry here keep the plain gradient card.

import blsImg from '../assets/eventcards/basic-life-support.webp';
import sutureImg from '../assets/eventcards/suture.webp';
import preclinicalImg from '../assets/eventcards/preclinical-quiz.webp';
import paraclinicalImg from '../assets/eventcards/paraclinical-quiz.webp';
import clinicalImg from '../assets/eventcards/clinical-quiz.webp';
import caseImg from '../assets/eventcards/case-presentation.webp';
import agoraImg from '../assets/eventcards/agora.webp';
import hridayaImg from '../assets/eventcards/hridaya.webp';
import spellBeeImg from '../assets/eventcards/spell-bee.webp';
import generalQuizImg from '../assets/eventcards/general-quiz.webp';
import crypticImg from '../assets/eventcards/cryptic-crossword.webp';
import medimelodyImg from '../assets/eventcards/medimelody.webp';
import popCultureImg from '../assets/eventcards/pop-culture-quiz.webp';
import chitragangaImg from '../assets/eventcards/chitraganga.webp';
import aripanImg from '../assets/eventcards/aripan.webp';
import mehendiImg from '../assets/eventcards/mehendi-delights.webp';
import anatomicalImg from '../assets/eventcards/anatomical-body-painting.webp';
import cyberImg from '../assets/eventcards/cyber-creation.webp';
import sculptureImg from '../assets/eventcards/sculpture-spectacle.webp';
import tattooImg from '../assets/eventcards/tattoo-titans.webp';
import teeSplashImg from '../assets/eventcards/tee-splash.webp';
import doodleImg from '../assets/eventcards/doodle-dreams.webp';
import magicMaskImg from '../assets/eventcards/magic-mask.webp';
import recycledImg from '../assets/eventcards/recycled-wonders.webp';
import flamencoImg from '../assets/eventcards/flamenco.webp';
import dharoharImg from '../assets/eventcards/dharohar.webp';
import gotTalentImg from '../assets/eventcards/got-talent.webp';
import abhinayImg from '../assets/eventcards/abhinay.webp';
import venustImg from '../assets/eventcards/venust.webp';
import stardustImg from '../assets/eventcards/stardust.webp';
import nazariyaImg from '../assets/eventcards/nazariya.webp';
import cinematicaImg from '../assets/eventcards/cinematica.webp';
import memeCentralImg from '../assets/eventcards/memecentral.webp';
import swarmayImg from '../assets/eventcards/swarmay.webp';
import footballImg from '../assets/eventcards/football.webp';
import badmintonImg from '../assets/eventcards/badminton.webp';
import volleyballImg from '../assets/eventcards/volleyball.webp';
import kabaddiImg from '../assets/eventcards/kabaddi.webp';
import cricketImg from '../assets/eventcards/cricket.webp';
import bgmiImg from '../assets/eventcards/bgmi.webp';
import rubiksImg from '../assets/eventcards/rubiks-mania.webp';
import athleticsImg from '../assets/eventcards/athletics.webp';
import chessImg from '../assets/eventcards/chess.webp';
import carromImg from '../assets/eventcards/carrom.webp';
import tableTennisImg from '../assets/eventcards/table-tennis.webp';
import tugOfWarImg from '../assets/eventcards/tug-of-war.webp';
import khoKhoImg from '../assets/eventcards/kho-kho.webp';
import mixCricketImg from '../assets/eventcards/mix-cricket.webp';

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
  "Football": { src: footballImg, pos: '50% 100%' },
  "Badminton": { src: badmintonImg, pos: '50% 20%' },
  "Volleyball": { src: volleyballImg, pos: '40% 30%' },
  "Kabaddi": { src: kabaddiImg, pos: '55% 50%' },
  "Cricket": { src: cricketImg, pos: '50% 70%' },
  "BGMI": { src: bgmiImg, pos: '30% 50%' },
  "Rubik's Mania": { src: rubiksImg, pos: '45% 45%' },
  "Athletics": { src: athleticsImg, pos: '60% 50%' },
  "Chess": { src: chessImg, pos: '45% 30%' },
  "Carrom": { src: carromImg, pos: '50% 50%' },
  "Table Tennis": { src: tableTennisImg, pos: '50% 50%' },
  "Tug of War": { src: tugOfWarImg, pos: '50% 50%' },
  "Kho Kho": { src: khoKhoImg, pos: '70% 50%' },
  "Mix Cricket": { src: mixCricketImg, pos: '15% 50%' },
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
