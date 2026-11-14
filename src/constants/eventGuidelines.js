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
        items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'],
      },
    ],
  },

  'Paraclinical Quiz': {
    blocks: [
      { type: 'h', text: 'Eligibility' },
      {
        type: 'ul',
        items: [
          'Students of 2021, 2022 and 2023 batches are eligible to participate.',
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
        items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'],
      },
    ],
  },

  'Agora (Debate)': {
    blocks: [
      { type: 'h', text: 'Eligibility' },
      {
        type: 'ul',
        items: [
          'Students of 2024 and 2025 batches are eligible to participate.',
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
        items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'],
      },
    ],
  },

  'Spell Bee': {
    blocks: [
      { type: 'h', text: 'Registration' },
      {
        type: 'ul',
        items: [
          'Participants must register through the website or the QR code available on the Instagram handle @hridaya_cerebrexia. Registration dates will be announced soon.',
          'Registration fee: \u20B950 per participant.',
        ],
      },
      { type: 'h', text: 'Pronunciation & Clarity' },
      {
        type: 'ul',
        items: ['Each participant must pronounce every letter of the given word clearly and audibly.'],
      },
      { type: 'h', text: 'Spelling Convention' },
      {
        type: 'ul',
        items: [
          'Only UK English spelling conventions will be accepted. Words spelt according to US English conventions will be considered incorrect.',
        ],
      },
      { type: 'h', text: 'Double Letters' },
      {
        type: 'ul',
        items: ['Consecutive identical letters in a word must be spelt separately and distinctly.'],
      },
      { type: 'h', text: 'Assistance from the Spell Master' },
      {
        type: 'ul',
        items: ['Participants may request the Spell Master to repeat the word if needed.'],
      },
      { type: 'h', text: 'Additional Enquiries' },
      {
        type: 'ul',
        items: [
          'Participants may ask about the word\u2019s meaning, language of origin, part of speech, alternative pronunciations, and usage in a sentence.',
        ],
      },
      { type: 'h', text: 'Time Limit' },
      {
        type: 'ul',
        items: [
          'After making all enquiries, participants will be given 30 seconds to spell the word.',
          'Once spelling has begun, no restarts or self-corrections will be allowed.',
        ],
      },
      { type: 'h', text: 'Competition Format' },
      { type: 'ul', items: ['The competition will comprise a single offline round.'] },
      { type: 'h', text: 'Decision Authority' },
      {
        type: 'ul',
        items: ['In case of any dispute or ambiguity, the decision of the judges shall be final.'],
      },
      { type: 'h', text: 'The Grand Finale' },
      {
        type: 'ul',
        items: [
          'The Grand Finale of SpellBee will be held at the IGIMS campus.',
          'Venue: To be announced',
          'Date: To be announced',
        ],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Winners will receive medals & certificates! Along with these:' },
      {
        type: 'ul',
        items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'],
      },
      {
        type: 'p',
        text: 'Follow us on Instagram at @igimsfest and @hridaya_cerebrexia to be eligible to participate.',
      },
      {
        type: 'tag',
        text: 'Don\u2019t miss the opportunity to become the SpellBee prodigy! Register now and get ready to shine!',
      },
    ],
  },

  'Clinical Quiz': {
    blocks: [
      { type: 'h', text: 'Rounds' },
      {
        type: 'ul',
        items: [
          'Screening round is online on 26th November.',
          'Final Round is offline at IGIMS, Patna on 9th December from 10:00 a.m.',
          'Total 5 teams will qualify for the finals.',
        ],
      },
      { type: 'h', text: 'Eligibility' },
      {
        type: 'ul',
        items: [
          'Students of 2021, 2022 and 2023 batches are eligible to participate.',
          'Follow @igimsfest and @medminds.hub on Instagram to be eligible to participate.',
          'Each team can have a maximum of 2 members (intra/inter batch).',
          'Lone wolves are also welcome.',
          'No limit on no. of teams from any college.',
        ],
      },
      { type: 'h', text: 'Registration Fee' },
      { type: 'p', text: '50 rupees only' },
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
      { type: 'h', text: 'For Further Queries, Contact' },
      { type: 'ul', items: ['Pranav: 74889 32917', 'Eshna: 75759 52453'] },
      { type: 'tag', text: 'Register Now. Rise to the Challenge.' },
    ],
  },

  'Hridaya (Poetry, Shayari & Elocution)': {
    blocks: [
      { type: 'p', text: 'Hridaya \u2014 Premchand: Kalam aur Kalpana. Official Guidelines & Rules.' },
      { type: 'h', text: 'Thematic Categories' },
      {
        type: 'p',
        text: 'Participants must choose ONE of the following five themes for their Written and Narration entries.',
      },
      {
        type: 'ol',
        items: [
          'Love, Companionship & Belonging',
          'Society, Identity & Empowerment',
          'Life, Dreams & Imagination',
          'Childhood & Nostalgia',
          'Culture, Heritage, Spirituality & Celebrations',
        ],
      },
      { type: 'h', text: 'Written Round \u2014 Online' },
      { type: 'p', text: 'Registration Fee: \u20B950' },
      {
        type: 'ul',
        items: [
          'Participants must submit one original written composition based on any ONE of the five prescribed themes.',
          'All genres of creative writing are welcome, including poetry, prose, short stories and other literary forms.',
          'Entries must be submitted in written format through the official registration QR code or website.',
          'The composition must be original. Plagiarism will result in disqualification.',
          'Winners will be announced on the official Instagram page: @hridaya_cerebrexia.',
          'There will be NO offline finale for the Written Round.',
        ],
      },
      { type: 'h', text: 'Narration Round \u2014 Online' },
      { type: 'p', text: 'Registration Fee: \u20B950' },
      {
        type: 'ul',
        items: [
          'Participants must present any ONE of the five prescribed themes through poetry, shayari and elocution.',
          'Entries must be submitted as a video through the official registration QR code or website.',
          'Performances may be in English or Hindi.',
          'The use of props is permitted.',
          'Individual performances only; group performances are not allowed.',
          'Content must be original wherever applicable. Plagiarism will lead to disqualification.',
          'Inappropriate content may result in disqualification at the discretion of the organizing team.',
          'Selected participants will qualify for the Offline Finale.',
          'The list of selected participants will be announced on @hridaya_cerebrexia.',
        ],
      },
      { type: 'h', text: 'Offline Finale \u2014 Narration Round Only' },
      {
        type: 'ul',
        items: [
          'The Offline Finale will be held at IGIMS Patna.',
          'Only participants selected through the Online Narration Round will be eligible.',
          'All five thematic categories will remain applicable.',
          'Participants must choose a different theme from the one used in their online narration entry.',
          'Participants must attend the finale in person and follow the instructions issued by the organizing team.',
          'The venue, date, reporting time and further instructions will be communicated to the selected participants.',
        ],
      },
      { type: 'h', text: 'Evaluation Criteria' },
      { type: 'p', text: 'For the online evaluation, the following weightage will apply:' },
      {
        type: 'ul',
        items: [
          'Likes and comments received on the entry post: 40%',
          'Assessment by the IGIMS Judges Panel: 60%',
          'Total: 100%',
        ],
      },
      {
        type: 'p',
        text: 'The judges\u2019 assessment may consider originality, creativity, content, presentation, delivery and fluency, as applicable to the category.',
      },
      { type: 'h', text: 'Registration & Eligibility' },
      {
        type: 'ul',
        items: [
          'Registration fee: \u20B950',
          'Participants must submit their entries through the official registration QR code or website.',
          'Participants must follow the official Cerebrexia Instagram account @igimsfest and the event page @hridaya_cerebrexia for updates and entry validation.',
          'Participants are responsible for submitting their entries in the prescribed format.',
          'Incomplete, plagiarized or inappropriate entries may be rejected.',
          'All participants must adhere to the rules and decisions of the JUDGES.',
        ],
      },
    ],
  },

  'Cryptic Crossword': {
    blocks: [
      { type: 'h', text: 'About the Competition' },
      {
        type: 'p',
        text: 'Cryptic crosswords test your logic, vocabulary, lateral thinking, and wordplay skills. Decode clever clues, discover hidden patterns, and solve puzzles through creative reasoning.',
      },
      {
        type: 'p',
        text: 'Whether you are a seasoned crossword enthusiast or a beginner, get ready to challenge your mind in an exciting battle of words and wit!',
      },
      { type: 'h', text: 'Eligibility' },
      {
        type: 'ul',
        items: [
          'The competition is open to all individuals, irrespective of age, profession, or educational background.',
          'Students of Classes X, XI, XII, college students, university students, and working professionals are eligible.',
          'Students below Class X are not eligible to participate.',
        ],
      },
      { type: 'h', text: 'Competition Format' },
      {
        type: 'ul',
        items: [
          'Round 1 \u2013 Preliminary Round: A written cryptic crossword challenge for all registered participants.',
          'Round 2 \u2013 Top 8: The eight highest-scoring participants qualify.',
          'Round 3 \u2013 Top 4: The eight qualifiers compete to determine the top four.',
          'Round 4 \u2013 Top 2: The four remaining participants compete to reach the final.',
          'Final Round \u2013 Winner: The two finalists compete for the title of Cryptic Crossword Champion of Cerebrexia 2026.',
        ],
      },
      { type: 'h', text: 'General Rules' },
      {
        type: 'ul',
        items: [
          'Participants must follow all instructions provided by the organisers.',
          'Mobile phones, internet access, reference materials, and external assistance are prohibited during the rounds unless expressly permitted.',
          'In case of a tie, a tie-breaker round or an appropriate scoring criterion may be used.',
          'Round-specific instructions will be announced before each round.',
          'The decision of the organising committee shall be final and binding.',
        ],
      },
      { type: 'tag', text: 'Think beyond the obvious. Decode the clues. Conquer the crossword.' },
    ],
  },

  'Medimelody (Song se Syndrome)': {
    blocks: [
      { type: 'h', text: 'Format' },
      {
        type: 'ul',
        items: [
          'The event will be conducted in two rounds. Both rounds will be offline.',
          'Participants should form a team of 2\u20134 members. Individual participation is not allowed.',
          'The duration given after every song to answer is 15\u201320 seconds.',
        ],
      },
      { type: 'h', text: 'Round 1 \u2014 Qualifying Round' },
      {
        type: 'ol',
        items: [
          '5 songs will be played (audio only).',
          'The first three teams who identify the disease will get a chance to answer.',
          'Songs will not be repeated.',
          'No negative marking. Correct answer: +4 points.',
        ],
      },
      { type: 'h', text: 'Round 2 \u2014 Finale' },
      {
        type: 'ol',
        items: [
          'Video of the song will be played along with lyrics.',
          'Single response will be accepted from a single team.',
          'One song will be played for a single team.',
          'Negative marking (\u22121) for every incorrect answer.',
        ],
      },
      { type: 'h', text: 'Eligibility' },
      { type: 'p', text: '2021, 2022, 2023, 2024 and 2025 batches.' },
      { type: 'h', text: 'Registration' },
      {
        type: 'ul',
        items: ['Scan the QR on our Instagram handle.', 'Registration fee: 50 rupees per team.'],
      },
      { type: 'h', text: 'Prizes' },
      {
        type: 'ul',
        items: [
          'Winner: One Basic Registration (BR)',
          'Runner-up: 50% off on Basic Registration (BR)',
          'Top 3 winners: medal, certificates and exciting cash prizes to all three.',
        ],
      },
      { type: 'h', text: 'For Any Queries, Contact' },
      { type: 'ul', items: ['Rishi Kumar: 9031137805', 'Anjali Kumari: 9279423552'] },
    ],
  },

  'General Quiz': {
    blocks: [
      { type: 'h', text: 'Rounds' },
      { type: 'p', text: 'The event will be conducted in two rounds:' },
      { type: 'ul', items: ['Screening Round', 'Final Round'] },
      { type: 'h', text: 'Genre' },
      {
        type: 'ul',
        items: ['Current Affairs', 'Sports', 'New Researches', 'Politics', 'General Knowledge'],
      },
      { type: 'h', text: 'Team Formation' },
      {
        type: 'p',
        text: 'A team can have 3 members or 2 members. Lone wolves are also welcome.',
      },
      { type: 'h', text: 'On-the-Spot Entries' },
      { type: 'p', text: 'On-the-spot entries will be accepted.' },
      { type: 'h', text: 'Entry Fee' },
      { type: 'p', text: '\u20B925 per entry' },
      { type: 'h', text: 'Rules for Qualifying Round' },
      {
        type: 'ul',
        items: [
          'The qualifying round contains 21 questions of 5 marks each.',
          '+5 marks will be awarded for each correct answer.',
          '+0 marks will be awarded for an incorrect answer.',
          'You have the option to leave one question and attempt any 20.',
          'A few questions have hidden star marks. In case of similar marks obtained by teams, solving more star-marked questions will give a team the edge.',
        ],
      },
      { type: 'h', text: 'Rules for Final Round' },
      {
        type: 'ul',
        items: [
          'The final round has 10 questions.',
          '+10 marks will be awarded for each correct answer.',
          'There will be no negative marking.',
          'Pouncing on questions will be entertained.',
        ],
      },
    ],
  },

  'Pop-Culture Quiz': {
    blocks: [
      {
        type: 'p',
        text: 'Make sure to catch up to the latest developments in the Game of Thrones and Harry Potter Universes.',
      },
      { type: 'h', text: 'Eligibility' },
      {
        type: 'ul',
        items: [
          'Must be a college student. Do carry your college ID in case you are asked to show it on premises.',
        ],
      },
      { type: 'h', text: 'Teams' },
      {
        type: 'ul',
        items: [
          'A team with a maximum of 3 members is allowed.',
          'Teams with fewer members and lone wolves are also welcome.',
        ],
      },
      { type: 'h', text: 'Registration Fee' },
      {
        type: 'p',
        text: 'Each member has to register individually, paying a minimal fee of Rs. 50 per person (maximum of Rs. 150 per team).',
      },
      { type: 'h', text: 'Rounds' },
      { type: 'p', text: 'The quiz will consist of two rounds:' },
      {
        type: 'ul',
        items: [
          'Preliminary Round: This is a written round in which the teams will be screened and evaluated. Only the top teams will proceed to the next round.',
          'Stage/Final Round: Further sub-rounds will be held during this round.',
        ],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Prize winners will be awarded with medals + certificates along with these:' },
      {
        type: 'ul',
        items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'],
      },
      {
        type: 'p',
        text: 'Follow us on Instagram @igimsfest, @hridaya_cerebrexia and @kalakriti_igins to become eligible for participation.',
      },
      { type: 'tag', text: 'Don\u2019t miss this opportunity to showcase your Pop Knowledge.' },
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

  'Flamenco (Dancing)': {
    blocks: [
      { type: 'h', text: 'Rounds' },
      { type: 'p', text: 'Flamenco will take place in 2 stages:' },
      {
        type: 'ul',
        items: [
          'Stage 1 \u2013 Online Qualifying Round: Submit a dance video within the registration period. Videos will be posted on our Instagram page. Participants are encouraged to explore diverse dance forms, including Indian Classical, Contemporary, Freestyle, Hip-Hop, and more.',
          'Stage 2 \u2013 Offline Finale: Selected participants will perform live at the IGIMS Auditorium. Winners will be selected by the panel of judges.',
        ],
      },
      { type: 'h', text: 'How to Participate' },
      {
        type: 'ul',
        items: [
          'Register via the Google Form linked on Instagram: @flamenco_cerebrexia_26.',
          'Upload your dance video (minimum duration: 45 seconds, maximum duration: 2 minutes) along with the following compulsory details: Name, College, Batch, Instagram ID, Email ID. The video will be posted on our Instagram page.',
          'Follow us on Instagram: @flamenco_cerebrexia_26, @igimsfest, and @kalakriti_igims.',
          'Complete your registration on time. Late entries won\u2019t be accepted.',
        ],
      },
      { type: 'h', text: 'Entry Fee' },
      { type: 'ul', items: ['Solo: \u20b950', 'Group: \u20b9100'] },
      { type: 'h', text: 'Judging Criteria' },
      { type: 'p', text: 'Online Qualifying Round:' },
      { type: 'ul', items: ['Judges\u2019 Scores (50% weightage)', 'Instagram Likes (50% weightage)'] },
      { type: 'p', text: 'Offline Finale:' },
      {
        type: 'ul',
        items: [
          'Performances will be evaluated by the panel of judges.',
          'Winners will be selected based on the judges\u2019 final scores.',
        ],
      },
      { type: 'h', text: 'Important Restrictions' },
      {
        type: 'ul',
        items: [
          'Online video submissions must be between 45 seconds and 2 minutes.',
          'Final offline performances must not exceed 5 minutes.',
          'Duo performances must register under the Group Dance category.',
          'All performances must be respectful, appropriate, and free from derogatory content.',
        ],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Medals, certificates, and amazing cash prizes for:' },
      { type: 'ul', items: ['Solo: Top 3 performances', 'Group: 1 best performance'] },
      { type: 'p', text: 'Along with these:' },
      { type: 'ul', items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'] },
      { type: 'h', text: 'Important Dates' },
      {
        type: 'ul',
        items: [
          'Online Round / Registrations: Open till 10 December',
          'Finale: 16 December at IGIMS Auditorium',
        ],
      },
      { type: 'h', text: 'Contact Us' },
      {
        type: 'ul',
        items: [
          'Shubhangi \u2013 +91 87892 17498',
          'Nivedita \u2013 +91 76673 21330',
          'Ananya \u2013 +91 79090 36608',
          'Instagram: @flamenco_cerebrexia_26 | @igimsfest | @kalakriti_igims',
        ],
      },
    ],
  },

  'Swarmay (Singing)': {
    blocks: [
      { type: 'h', text: 'Rounds' },
      { type: 'p', text: 'Swarmay will happen in 2 rounds:' },
      {
        type: 'ul',
        items: [
          'Round 1 \u2013 Online Qualifying Round: Showcase your talent by submitting a video clip in any of the following genres: Bollywood, Hindustani Classical, Qawwali, Ghazal, Bhajan.',
          'Round 2 \u2013 Finale: The top 15 contestants will perform live at the auditorium, IGIMS Patna on 17 December.',
        ],
      },
      { type: 'h', text: 'How to Participate' },
      {
        type: 'ol',
        items: [
          'Register through the Google Form available on our Instagram page (@swarmay_cerebrexia).',
          'Upload your video clip (maximum duration: 1 minute 30 seconds) along with the following compulsory details: Name, College, Batch, Instagram ID, Email ID. The video will be posted on our Swarmay Instagram handle.',
          'Follow us on Instagram: @swarmay_cerebrexia, @igimsfest and @kalakriti_igims to become eligible to participate.',
          'Complete registration till 10th December. Late entries won\u2019t be accepted.',
        ],
      },
      { type: 'h', text: 'Entry Fee' },
      { type: 'p', text: '25 rupees only' },
      { type: 'h', text: 'Judging Criteria (Online Round Only)' },
      {
        type: 'ul',
        items: [
          'Vocal Quality, Intonation and Rhythm (60% weightage)',
          'Likes on Instagram (40% weightage)',
        ],
      },
      { type: 'h', text: 'Important Restrictions' },
      {
        type: 'ul',
        items: [
          'Video duration should not exceed 1 minute and 30 seconds.',
          'Karaoke and instruments are allowed, but voice modulators are strictly prohibited (points will be deducted if a voice modulator is used).',
          'This competition accepts solo entries only. Group and duet entries are not allowed.',
        ],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Medals, certificates and amazing cash prizes for all three winners! Along with these:' },
      { type: 'ul', items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'] },
      { type: 'h', text: 'Important Dates' },
      { type: 'ul', items: ['Online Entries Open Till: 10 December', 'Final Round: 17 December'] },
      { type: 'h', text: 'Contact Us' },
      {
        type: 'ul',
        items: [
          'Sakshi \u2013 7004845218',
          'Gyanvi \u2013 6204471219',
          'Pranjal \u2013 9229881442',
          'Instagram: @swarmay_cerebrexia | @kalakriti_igims',
        ],
      },
      {
        type: 'tag',
        text: 'Don\u2019t miss this opportunity to showcase your singing talent! Register now and get ready to shine.',
      },
    ],
  },

  'Dharohar (Folklore)': {
    blocks: [
      { type: 'p', text: 'Indian Folklore Competition \u2013 Where traditions come alive through tales and tunes!' },
      { type: 'h', text: 'Important Dates' },
      { type: 'ul', items: ['Online Round: Open till 8 December', 'Finale: 14 December'] },
      { type: 'h', text: 'How to Participate' },
      {
        type: 'ol',
        items: [
          'Registration link in bio. Follow our Instagram page for updates (@dharohar_cerebrexia).',
          'Upload your video clip representing Indian culture and its diversity with compulsory details: Name, College, Batch, Instagram ID, and Email ID.',
          'The video will be posted on our Dharohar Instagram handle.',
          'Follow us on Instagram: @dharohar_cerebrexia, @igimsfest and @kalakriti_igims to become eligible to participate.',
          'Last date of registration is 8 December. Late entries won\u2019t be accepted.',
        ],
      },
      { type: 'h', text: 'Rounds' },
      { type: 'p', text: 'Dharohar will happen in 2 stages:' },
      {
        type: 'ul',
        items: [
          'Stage 1 \u2013 Online Qualifying Round: Showcase your talent by submitting a video clip.',
          'Stage 2 \u2013 Finale: The top 10 contestants will perform at the auditorium, IGIMS Patna on 14 December 2026.',
        ],
      },
      { type: 'h', text: 'Judging Criteria for Stage 1' },
      {
        type: 'ul',
        items: [
          'Creativity, Authenticity, Costume, and Attire (60% weightage)',
          'Likes on Instagram (40% weightage)',
        ],
      },
      { type: 'h', text: 'Entry Fee' },
      { type: 'ul', items: ['Solo entry: 50 rupees', 'Group entry: 100 rupees'] },
      { type: 'h', text: 'Important Restrictions' },
      {
        type: 'ul',
        items: [
          'Video should not exceed 4 minutes.',
          'Contestants can use proper costumes, props, folk dance, folk songs, or regional language voiceovers to showcase Indian culture and traditions.',
          'Ensure performances are respectful and appropriate, celebrating cultural traditions. No derogatory content defaming any culture will be entertained.',
          'Individual or group participation is allowed.',
        ],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Medals, certificates and amazing cash prizes for all three winners! Along with these:' },
      { type: 'ul', items: ['1st Place: One Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'] },
      { type: 'h', text: 'Contact' },
      {
        type: 'ul',
        items: [
          'Prateek \u2013 8540949798',
          'Divyanshu \u2013 7903278757',
          'Vaibhavi \u2013 8368926351',
          'Aditya \u2013 91023 31766',
        ],
      },
      {
        type: 'tag',
        text: 'Step into the soul of India \u2013 where folklore weaves magic through time. Don\u2019t miss the chance to be the voice of heritage \u2013 register now!',
      },
    ],
  },

  'Venust (Fashion Show)': {
    blocks: [
      { type: 'h', text: 'About the Competition' },
      {
        type: 'p',
        text: 'Venust is an intercollegiate fashion and runway competition that celebrates creativity, individuality, confidence and the art of self-expression through fashion. It invites participants to step into the spotlight, bring their imagination to life and showcase their unique interpretations of fashion across five distinctive themes.',
      },
      {
        type: 'p',
        text: 'From the glamour of royalty to the mysteries of the apocalypse, let your style make a statement and your runway presence leave a lasting impression!',
      },
      { type: 'h', text: '1. Themes' },
      {
        type: 'ul',
        items: [
          'Cosplay: Bring fictional characters, superheroes, anime personalities or iconic movie characters to life through creative costumes and styling.',
          'Apocalypse: Explore a post-apocalyptic world through unconventional outfits, distressed styling and imaginative survival-inspired looks.',
          'Marine: Take inspiration from the ocean, marine life and underwater worlds through aquatic colours, textures and creative interpretations.',
          'Light & Dark: Showcase the contrast between opposing elements through contrasting colours, aesthetics, moods and styling.',
          'Royalty / Old Money: Embrace timeless elegance, sophistication and luxury through regal outfits, classic silhouettes and understated glamour.',
        ],
      },
      { type: 'h', text: '2. Eligibility & Participation' },
      {
        type: 'ul',
        items: [
          'Venust is an intercollegiate event, open to participants from different colleges.',
          'Participation can be either solo or in a team.',
          'Each team can consist of a maximum of 4 participants.',
          'Participants must choose and adhere to one of the five themes mentioned above.',
        ],
      },
      { type: 'h', text: '3. Event Guidelines' },
      {
        type: 'ul',
        items: [
          'The event will commence on 19th December 2026 at IGIMS, Patna.',
          'The last date for registration is 10th December 2026.',
          'Participants are required to arrange their own costumes, hair styling and makeup.',
          'All outfits, accessories and overall styling should be in accordance with the chosen theme.',
          'Participants are requested to maintain originality and creativity in their presentations.',
          'Participants must ensure proper coordination and preparation for their respective acts.',
        ],
      },
      { type: 'h', text: '4. Music & Background Requirements' },
      {
        type: 'ul',
        items: [
          'Participants must submit the music and background theme required for their respective acts at least 5 days before the event.',
          'The required files must be sent via WhatsApp to the designated contact numbers provided by the organising team.',
          'Failure to submit the music and background requirements within the stipulated deadline will result in disqualification of the participant/team.',
        ],
      },
      { type: 'h', text: '5. Registration & Entry Fee' },
      {
        type: 'ul',
        items: [
          'Solo participation: \u20b9100 per participant.',
          'Group participation: \u20b9200 per team.',
          'The registration fee is non-refundable.',
          'Participants can register by scanning the QR code or clicking the registration link available in the Instagram bio.',
        ],
      },
      { type: 'h', text: '6. Judging Criteria' },
      { type: 'p', text: 'Participants will be evaluated by a panel of judges based on the following criteria:' },
      {
        type: 'ul',
        items: [
          'Creativity: Uniqueness of design concepts, themes and creative use of materials and techniques.',
          'Theme Relevance: Adherence to the selected theme and how effectively the outfit reflects its concept.',
          'Impact & Aesthetic Appeal: Ability to capture the audience\u2019s attention through overall appearance and presentation.',
          'Overall Presentation: Coordination of styling, hair and makeup, ramp walk, confidence and poses.',
          'Technical Execution: Quality of costume construction, detailing and finishing.',
        ],
      },
      { type: 'h', text: '7. Prizes & Recognition' },
      {
        type: 'ul',
        items: [
          'Winners, 1st runners-up and 2nd runners-up will be rewarded with exciting cash prizes and gift hampers.',
          'The best team in every category will also receive special recognition and rewards.',
          'A celebrity showstopper will be announced soon through the official Instagram handle of the event.',
        ],
      },
      { type: 'h', text: '8. Important Dates & Contact Details' },
      {
        type: 'ul',
        items: [
          'Event Date: 19th December 2026',
          'Last Date of Registration: 10th December 2026',
          'Venue: IGIMS, Patna',
        ],
      },
      { type: 'p', text: 'For queries and assistance:' },
      {
        type: 'ul',
        items: [
          'Nancy: 8521080808',
          'Siddharth: 8340317749',
          'Apurv: 9572242831',
          'Mehal: 8409179970',
        ],
      },
      { type: 'p', text: 'Instagram: @igimsfest | @venust_cerebrexia' },
      {
        type: 'tag',
        text: 'UNLEASH YOUR INNER GLAM! The spotlight awaits, the runway is set, and the stage is yours! Register now and make your moment unforgettable!',
      },
    ],
  },

  'Got Talent': {
    blocks: [
      { type: 'h', text: 'Guidelines' },
      { type: 'p', text: 'This competition is for all who want to present their talents on a big stage.' },
      {
        type: 'p',
        text: 'This event will comprise all the cultural talents other than Singing and Dancing (as Cerebrexia is having separate events Swarmay and Flamenco for both respectively).',
      },
      {
        type: 'p',
        text: 'You can participate if you want to rap, do standup, show some magic tricks, play any instrument, or mimic someone. For any other talent you want to perform, contact our representative to confirm (given at the end).',
      },
      { type: 'h', text: 'Registration Fee' },
      { type: 'p', text: '\u20b925 per entry.' },
      { type: 'h', text: 'Rules' },
      {
        type: 'ol',
        items: [
          'This event will comprise of two rounds \u2013 an online round and the finale in IGIMS Auditorium.',
          '1st Round (Online): The participants will have to send a video clip of not more than 2 minutes to impress people and the judges. To qualify, the criteria are: 50% will be the weightage of likes on the post we will make on our Instagram page + 50% scores given by the judges.',
          '2nd Round (IGIMS Auditorium): The top performers will be selected to come and perform in our college on 15th of December 2026, and the judges\u2019 panel will select the winners. The final performance should not exceed 5 minutes.',
        ],
      },
      { type: 'h', text: 'How to Participate' },
      {
        type: 'ol',
        items: [
          'Register through the Google Form on our Instagram page (@got_talent_cerebrexia).',
          'Upload your video clip (maximum duration: 2 minutes) with compulsory details: Name, College, Batch, Insta ID, and Email ID.',
          'Follow us on Instagram: @igimsfest, @got_talent_cerebrexia, and @kalakriti_igims to become eligible to participate.',
          'Complete registration until 10th of December 2026. Late entries won\u2019t be accepted.',
        ],
      },
      { type: 'h', text: 'Prizes' },
      { type: 'p', text: 'Medals, certificates, and amazing cash prizes for all three winners! Along with these:' },
      { type: 'ul', items: ['1st Place: One free Basic Registration (BR)', '2nd Place: 50% off on Basic Registration (BR)'] },
      { type: 'h', text: 'Contact' },
      {
        type: 'ul',
        items: ['Arunav \u2013 8603753244', 'Komal \u2013 9717890497', 'Amartyanjan \u2013 9897084556'],
      },
      {
        type: 'tag',
        text: 'Don\u2019t miss this opportunity to showcase your hidden talent! Register now and get ready to shine!',
      },
    ],
  },

  'Stardust (Bollywood Recreation)': {
    blocks: [
      { type: 'h', text: 'Introduction' },
      {
        type: 'p',
        text: 'Get ready to relive the magic of cinema with STARDUST, an exciting online Lights, Camera, Recreation event presented by Cerebrexia \u201926! This is your chance to recreate iconic moments from your favourite Bollywood or Hollywood movies and web series, showcase your creativity, and bring your favourite characters to life. Whether you\u2019re participating solo or with a group.',
      },
      { type: 'h', text: '1. Registration Guidelines' },
      {
        type: 'ul',
        items: [
          'Registration must be completed through the Google Form available on our Instagram page @stardust_cerebrexia.',
          'Participants must provide their Name, College Name, and Batch during registration.',
          'The entry fee is \u20b925 only.',
          'The last date for registration and submission is 15th December.',
        ],
      },
      { type: 'h', text: '2. Participation Rules' },
      {
        type: 'ul',
        items: [
          'Participants can recreate any scene from a Bollywood or Hollywood movie or web series.',
          'Participation is allowed both individually and in groups.',
          'There is no limit on the number of participants in a group.',
          'The event will be conducted online and will consist of a single round.',
        ],
      },
      { type: 'h', text: '3. Content & Submission Guidelines' },
      {
        type: 'ul',
        items: [
          'The original photograph of the selected movie or web series scene must be submitted along with the recreated entry.',
          'Editing is permitted, but participants should try to maintain the originality of the scene.',
          'Entries containing offensive or inappropriate content will be disqualified.',
          'Submitted entries may be uploaded to the official Instagram page @stardust_cerebrexia.',
        ],
      },
      { type: 'h', text: '4. Social Media Guidelines' },
      { type: 'p', text: 'Participants must like and follow all three Instagram pages: @igimsfest, @stardust_cerebrexia and @kalakriti_igims.' },
      { type: 'ul', items: ['Only reactions received on the original post will be considered.'] },
      { type: 'h', text: '5. Judging Criteria' },
      { type: 'p', text: 'Winners will be decided based on:' },
      {
        type: 'ul',
        items: [
          'Total reactions received on the original Instagram post.',
          'Evaluation by the judges\u2019 panel.',
        ],
      },
      { type: 'h', text: '6. Prizes & Recognition' },
      { type: 'p', text: 'The top three winners will receive:' },
      { type: 'ul', items: ['Medals', 'Certificates', 'Exciting cash prizes'] },
      { type: 'h', text: 'Contact Details' },
      { type: 'ul', items: ['Ankit Gupta: 9199716413', 'Mayank Singh: 8409069211'] },
    ],
  },

  // Guidelines supplied as "NAZARIYA" \u2013 shown on the Nazariya (Photography) card.
  'Nazariya (Photography)': {
    blocks: [
      { type: 'h', text: 'Nazariya' },
      {
        type: 'p',
        text: 'Nazariya is an online mobile photography competition that celebrates creativity, perspective and visual storytelling. It invites participants to discover the extraordinary in the ordinary and capture stories through their lenses across three unique themes: Shadow Play, Geometry and Invisible Emotions. Let your creativity speak through every frame!',
      },
      { type: 'h', text: '1. Themes' },
      {
        type: 'ul',
        items: [
          'Shadow Play: Explore the interplay of light and darkness through silhouettes, shadows, reflections and contrasts.',
          'Geometry: Discover the beauty of symmetry, patterns, lines, angles and shapes in architecture, nature and everyday surroundings.',
          'Invisible Emotions: Capture unspoken feelings such as nostalgia, solitude, joy, longing and hope through objects, gestures and surroundings.',
        ],
      },
      { type: 'h', text: '2. Submission Guidelines' },
      {
        type: 'ul',
        items: [
          'Each participant can submit a maximum of three photographs from any of the three themes (same or different photograph).',
          'All photographs must be original and captured using a smartphone/mobile phone.',
          'Each photograph must have a minimum file size of 1.5 MB.',
          'Participants must submit the following details along with their entries: Name, College and Batch, Instagram ID, Email ID, and Device name used for capturing the photograph.',
          'A screenshot of the image details must also be submitted to establish originality.',
          'Each photograph must be accompanied by a meaningful caption describing its concept, inspiration or the story behind the captured moment.',
        ],
      },
      { type: 'h', text: '3. Eligibility & Conduct' },
      {
        type: 'ul',
        items: [
          'Only original photographs for which the participant holds all applicable rights will be accepted.',
          'Plagiarism or submission of copied work will lead to immediate disqualification.',
          'Entries containing inappropriate content will be disqualified.',
          'Entries involving fake likes or reactions will also be disqualified.',
        ],
      },
      { type: 'h', text: '4. Instagram Requirements' },
      { type: 'p', text: 'Participants must follow the following Instagram pages: @igimsfest, @kalakriti_igims and @nazariya_cerebrexia. Participants must also react to the competition post.' },
      { type: 'h', text: '5. Entry Fee' },
      { type: 'ul', items: ['One photograph \u2013 \u20b925', 'Two photographs \u2013 \u20b950', 'Three photographs \u2013 \u20b970'] },
      { type: 'h', text: '6. Judging Criteria' },
      { type: 'p', text: 'The winners will be selected through a combination of public engagement and evaluation by a panel of judges.' },
      {
        type: 'ul',
        items: [
          '50% \u2013 Likes and reactions received on the photograph.',
          '50% \u2013 Creativity, concept, impact and style.',
        ],
      },
      { type: 'h', text: '7. Results & Updates' },
      {
        type: 'ul',
        items: [
          'Last Date of Submission is December 15.',
          'Updates and results will be announced on the official Instagram page, @nazariya_cerebrexia.',
        ],
      },
      { type: 'h', text: 'Contact' },
      { type: 'ul', items: ['Saumya: +91 7080836790', 'Saina: +91 8539028750'] },
      {
        type: 'tag',
        text: 'YOUR PERSPECTIVE. YOUR STORY. YOUR NAZARIYA. Look beyond the ordinary, explore your perspective and let your photographs tell stories that words cannot.',
      },
    ],
  },

  'Cinematica (Film Making)': {
    blocks: [
      { type: 'h', text: 'About the Competition' },
      {
        type: 'p',
        text: 'Cinematica is a short-film-making competition that celebrates creativity, imagination and the art of visual storytelling. It provides a platform for aspiring filmmakers to transform their ideas into compelling cinematic experiences, capturing stories through the lens and bringing them to life on screen.',
      },
      {
        type: 'p',
        text: 'Whether it\u2019s a story of love, mystery, emotions, humour or an untold reality, let your imagination take the lead and create a film that leaves a lasting impression. There is no mandatory theme \u2013 the creative possibilities are endless!',
      },
      { type: 'h', text: '1. Eligibility & Participation' },
      {
        type: 'ul',
        items: [
          'Cinematica is an intercollegiate competition, open to participants from different colleges.',
          'Participants must register through the official registration link or by scanning the QR code.',
          'The following details must be provided along with the registration form: Name, College Name, Batch.',
        ],
      },
      { type: 'h', text: '2. Film-Making Guidelines' },
      {
        type: 'ul',
        items: [
          'The short film must have a duration of 2\u20135 minutes.',
          'Videos can be shot using any smartphone or camera.',
          'Participants are free to explore any genre, concept or storyline. There is no mandatory theme for the competition.',
          'The video must contain audio.',
          'Participants are encouraged to experiment with creative filming techniques such as time-lapse, slow motion and reverse footage to enhance visual storytelling.',
          'Originality and creativity are highly encouraged.',
        ],
      },
      { type: 'h', text: '3. Submission Guidelines' },
      {
        type: 'ul',
        items: [
          'Only original videos created by the participants will be accepted.',
          'Use of generative AI, plagiarism or animations is strictly prohibited.',
          'Participants must ensure that their submissions comply with the specified duration and other technical requirements.',
          'The submitted film should be the participant\u2019s own creative work.',
        ],
      },
      { type: 'h', text: '4. Instagram Requirements' },
      { type: 'p', text: 'Participants must like and follow the following official Instagram pages: @igimsfest, @kalakriti_igims and @cinematica_cerebrexia.' },
      { type: 'p', text: 'Reactions received on the entries will be considered as part of the final evaluation.' },
      { type: 'h', text: '5. Registration & Entry Fee' },
      {
        type: 'ul',
        items: [
          'Registration Fee: \u20b925 per entry.',
          'Participants can register through the link provided in the Instagram bio or by scanning the QR code.',
          'All required participant details must be submitted through the registration form.',
        ],
      },
      { type: 'h', text: '6. Judging Criteria' },
      { type: 'p', text: 'The winners will be selected through a combination of public engagement and evaluation by a panel of judges.' },
      {
        type: 'ul',
        items: [
          '50% \u2013 Public Engagement: Likes and reactions received on the submitted film.',
          '50% \u2013 Judges\u2019 Evaluation: Creativity, originality, concept, impact and overall presentation.',
        ],
      },
      { type: 'h', text: '7. Results & Updates' },
      {
        type: 'ul',
        items: [
          'Updates and results for each round will be announced on the official Instagram page, @cinematica_cerebrexia.',
          'Participants are requested to follow the official pages for announcements and further updates.',
        ],
      },
      { type: 'h', text: '8. Prizes & Recognition' },
      {
        type: 'ul',
        items: [
          'Winner: Basic Registration (BR) for CEREBREXIA 2026.',
          'Top 3 Winners: Exciting cash prizes and digital certificates.',
        ],
      },
      { type: 'h', text: '9. Contact Details' },
      {
        type: 'ul',
        items: [
          'Himanshu: 95087 94348',
          'Mehal Sinha: 84091 79970',
          'Atul Kumar: 9608585907',
          'Email: therecerebrexia17@gmail.com',
          'Instagram: @cinematica_cerebrexia',
        ],
      },
      {
        type: 'tag',
        text: 'LIGHTS. CAMERA. ACTION! Every story deserves a screen, and every storyteller deserves an audience. THE SHORT FILM STARTS HERE. REGISTER NOW!',
      },
    ],
  },

  'MemeCentral (Meme Competition)': {
    blocks: [
      { type: 'h', text: 'About the Competition' },
      {
        type: 'p',
        text: 'MEMECENTRAL is an exciting online meme-making competition at CEREBREXIA \u201926, celebrating creativity, humour and originality. Participants get the opportunity to showcase their wit and creative perspective through memes across diverse genres.',
      },
      {
        type: 'p',
        text: 'From college life to Bollywood, dark humour to Gen Z trends, let your imagination take centre stage. Create, share and compete to win exciting prizes while making your mark in the digital world!',
      },
      { type: 'h', text: 'How to Register' },
      {
        type: 'ul',
        items: [
          'Register through the Google Form on our Instagram page @memecentral_cerebrexia.',
          'The following points must be provided along with the entry during the time of submission of the form: Name, College, Batch, A Caption (optional), Genres.',
          'One must like and follow the Instagram pages @igimsfest, @memecentral_cerebrexia and @kalakriti_igims for the number of reactions to be considered.',
          'The entries sent will be uploaded to the Instagram handle @memecentral_cerebrexia. So, there should be no copyright issue.',
        ],
      },
      { type: 'h', text: 'Genres' },
      {
        type: 'ol',
        items: ['College Life', 'Dark', 'Bollywood', 'Condition of Doctors in India', 'Gen Z'],
      },
      { type: 'h', text: 'Important Rules' },
      {
        type: 'ul',
        items: [
          'Participants can create reels from any of the mentioned genres.',
          'Multiple entries are accepted on a single registration. Registration fee is \u20b925.',
          'It is an online event that consists of a single round.',
          'Entries must be original. No plagiarism will be allowed. If found so, the registration will be auto-cancelled.',
          'No meme containing derogatory or offensive content will be allowed. No meme that promotes hate speech, violence, discrimination or misinformation will be accepted.',
          'Any format of PHOTOS/GIF/VIDEO memes is allowed.',
          'The memes sent will be uploaded on the Instagram account of CEREBREXIA/MEMECENTRAL.',
          'The memes can also be used for further displays.',
          'The winner will be decided based on the total number of reactions on the original post and the judges\u2019 panel.',
          'Memes getting fake likes and comments will be disqualified.',
        ],
      },
      { type: 'h', text: 'Prizes' },
      {
        type: 'ul',
        items: [
          'Basic Registration (BR) for the overall winner.',
          'Cash prize for the overall winner.',
          'Cash prizes for winners in each category.',
        ],
      },
      { type: 'h', text: 'For Further Queries, Contact' },
      { type: 'ul', items: ['Aryan Singh: 6207178813', 'Rishav Kumar: 72940 38655'] },
      { type: 'tag', text: 'Where Wit Meets Creativity, And Humour Takes Centre Stage.' },
    ],
  },

  "Chitraganga (Painting)": {
    blocks: [
      {
        "type": "h",
        "text": "Round 1 — Online"
      },
      {
        "type": "ol",
        "items": [
          "Submit a clear photograph of your original artwork online.",
          "The artwork must be your own creation.",
          "Participants must submit 2 progression pictures showing the development of their artwork.",
          "The medium can be pencil, watercolour, acrylic colour, soft pastels, oil pastels, or charcoal.",
          "Entries will be judged on clarity of theme, originality, artistic value, overall presentation, and likes."
        ]
      },
      {
        "type": "h",
        "text": "Round 2 — Offline"
      },
      {
        "type": "ul",
        "items": [
          "The final round will be conducted offline at IGIMS, Patna on 11 Dec 2026.",
          "A 12 × 16 inch canvas will be provided to each participant.",
          "Participants must bring their own colours and painting tools.",
          "The final artwork will be evaluated by a panel of judges."
        ]
      },
      {
        "type": "h",
        "text": "Entry Fee & Registration"
      },
      {
        "type": "ul",
        "items": [
          "Entry Fee: ₹50 per participant.",
          "Entry closing date for Round 1: 6 December 2026.",
          "Register by using the registration link.",
          "All submissions must be original. Plagiarised artwork will lead to disqualification."
        ]
      },
      {
        "type": "h",
        "text": "Themes — Round 1"
      },
      {
        "type": "ul",
        "items": [
          "Nature and wildlife",
          "Indian heritage",
          "Art of cinema",
          "Fantasy world",
          "Spirit of festivity"
        ]
      },
      {
        "type": "h",
        "text": "Themes — Round 2"
      },
      {
        "type": "ul",
        "items": [
          "Portrait",
          "Mythology",
          "Colours of emotion",
          "Women empowerment",
          "Cosmos and universe"
        ]
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner: Delegate pass for Cerebrexia 2026",
          "2nd & 3rd runner up: Medals + Certificates"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Ankita: 7209750579",
          "Vibha: 9771886160"
        ]
      },
      {
        "type": "tag",
        "text": "Think creatively, paint fearlessly, create endlessly!"
      }
    ],
  },

  "Doodle Dreams (Doodle Art)": {
    blocks: [
      {
        "type": "ol",
        "items": [
          "Participants will be provided with a sheet and markers.",
          "The doodle must be based on one of the given themes.",
          "Artwork must be the participant’s own original idea. Copying from any source is strictly prohibited.",
          "Participants must follow the event guidelines.",
          "Entry Fee: ₹25.",
          "The event will be conducted offline on 5 December 2026."
        ]
      },
      {
        "type": "h",
        "text": "Themes"
      },
      {
        "type": "ul",
        "items": [
          "Micro verse — the microscopic life",
          "Cerebros — the universe within",
          "Ward whispers — tales from the hospital",
          "Abstractomy — abstract science"
        ]
      },
      {
        "type": "h",
        "text": "Judging Criteria"
      },
      {
        "type": "ul",
        "items": [
          "Originality (participant’s own idea)",
          "Theme & message",
          "Perfection (technical skills)",
          "Visual appeal"
        ]
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner: Delegate pass",
          "2nd & 3rd runner up: Medals and certificates"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Amartyanjan: 9897084556"
        ]
      }
    ],
  },

  "Sculpture Spectacle (Clay Art)": {
    blocks: [
      {
        "type": "ol",
        "items": [
          "Registration fee: ₹25 per head.",
          "Participants will be provided with clay and toothpicks.",
          "Participate in teams of 2-4 members. No single participant is allowed.",
          "Participants are requested to bring their own colour and decor items.",
          "Judging is based on creativity & originality, neatness & finishing, design and aesthetic appeal, and skill used.",
          "Decision of the judges will be final.",
          "The event will be conducted offline on 5 December 2026."
        ]
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner Team: A delegate pass",
          "2nd & 3rd runner up: Medals and certificates"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Rajesh: 7479962105",
          "Prakriti: 9508428579"
        ]
      }
    ],
  },

  "Tattoo Titans (Tattoo Art)": {
    blocks: [
      {
        "type": "ol",
        "items": [
          "Participants will be provided with a black marker.",
          "Participants must bring their own volunteers/models.",
          "Tattooing is permitted on the arm, forearm, and face.",
          "Participants are not allowed to refer to designs on phones, tablets, magazines, or other reference sources during the event.",
          "Designs must reflect the chosen theme and demonstrate creativity.",
          "Participants must follow all event guidelines.",
          "Entry Fee: ₹25.",
          "The event will be conducted offline on 12 December 2026.",
          "The winner will receive a delegate pass; 2nd and 3rd runner up will receive medals and certificates."
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Nivedita: 7667321330"
        ]
      }
    ],
  },

  "Mehendi Delights (Mehendi)": {
    blocks: [
      {
        "type": "ul",
        "items": [
          "Participants will be provided with mehendi cones.",
          "Participants are expected to apply mehendi on both the front and back of the hand. The design should extend at least 6 inches beyond the palm.",
          "Participants are allowed to copy designs.",
          "Stickers, pens, and tattoos are not allowed.",
          "Judgement will be based on creativity, composition, and neatness.",
          "No on-spot registrations will be entertained.",
          "The event will be conducted offline on 12 December 2026."
        ]
      },
      {
        "type": "h",
        "text": "Entry Fee"
      },
      {
        "type": "p",
        "text": "₹25"
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner: A delegate pass",
          "2nd & 3rd runner up: Medal + Certificate"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Mehal: 8409179970"
        ]
      }
    ],
  },

  "Aripan (Rangoli)": {
    blocks: [
      {
        "type": "h",
        "text": "Offline Event"
      },
      {
        "type": "ul",
        "items": [
          "Event date: 6 December 2026 at IGIMS Patna.",
          "Entry Fee: ₹25 per participant.",
          "Registration: form available on Instagram @rangdhara_cerebrexia.",
          "Participate in teams of 2-4 members.",
          "Judging will be based on clarity, neatness, creativity, and overall attractiveness.",
          "Participants must complete their rangoli within the allotted time.",
          "Each team will be provided with a designated space for creating the rangoli.",
          "Basic colours will be provided. Participants can bring their own colours also."
        ]
      },
      {
        "type": "h",
        "text": "Offline — Contact"
      },
      {
        "type": "ul",
        "items": [
          "Shipra: 9279176905",
          "Rohit: 7633021784"
        ]
      },
      {
        "type": "h",
        "text": "Online Event"
      },
      {
        "type": "ul",
        "items": [
          "Registration closed on 6 December 2026.",
          "Entry Fee: ₹25 per participant.",
          "Registration: form available on Instagram @rangdhara_cerebrexia and @aripan_cerebrexia.",
          "Create clear, neat, attractive, and creative designs.",
          "Upload 2 photos as your entry: (I) photo of rangoli, (II) photo of participants with rangoli.",
          "Judging will be based on clarity, neatness, creativity, overall attractiveness, and likes.",
          "Top 3 winners will be decided on the basis of the judging panel and the number of likes on the Instagram post."
        ]
      },
      {
        "type": "h",
        "text": "Online — Contact"
      },
      {
        "type": "ul",
        "items": [
          "Aditya: 9102331766",
          "Roushani: 9110197055"
        ]
      },
      {
        "type": "h",
        "text": "Prizes (Both Events)"
      },
      {
        "type": "ul",
        "items": [
          "Winner: Delegate pass for Cerebrexia 2026",
          "2nd & 3rd runner up: Medals + Certificates"
        ]
      }
    ],
  },

  "Recycled Wonders (Waste Art)": {
    blocks: [
      {
        "type": "ol",
        "items": [
          "The event will be conducted offline on 7 December 2026.",
          "Registration fee: 25 rupees.",
          "Participants are supposed to bring their own art and craft items as they will not be provided at the venue.",
          "Judging criteria: proper use of waste material, creativity, cleanliness, detailing, and overall visual impact.",
          "Decision of the judges will be final."
        ]
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner: Delegate pass",
          "2nd & 3rd runner up: Medals and certificates"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Saumya: 7080836790"
        ]
      }
    ],
  },

  "Cyber-Creation (Digital Art)": {
    blocks: [
      {
        "type": "h",
        "text": "Event Details"
      },
      {
        "type": "ul",
        "items": [
          "Single round online inter-college competition.",
          "Registration closes on 6 December 2026.",
          "Entry Fee: 25 rupees.",
          "Register through the registration link on our Instagram page."
        ]
      },
      {
        "type": "h",
        "text": "Theme"
      },
      {
        "type": "p",
        "text": "Your imagination, no boundation.."
      },
      {
        "type": "h",
        "text": "Format"
      },
      {
        "type": "ol",
        "items": [
          "Submit artwork in JPEG/PDF format.",
          "Participants must send 3 progressive pictures of their artwork."
        ]
      },
      {
        "type": "h",
        "text": "Qualification Criteria"
      },
      {
        "type": "p",
        "text": "Art should be original. No AI-generated or specialized app content will be acceptable, and it leads to disqualification."
      },
      {
        "type": "h",
        "text": "Judging Criteria"
      },
      {
        "type": "p",
        "text": "Creativity, originality, theme relevance, visual appeal, technical execution, and likes."
      },
      {
        "type": "h",
        "text": "Final Decision"
      },
      {
        "type": "p",
        "text": "The judges’ decision will be final."
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "p",
        "text": "Exciting prizes for all 3 winners!"
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Aditya: 9102331766",
          "Shipra: 9279176905",
          "Jagatjyoti: 6003364648"
        ]
      }
    ],
  },

  "Tee-Splash (T-Shirt Painting)": {
    blocks: [
      {
        "type": "ul",
        "items": [
          "T-shirts and cup will be provided.",
          "Participants must bring other materials on their own, like brushes, markers, paints, pencils and any other required tools.",
          "No specific theme.",
          "A maximum of 2 participants are allowed per T-shirt.",
          "Entry Fee: Rs 50 per participant.",
          "The event will be conducted offline on 9 December 2026."
        ]
      },
      {
        "type": "h",
        "text": "Judging Criteria"
      },
      {
        "type": "ol",
        "items": [
          "Creativity",
          "Theme and concept",
          "Cleanliness and detailing",
          "Color handling",
          "Overall visual impact"
        ]
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner: A delegate pass",
          "2nd & 3rd runner up: Medals and certificates"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Shweta: 8409684445",
          "Rohit: 7633021784"
        ]
      }
    ],
  },

  "Magic Mask (Face Painting)": {
    blocks: [
      {
        "type": "ul",
        "items": [
          "Participation is open to registered college students.",
          "Participants must complete their artwork within the allotted time.",
          "Designs must be original, appropriate, and theme-based.",
          "Offensive content and unfair practices are strictly prohibited.",
          "Judging will be based on creativity, originality, technique, and presentation.",
          "The judges’ decision will be final.",
          "Entry Fee: ₹25.",
          "The event will be conducted offline at IGIMS Patna on 10 December 2026."
        ]
      },
      {
        "type": "h",
        "text": "Themes"
      },
      {
        "type": "ul",
        "items": [
          "Mythology",
          "Optical Illusion",
          "Wildlife",
          "Sci fiction"
        ]
      },
      {
        "type": "h",
        "text": "Prizes"
      },
      {
        "type": "ul",
        "items": [
          "Winner: A delegate pass",
          "2nd & 3rd runner up: Medals and certificates"
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Ankit: 7367820182"
        ]
      }
    ],
  },

  "Anatomical Body Painting": {
    blocks: [
      {
        "type": "ol",
        "items": [
          "The competition will be conducted in offline mode on 8 December 2026 at IGIMS Patna Campus.",
          "Participants must create anatomical body art inspired by human anatomy, physiology, or related medical themes.",
          "All designs must be appropriate, respectful, and relevant to the theme of the competition.",
          "Participants will be provided with a paint set, a brush and water.",
          "Judging will be based on creativity, anatomical accuracy, artistic technique, neatness, and overall presentation.",
          "Participants must follow the instructions provided by the event coordinators.",
          "Entry Fee: ₹25.",
          "The winner will receive a delegate pass; 2nd and 3rd runner up will receive a medal and certificate."
        ]
      },
      {
        "type": "h",
        "text": "For Queries, Contact"
      },
      {
        "type": "ul",
        "items": [
          "Aditya: 9102331766",
          "Shipra: 9279176905"
        ]
      }
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
