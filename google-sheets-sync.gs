/**
 * =========================================================================
 * CEREBREXIA '26 - GOOGLE SHEETS LIVE SYNC ENGINE (IGIMS PATNA)
 * =========================================================================
 * 
 * Automatically synchronizes Supabase data into 4 dedicated Google Sheets:
 * 1. Cerebrexia '26 - All Participants
 * 2. Cerebrexia '26 - Basic Registrations (BR)
 * 3. Cerebrexia '26 - Sports Registrations (Separate tab for each sport)
 * 4. Cerebrexia '26 - Cultural Registrations (Separate tab for each cultural event)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and click "New project".
 * 2. Paste this entire code into `Code.gs`.
 * 3. (Optional) Run the function `SETUP_FOUR_SPREADSHEETS()` once:
 *    - It will automatically create all 4 Google Sheets in your Google Drive,
 *      format the header rows with Cerebrexia styling (Dark & Gold),
 *      and pre-create all sport and cultural event tabs!
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 *    - Description: "Cerebrexia '26 Live Sync Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (crucial for receiving webhooks from Vercel/website)
 * 6. Click "Deploy" and copy the Web App URL.
 * 7. Paste that Web App URL into your Cerebrexia Admin Portal under "Google Sheets Sync".
 * =========================================================================
 */

// Global Spreadsheet IDs (If left empty, SETUP_FOUR_SPREADSHEETS() will create them automatically and store their IDs in Script Properties)
var SCRIPT_PROPS = PropertiesService.getScriptProperties();

// Pre-defined Sports & Cultural Events for automatic tab generation
var SPORTS_EVENTS = [
  "Cricket", "Football", "Volleyball", "Badminton", "Kabaddi", 
  "Tug of War", "Chess", "Table Tennis", "Carrom", "Athletics", 
  "Rubik's Mania", "Mix Cricket", "BGMI", "Kho Kho"
];

var CULTURAL_EVENTS = [
  "Swarmay (Singing)", "Flamenco (Dancing)", "Cinematica (Film)", "Abhinay (Drama)",
  "Nazariya (Photo)", "Got Talent", "MemeCentral", "Stardust", "Dharohar",
  "Venust (Fashion)", "Chitraganga (Painting)", "Doodle Dreams", "Sculpture Spectacle",
  "Tattoo Titans", "Aripan", "Recycled Wonders", "Tee Splash", "Anatomical Body Painting",
  "Magic Mask", "Mehendi Delights", "Cyber Creation", "Agora (Debate)",
  "Hridaya (Poetry)", "Spell Bee", "Cryptic Crossword", "Medimelody",
  "Pop-Culture Quiz", "General Quiz", "BLS Workshop", "Suture Workshop",
  "Preclinical Quiz", "Paraclinical Quiz", "Clinical Quiz", "Case Presentation"
];

/**
 * Run this function ONCE from Google Apps Script editor.
 * It automatically creates all 4 spreadsheets, formats columns, and sets up all event tabs!
 */
