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
      { type: 'ul', items: ['1st Place: One Delegate pass', '2nd Place: 50% off on one Delegate pass'] },
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
      { type: 'ul', items: ['1st Place: One delegate pass', '2nd Place: 50% off on one delegate pass'] },
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
      { type: 'ul', items: ['1st Place: One delegate pass', '2nd Place: 50% off on one delegate pass'] },
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
      { type: 'ul', items: ['1st Place: One free Delegate Pass', '2nd Place: 50% off on one Delegate Pass'] },
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

  // Guidelines supplied as "NAZARIYA" \u2013 shown on the Lensanity (Photography) card.
  'Lensanity (Photography)': {
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
          'Winner: One Delegate Pass for CEREBREXIA 2025.',
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
          'A DELEGATE pass for the overall winner.',
          'Cash prize for the overall winner.',
          'Cash prizes for winners in each category.',
        ],
      },
      { type: 'h', text: 'For Further Queries, Contact' },
      { type: 'ul', items: ['Aryan Singh: 6207178813', 'Rishav Kumar: 72940 38655'] },
      { type: 'tag', text: 'Where Wit Meets Creativity, And Humour Takes Centre Stage.' },
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