function SETUP_FOUR_SPREADSHEETS() {
  Logger.log("Starting Cerebrexia '26 Google Spreadsheets Generation...");

  // 1. All Participants Sheet
  var ssParticipants = SpreadsheetApp.create("Cerebrexia '26 - All Participants");
  var sheetP = ssParticipants.getActiveSheet();
  sheetP.setName("All Participants");
  setupHeaders(sheetP, [
    "Timestamp (IST)", "Candidate ID", "User ID", "Full Name", "Email Address",
    "Phone Number", "College Name", "College City", "College State",
    "BR Payment Status", "Total Registered Events", "Sports Events",
    "Cultural Events", "Last Updated"
  ]);
  SCRIPT_PROPS.setProperty("SHEET_ALL_PARTICIPANTS_ID", ssParticipants.getId());
  Logger.log("1. All Participants Sheet Created: " + ssParticipants.getUrl());

  // 2. Basic Registrations (BR) Sheet
  var ssBR = SpreadsheetApp.create("Cerebrexia '26 - Basic Registrations (BR)");
  var sheetBR = ssBR.getActiveSheet();
  sheetBR.setName("All Basic Registrations");
  setupHeaders(sheetBR, [
    "Timestamp (IST)", "Registration ID", "Registration Type", "Group Size",
    "Lead Name", "Lead Email", "Lead Phone", "Lead College",
    "All Group Members Breakdown", "Promo Code", "Discount Amount (₹)",
    "Final Amount Paid (₹)", "Payment Status", "Razorpay Payment ID",
    "Issued QR Tickets", "Last Updated"
  ]);
  SCRIPT_PROPS.setProperty("SHEET_BR_ID", ssBR.getId());
  Logger.log("2. Basic Registrations Sheet Created: " + ssBR.getUrl());

  // 3. Sports Registrations Sheet (with separate tabs for each sport)
  var ssSports = SpreadsheetApp.create("Cerebrexia '26 - Sports Registrations");
  var sheetSportsOverview = ssSports.getActiveSheet();
  sheetSportsOverview.setName("All Sports Overview");
  setupHeaders(sheetSportsOverview, [
    "Timestamp (IST)", "Sport Name", "Candidate Name", "Email Address",
    "Phone Number", "College Name", "Team Details / Form Responses",
    "QR Ticket Number", "Payment Status", "Candidate ID"
  ]);

  SPORTS_EVENTS.forEach(function(sport) {
    var sTab = ssSports.insertSheet(sanitizeTabName(sport));
    setupHeaders(sTab, [
      "Timestamp (IST)", "Candidate Name", "Email Address", "Phone Number",
      "College Name", "Sport / Sub-Category", "Team Members / Answers",
      "QR Ticket Number", "Payment Status", "Candidate ID"
    ]);
  });
  SCRIPT_PROPS.setProperty("SHEET_SPORTS_ID", ssSports.getId());
  Logger.log("3. Sports Registrations Sheet Created: " + ssSports.getUrl());

  // 4. Cultural Registrations Sheet (with separate tabs for each cultural event)
  var ssCultural = SpreadsheetApp.create("Cerebrexia '26 - Cultural Registrations");
  var sheetCultOverview = ssCultural.getActiveSheet();
  sheetCultOverview.setName("All Cultural Overview");
  setupHeaders(sheetCultOverview, [
    "Timestamp (IST)", "Event Name", "Category", "Candidate Name", "Email Address",
    "Phone Number", "College Name", "Team / Form Answers / Links",
    "QR Ticket Number", "Payment Status", "Candidate ID"
  ]);

  CULTURAL_EVENTS.forEach(function(event) {
    var cTab = ssCultural.insertSheet(sanitizeTabName(event));
    setupHeaders(cTab, [
      "Timestamp (IST)", "Candidate Name", "Email Address", "Phone Number",
      "College Name", "Event Category", "Team Members / Answers / Links",
      "QR Ticket Number", "Payment Status", "Candidate ID"
    ]);
  });
  SCRIPT_PROPS.setProperty("SHEET_CULTURAL_ID", ssCultural.getId());
  Logger.log("4. Cultural Registrations Sheet Created: " + ssCultural.getUrl());

  // Automatically lock all 4 sheets so anyone with the link is VIEW ONLY (no public edits)
  [ssParticipants, ssBR, ssSports, ssCultural].forEach(function(ss) {
    try {
      var file = DriveApp.getFileById(ss.getId());
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (_) {}
  });

  var summary = {
    allParticipantsUrl: ssParticipants.getUrl(),
    basicRegistrationsUrl: ssBR.getUrl(),
    sportsRegistrationsUrl: ssSports.getUrl(),
    culturalRegistrationsUrl: ssCultural.getUrl()
  };

  Logger.log("\n================ ALL 4 SHEETS CREATED SUCCESSFULLY ================");
  Logger.log(JSON.stringify(summary, null, 2));
  return summary;
}

/**
 * Locks all 4 spreadsheets so that anyone with the link can ONLY VIEW.
 * No one except the owner (cerebrexia01@gmail.com) can edit or modify the data!
 * The Web App will continue to append and update data automatically.
 */
function LOCK_ALL_SPREADSHEETS_VIEWER_ONLY() {
  var propKeys = ["SHEET_ALL_PARTICIPANTS_ID", "SHEET_BR_ID", "SHEET_SPORTS_ID", "SHEET_CULTURAL_ID"];
  propKeys.forEach(function(key) {
    var id = SCRIPT_PROPS.getProperty(key);
    if (id) {
      try {
        var file = DriveApp.getFileById(id);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        Logger.log("✅ Locked to Viewer-Only: " + file.getName());
      } catch (err) {
        Logger.log("Error locking " + key + ": " + err.message);
      }
    }
  });
}

/**
 * One-click function to fetch all candidates, BR passes, sports registrations,
 * and cultural event registrations from Supabase and write them directly into
 * all 4 Google Sheets!
 */
function SYNC_ALL_FROM_SUPABASE() {
  Logger.log("Starting full database fetch from Supabase...");
  var supabaseUrl = "https://dgkubrwfrwcfpkgjoxmu.supabase.co";
  var supabaseKey = "sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS";
  
  var headers = {
    "apikey": supabaseKey,
    "Authorization": "Bearer " + supabaseKey,
    "Content-Type": "application/json"
  };

  var payloadData = null;

  // Try calling get_all_fest_data_for_sheets RPC first (bypasses RLS)
  try {
    var rpcRes = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/rpc/get_all_fest_data_for_sheets", {
      method: "post",
      headers: headers,
      payload: "{}",
      muteHttpExceptions: true
    });
    if (rpcRes.getResponseCode() === 200) {
      payloadData = JSON.parse(rpcRes.getContentText());
      Logger.log("Retrieved data via Supabase RPC.");
    }
  } catch (err) {
    Logger.log("RPC check note: " + err.message);
  }

  // Fallback to direct REST table queries
  function fetchTable(table) {
    try {
      var res = UrlFetchApp.fetch(supabaseUrl + "/rest/v1/" + table + "?select=*", {
        headers: headers,
        muteHttpExceptions: true
      });
      if (res.getResponseCode() === 200) {
        return JSON.parse(res.getContentText());
      }
    } catch (_) {}
    return [];
  }

  var participants = (payloadData && payloadData.participants) ? payloadData.participants : fetchTable("participants");
  var basicRegs = (payloadData && payloadData.basic_registrations) ? payloadData.basic_registrations : fetchTable("basic_registrations");
  var sports = (payloadData && payloadData.sports_registrations) ? payloadData.sports_registrations : fetchTable("sports_registrations");
  var cultural = (payloadData && payloadData.cultural_registrations) ? payloadData.cultural_registrations : fetchTable("cultural_registrations");
  var formResponses = (payloadData && payloadData.event_form_responses) ? payloadData.event_form_responses : fetchTable("event_form_responses");
  var tickets = (payloadData && payloadData.tickets) ? payloadData.tickets : fetchTable("tickets");

  Logger.log("Found in database: " + participants.length + " participants, " + basicRegs.length + " BR passes, " + sports.length + " sports, " + cultural.length + " cultural.");

  // Map participant data
  var pMap = {};
  participants.forEach(function(p) {
    if (p.id) pMap[p.id] = p;
    if (p.user_id) pMap[p.user_id] = p;
  });

  // Map form responses
  var formMap = {};
  formResponses.forEach(function(f) {
    var key = (f.registration_id || f.user_id) + "_" + (f.event_id || f.event_name);
    formMap[key] = f;
  });

  // Map tickets
  var ticketsMap = {};
  tickets.forEach(function(t) {
    var regId = t.registration_id || t.basic_registration_id;
    if (regId) {
      if (!ticketsMap[regId]) ticketsMap[regId] = [];
      ticketsMap[regId].push(t.ticket_number || t.id);
    }
  });

  // Format and batch sync
  var batchParticipants = participants.map(function(p) {
    var pSports = sports.filter(function(s) { return s.user_id === p.user_id || s.participant_id === p.id; });
    var pCultural = cultural.filter(function(c) { return c.user_id === p.user_id || c.participant_id === p.id; });
    return {
      id: p.id,
      user_id: p.user_id,
      first_name: p.first_name || "",
      last_name: p.last_name || p.surname || "",
      email: p.email || "",
      phone_number: p.phone_number || "",
      college_name: p.college_name || "",
      college_city: p.college_city || p.city_of_college || "",
      college_state: p.college_state || p.state_of_college || "",
      payment_status: p.payment_status || "PENDING",
      total_registered_events: pSports.length + pCultural.length,
      sports_events: pSports.map(function(s) { return s.event_id || s.event_title || s.event_name; }).filter(Boolean).join(", "),
      cultural_events: pCultural.map(function(c) { return c.event_id || c.event_title || c.event_name; }).filter(Boolean).join(", ")
    };
  });

  var batchBR = basicRegs.map(function(br) {
    var leadP = pMap[br.user_id] || pMap[br.participant_id] || {};
    var regTickets = ticketsMap[br.id] || [];
    return {
      id: br.id,
      registration_type: br.registration_type || "SINGLE",
      group_size: br.group_size || 1,
      lead_name: br.lead_name || ((leadP.first_name || "") + " " + (leadP.last_name || "")).trim(),
      lead_email: br.lead_email || leadP.email || "",
      lead_phone: br.lead_phone || leadP.phone_number || "",
      lead_college: br.lead_college || leadP.college_name || "",
      group_members: br.group_members || [],
      promo_code: br.promo_code || "",
      discount_amount: br.discount_amount || 0,
      amount_paid: br.amount_paid || br.final_amount || (br.group_size || 1) * 2000,
      payment_status: br.payment_status || "COMPLETED",
      razorpay_payment_id: br.razorpay_payment_id || "",
      ticket_number: regTickets.join(", ") || br.ticket_number || ""
    };
  });

  var batchSports = sports.map(function(s) {
    var p = pMap[s.user_id] || pMap[s.participant_id] || {};
    var formKey = (s.id || s.user_id) + "_" + (s.event_id || s.event_name);
    var form = formMap[formKey];
    return {
      id: s.id,
      user_id: s.user_id,
      candidate_name: ((p.first_name || "") + " " + (p.last_name || "")).trim() || s.candidate_name || "N/A",
      email: p.email || s.email || "",
      phone_number: p.phone_number || s.phone_number || "",
      college_name: p.college_name || s.college_name || "",
      event_id: s.event_id || s.sport_id,
      event_name: s.event_name || s.event_title || s.event_id,
      sub_category: s.sub_category || "",
      team_members: (form && form.responses) ? form.responses : (s.team_members || ""),
      ticket_number: s.ticket_number || "",
      payment_status: s.payment_status || "CONFIRMED"
    };
  });

  var batchCultural = cultural.map(function(c) {
    var p = pMap[c.user_id] || pMap[c.participant_id] || {};
    var formKey = (c.id || c.user_id) + "_" + (c.event_id || c.event_name);
    var form = formMap[formKey];
    return {
      id: c.id,
      user_id: c.user_id,
      candidate_name: ((p.first_name || "") + " " + (p.last_name || "")).trim() || c.candidate_name || "N/A",
      email: p.email || c.email || "",
      phone_number: p.phone_number || c.phone_number || "",
      college_name: p.college_name || c.college_name || "",
      event_id: c.event_id,
      event_name: c.event_name || c.event_title || c.event_id,
      sub_category: c.sub_category || "",
      team_members: (form && form.responses) ? form.responses : (c.team_members || ""),
      ticket_number: c.ticket_number || "",
      payment_status: c.payment_status || "CONFIRMED"
    };
  });

  var syncStats = handleBatchSync({
    participants: batchParticipants,
    basicRegistrations: batchBR,
    sportsRegistrations: batchSports,
    culturalRegistrations: batchCultural
  });

  Logger.log("\n🎉 Full Sync Completed! " + JSON.stringify(syncStats));
  return syncStats;
}

/**
 * Formats header rows with dark background, gold text, bold styling and freezes row 1
 */
function setupHeaders(sheet, headers) {
  sheet.clear();
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#0F172A"); // Slate dark
  headerRange.setFontColor("#D4AF37");   // Cerebrexia Gold
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 35);
  for (var col = 1; col <= headers.length; col++) {
    sheet.setColumnWidth(col, 175);
  }
}

/**
 * Clean tab name to conform to Google Sheets rules (max 30 chars, no illegal chars)
 */
function sanitizeTabName(name) {
  var clean = String(name || "General")
    .replace(/[\\\/\?\*\[\]\:]/g, "")
    .replace(/^[\p{Emoji}\s]+/gu, "") // strip leading emoji if any
    .trim();
  return clean.slice(0, 30);
}

/**
 * Locates or dynamically creates an event tab in a spreadsheet
 */
function getOrCreateTab(ss, tabName, defaultHeaders) {
  var cleanName = sanitizeTabName(tabName);
  var sheet = ss.getSheetByName(cleanName);
  if (!sheet) {
    sheet = ss.insertSheet(cleanName);
    setupHeaders(sheet, defaultHeaders);
  }
  return sheet;
}

/**
 * Finds spreadsheet by ID from script properties or direct ID
 */
function getSpreadsheet(propKey, fallbackTitle) {
  var id = SCRIPT_PROPS.getProperty(propKey);
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (_) {}
  }
  // Try finding file by name in Drive
  var files = DriveApp.getFilesByName(fallbackTitle);
  if (files.hasNext()) {
    var f = files.next();
    SCRIPT_PROPS.setProperty(propKey, f.getId());
    return SpreadsheetApp.openById(f.getId());
  }
  // If not found, create new
  var newSS = SpreadsheetApp.create(fallbackTitle);
  SCRIPT_PROPS.setProperty(propKey, newSS.getId());
  return newSS;
}

/**
 * Webhook endpoint: handles incoming POST requests from Cerebrexia portal
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // Thread safety for high concurrent candidate registrations

  try {
    var raw = e.postData ? e.postData.contents : "{}";
    var payload = JSON.parse(raw);
    var action = payload.action || "SYNC_RECORD";

    if (action === "SETUP") {
      var urls = SETUP_FOUR_SPREADSHEETS();
      return jsonResponse({ success: true, message: "Spreadsheets initialized", urls: urls });
    }

    if (action === "BATCH_SYNC") {
      var result = handleBatchSync(payload);
      return jsonResponse({ success: true, message: "Batch synced successfully", result: result });
    }

    // Single Record Sync
    var syncResult = handleSingleSync(payload);
    return jsonResponse({ success: true, result: syncResult });
  } catch (err) {
    Logger.log("doPost Error: " + err.message);
    return jsonResponse({ success: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles single candidate record synchronization
 */
function handleSingleSync(payload) {
  var type = payload.type || payload.sheetType;
  var data = payload.data || {};
  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

  // 1. ALL PARTICIPANTS
  if (type === "ALL_PARTICIPANTS" || type === "PARTICIPANT") {
    var ssP = getSpreadsheet("SHEET_ALL_PARTICIPANTS_ID", "Cerebrexia '26 - All Participants");
    var shP = ssP.getSheetByName("All Participants") || ssP.getSheets()[0];
    var uid = String(data.user_id || data.userId || "");
    var email = String(data.email || "");

    var rowValues = [
      nowStr,
      data.id || data.candidate_id || "",
      uid,
      (data.first_name || "") + " " + (data.last_name || data.surname || ""),
      email,
      data.phone_number || "",
      data.college_name || "",
      data.college_city || data.city_of_college || "",
      data.college_state || data.state_of_college || "",
      data.payment_status || "PENDING",
      data.events_count || (Array.isArray(data.registered_events) ? data.registered_events.length : 0),
      Array.isArray(data.sports) ? data.sports.join(", ") : (data.sports || ""),
      Array.isArray(data.cultural) ? data.cultural.join(", ") : (data.cultural || ""),
      nowStr
    ];

    upsertRow(shP, uid, 3, rowValues);
    return { synced: "ALL_PARTICIPANTS", name: data.first_name };
  }

  // 2. BASIC REGISTRATION (BR)
  if (type === "BR" || type === "BASIC_REGISTRATION") {
    var ssBR = getSpreadsheet("SHEET_BR_ID", "Cerebrexia '26 - Basic Registrations (BR)");
    var shBR = ssBR.getSheetByName("All Basic Registrations") || ssBR.getSheets()[0];
    var brUid = String(data.user_id || "");

    // Format group members string
    var membersList = [];
    if (Array.isArray(data.group_members) && data.group_members.length > 0) {
      data.group_members.forEach(function(m, i) {
        var num = i + 1;
        var r = (m.role === "LEAD" || i === 0) ? "Lead" : ("M" + num);
        var name = (m.first_name || "") + " " + (m.surname || m.last_name || "");
        var em = m.email || "No email";
        var ph = m.phone_number || "No phone";
        var col = m.college_name || "";
        membersList.push(r + ": " + name.trim() + " (" + em + ", " + ph + (col ? ", " + col : "") + ")");
      });
    }
    var membersSummary = membersList.length > 0 ? membersList.join("\n") : "Single Delegate";

    var ticketsStr = Array.isArray(data.tickets)
      ? data.tickets.map(function(t) { return t.ticket_number; }).join(", ")
      : (data.ticket_number || "");

    var brRow = [
      nowStr,
      data.id || "",
      data.registration_type || "SINGLE",
      data.group_size || (membersList.length > 0 ? membersList.length : 1),
      (data.first_name || "") + " " + (data.last_name || data.surname || ""),
      data.user_email || data.email || "",
      data.phone_number || "",
      data.college_name || "",
      membersSummary,
      data.promo_code || "None",
      data.discount_amount || 0,
      data.final_amount != null ? data.final_amount : 2000,
      data.payment_status || "PENDING",
      data.razorpay_payment_id || "",
      ticketsStr,
      nowStr
    ];

    upsertRow(shBR, brUid, 5, brRow);
    return { synced: "BR", regType: data.registration_type };
  }

  // 3. SPORTS REGISTRATION
  if (type === "SPORTS" || type === "SPORT") {
    var ssS = getSpreadsheet("SHEET_SPORTS_ID", "Cerebrexia '26 - Sports Registrations");
    var sportName = data.event_name || data.sportName || "Sports";

    var defaultSportHeaders = [
      "Timestamp (IST)", "Candidate Name", "Email Address", "Phone Number",
      "College Name", "Sport / Sub-Category", "Team Members / Answers",
      "QR Ticket Number", "Payment Status", "Candidate ID"
    ];

    var sportRow = [
      nowStr,
      data.candidate_name || (data.first_name ? data.first_name + " " + (data.surname || data.last_name || "") : "Candidate"),
      data.email || "",
      data.phone_number || "",
      data.college_name || "",
      sportName + (data.form_label ? " (" + data.form_label + ")" : ""),
      formatFormAnswers(data.form_answers || data.answers || data.team_members),
      data.ticket_number || "",
      data.payment_status || "CONFIRMED",
      data.candidate_id || data.user_id || ""
    ];

    // Append to specific Sport Tab
    var sTab = getOrCreateTab(ssS, sportName, defaultSportHeaders);
    sTab.appendRow(sportRow);

    // Also Append to Master "All Sports Overview" tab
    var sOverview = ssS.getSheetByName("All Sports Overview");
    if (sOverview) {
      sOverview.appendRow([
        nowStr, sportName, sportRow[1], sportRow[2], sportRow[3],
        sportRow[4], sportRow[6], sportRow[7], sportRow[8], sportRow[9]
      ]);
    }

    return { synced: "SPORTS", sport: sportName };
  }

  // 4. CULTURAL REGISTRATION
  if (type === "CULTURAL" || type === "CULTURE" || type === "EVENT") {
    var ssC = getSpreadsheet("SHEET_CULTURAL_ID", "Cerebrexia '26 - Cultural Registrations");
    var eventName = data.event_name || data.eventName || "Cultural Event";
    var category = data.category || "Cultural";

    var defaultCultHeaders = [
      "Timestamp (IST)", "Candidate Name", "Email Address", "Phone Number",
      "College Name", "Event Category", "Team Members / Answers / Links",
      "QR Ticket Number", "Payment Status", "Candidate ID"
    ];

    var cultRow = [
      nowStr,
      data.candidate_name || (data.first_name ? data.first_name + " " + (data.surname || data.last_name || "") : "Candidate"),
      data.email || "",
      data.phone_number || "",
      data.college_name || "",
      category + " - " + eventName + (data.form_label ? " (" + data.form_label + ")" : ""),
      formatFormAnswers(data.form_answers || data.answers || data.team_members),
      data.ticket_number || "",
      data.payment_status || "CONFIRMED",
      data.candidate_id || data.user_id || ""
    ];

    // Append to specific Cultural Event Tab
    var cTab = getOrCreateTab(ssC, eventName, defaultCultHeaders);
    cTab.appendRow(cultRow);

    // Also Append to Master "All Cultural Overview" tab
    var cOverview = ssC.getSheetByName("All Cultural Overview");
    if (cOverview) {
      cOverview.appendRow([
        nowStr, eventName, category, cultRow[1], cultRow[2], cultRow[3],
        cultRow[4], cultRow[6], cultRow[7], cultRow[8], cultRow[9]
      ]);
    }

    return { synced: "CULTURAL", event: eventName };
  }

  return { synced: "UNKNOWN", message: "Unhandled sheet type" };
}

/**
 * Handles bulk sync from Supabase export
 */
function handleBatchSync(payload) {
  var countP = 0, countBR = 0, countS = 0, countC = 0;

  if (Array.isArray(payload.participants)) {
    payload.participants.forEach(function(p) {
      handleSingleSync({ type: "ALL_PARTICIPANTS", data: p });
      countP++;
    });
  }

  if (Array.isArray(payload.basicRegistrations)) {
    payload.basicRegistrations.forEach(function(br) {
      handleSingleSync({ type: "BR", data: br });
      countBR++;
    });
  }

  if (Array.isArray(payload.sportsRegistrations)) {
    payload.sportsRegistrations.forEach(function(s) {
      handleSingleSync({ type: "SPORTS", data: s });
      countS++;
    });
  }

  if (Array.isArray(payload.culturalRegistrations)) {
    payload.culturalRegistrations.forEach(function(c) {
      handleSingleSync({ type: "CULTURAL", data: c });
      countC++;
    });
  }

  return { participants: countP, basic: countBR, sports: countS, cultural: countC };
}

/**
 * Helper to update a row if key already exists, otherwise append
 */
function upsertRow(sheet, keyVal, keyColIndex, newRow) {
  if (!keyVal) {
    sheet.appendRow(newRow);
    return;
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][keyColIndex - 1]).trim() === String(keyVal).trim()) {
      sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return;
    }
  }

  sheet.appendRow(newRow);
}

/**
 * Helper to format form answers array into a readable string
 */
function formatFormAnswers(answers) {
  if (!answers) return "None";
  if (typeof answers === "string") return answers;
  if (Array.isArray(answers)) {
    return answers.map(function(a) {
      var label = a.label || a.id || "Field";
      var val = Array.isArray(a.value) ? a.value.join(", ") : (a.value || "");
      return label + ": " + val;
    }).join("\n");
  }
  if (typeof answers === "object") {
    return Object.keys(answers).map(function(k) {
      return k + ": " + answers[k];
    }).join("\n");
  }
  return String(answers);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return jsonResponse({
    status: "ACTIVE",
    service: "Cerebrexia '26 Google Sheets Sync API",
    time: new Date().toISOString()
  });
}
