// ═══════════════════════════════════════════════════════════════
//  GANDIVA RACING — Google Apps Script Backend
//  Paste this ENTIRE file into your Apps Script project
//  Then run setupSheets() ONCE, then deploy as Web App
// ═══════════════════════════════════════════════════════════════

// ── STEP 1: Replace this with your Google Sheet ID ──
const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

// ── Passwords (change these to something you like) ──
const ADMIN_PASS  = 'GandivaAdmin2025!';   // admin login
const MEMBER_PASS = 'GandivaTeam2025';     // member login

const DONATION_TARGET = 12000;

// ────────────────────────────────────────────────────────────────
//  Entry points
// ────────────────────────────────────────────────────────────────
function doGet(e)  { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    const params = e.parameter || {};
    const body   = e.postData ? JSON.parse(e.postData.contents || '{}') : {};
    const action = params.action || body.action;
    const token  = params.token  || body.token;

    if (!action) return json({ error: 'No action specified' });

    // Auth
    const WRITE_ACTIONS = ['addExpense','submitDonation','addGallery'];
    const ADMIN_ACTIONS = ['updateDonation','deleteDonation','deleteExpense',
                           'addMember','removeMember','removeGallery',
                           'approveDonation','rejectDonation','adminSetDonation'];

    if ([...WRITE_ACTIONS, ...ADMIN_ACTIONS].includes(action)) {
      if (token !== ADMIN_PASS && token !== MEMBER_PASS)
        return json({ error: 'Unauthorized' });
    }
    if (ADMIN_ACTIONS.includes(action) && token !== ADMIN_PASS)
      return json({ error: 'Admin only' });

    const ss = SpreadsheetApp.openById(SHEET_ID);

    switch (action) {
      case 'getData':          return json(getAllData(ss));
      case 'addExpense':       return json(addRow(ss, 'Expenses', body.row));
      case 'deleteExpense':    return json(deleteRow(ss, 'Expenses', body.id));
      case 'submitDonation':   return json(upsertDonation(ss, body));
      case 'approveDonation':  return json(setDonationStatus(ss, body.id, 'verified'));
      case 'rejectDonation':   return json(setDonationStatus(ss, body.id, 'unpaid', 0));
      case 'adminSetDonation': return json(adminSetDon(ss, body));
      case 'addMember':        return json(addRow(ss, 'Members', body.row));
      case 'removeMember':     return json(deleteRow(ss, 'Members', body.id));
      case 'addGallery':       return json(addRow(ss, 'Gallery', body.row));
      case 'removeGallery':    return json(deleteRow(ss, 'Gallery', body.id));
      default:                 return json({ error: 'Unknown action: ' + action });
    }
  } catch(err) {
    return json({ error: err.toString() });
  }
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────
//  Data helpers
// ────────────────────────────────────────────────────────────────
function getAllData(ss) {
  return {
    members:   sheetToObjects(ss, 'Members'),
    expenses:  sheetToObjects(ss, 'Expenses'),
    donations: sheetToObjects(ss, 'Donations'),
    gallery:   sheetToObjects(ss, 'Gallery'),
  };
}

function sheetToObjects(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function addRow(ss, sheetName, rowObj) {
  const sheet = ss.getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => rowObj[h] !== undefined ? rowObj[h] : '');
  sheet.appendRow(row);
  return { ok: true };
}

function deleteRow(ss, sheetName, id) {
  const sheet = ss.getSheetByName(sheetName);
  const data  = sheet.getDataRange().getValues();
  const idCol = data[0].indexOf('id');
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { error: 'Row not found' };
}

function upsertDonation(ss, body) {
  const sheet   = ss.getSheetByName('Donations');
  const data    = sheet.getDataRange().getValues();
  const headers = data[0];
  const col     = h => headers.indexOf(h);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col('name')]).toLowerCase() === String(body.name).toLowerCase()) {
      sheet.getRange(i+1, col('paid')+1).setValue(Number(data[i][col('paid')]) + Number(body.paid));
      sheet.getRange(i+1, col('status')+1).setValue('pending');
      sheet.getRange(i+1, col('date')+1).setValue(body.date);
      sheet.getRange(i+1, col('mode')+1).setValue(body.mode);
      sheet.getRange(i+1, col('ref')+1).setValue(body.ref);
      if (body.notes) sheet.getRange(i+1, col('notes')+1).setValue(body.notes);
      return { ok: true, updated: true };
    }
  }
  return addRow(ss, 'Donations', {
    id: Date.now(), memberId: 0, ...body, status: 'pending'
  });
}

function setDonationStatus(ss, id, status, paid) {
  const sheet   = ss.getSheetByName('Donations');
  const data    = sheet.getDataRange().getValues();
  const headers = data[0];
  const col     = h => headers.indexOf(h);
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col('id')]) === String(id)) {
      sheet.getRange(i+1, col('status')+1).setValue(status);
      if (paid !== undefined) sheet.getRange(i+1, col('paid')+1).setValue(paid);
      return { ok: true };
    }
  }
  return { error: 'Not found' };
}

function adminSetDon(ss, body) {
  const sheet   = ss.getSheetByName('Donations');
  const data    = sheet.getDataRange().getValues();
  const headers = data[0];
  const col     = h => headers.indexOf(h);
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][col('name')]).toLowerCase() === String(body.name).toLowerCase()) {
      sheet.getRange(i+1, col('paid')+1).setValue(body.paid);
      sheet.getRange(i+1, col('status')+1).setValue('verified');
      sheet.getRange(i+1, col('date')+1).setValue(body.date || new Date().toISOString().split('T')[0]);
      return { ok: true };
    }
  }
  return { error: 'Member not found in donations' };
}

// ────────────────────────────────────────────────────────────────
//  ONE-TIME SETUP — run this function ONCE from the Apps Script editor
// ────────────────────────────────────────────────────────────────
function setupSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const schema = {
    Members:   ['id','name','username','role','dept','initials'],
    Expenses:  ['id','desc','amt','cat','date','by','receipt','notes'],
    Donations: ['id','memberId','name','paid','status','mode','date','ref','notes'],
    Gallery:   ['id','src','caption','date'],
  };

  Object.entries(schema).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    sheet.clearContents();
    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight('bold')
      .setBackground('#C8F400')
      .setFontColor('#000000');
    sheet.setFrozenRows(1);
  });

  // Seed members
  const members = [
    [1,'Drahrekot','drahrekot','Head of Electrical Systems & Chassis Design','Electrical Systems','DR'],
    [2,'Arjun Subramanian','arjun.s','Team Captain','Management','AS'],
    [3,'Priya Venkatesh','priya.v','Powertrain Engineer','Powertrain','PV'],
    [4,'Karthik Rajan','karthik.r','Chassis Lead','Chassis & Suspension','KR'],
    [5,'Meghana Selvan','meghana.s','BMS Designer','Electrical Systems','MS'],
    [6,'Roshan Pillai','roshan.p','CFD & Aerodynamics','Aerodynamics','RP'],
    [7,'Divya Krishnan','divya.k','Embedded Systems','Electronics','DK'],
    [8,'Vignesh Narayanan','vignesh.n','Mechanical Fabrication','Chassis & Suspension','VN'],
  ];
  const mSheet = ss.getSheetByName('Members');
  members.forEach(r => mSheet.appendRow(r));

  // Seed donations
  const donations = [
    [1,1,'Drahrekot',12000,'verified','UPI / GPay','2025-01-10','TXN001','Full payment'],
    [2,2,'Arjun Subramanian',12000,'verified','Bank Transfer / NEFT','2025-01-08','TXN002','Full payment'],
    [3,3,'Priya Venkatesh',6000,'pending','UPI / GPay','2025-02-01','TXN003','Partial'],
    [4,4,'Karthik Rajan',9000,'verified','Cash (Treasurer)','2025-01-20','CASH001','Partial verified'],
    [5,5,'Meghana Selvan',12000,'verified','UPI / GPay','2025-01-15','TXN005','Full payment'],
    [6,6,'Roshan Pillai',0,'unpaid','—','—','—','Not paid'],
    [7,7,'Divya Krishnan',12000,'pending','UPI / GPay','2025-03-01','TXN007','Awaiting verification'],
    [8,8,'Vignesh Narayanan',4000,'pending','Bank Transfer / NEFT','2025-02-20','TXN008','Partial'],
  ];
  const dSheet = ss.getSheetByName('Donations');
  donations.forEach(r => dSheet.appendRow(r));

  // Seed expenses
  const expenses = [
    [1,'BLDC Motor Controller — Kelly Controls KLS7230H',18500,'Electrical Components','2025-01-05','Drahrekot',false,'Main drive controller'],
    [2,'Lithium Battery Pack (48V 30Ah)',32000,'Electrical Components','2025-01-12','Meghana Selvan',true,'From vendor in Chennai'],
    [3,'Steel Tube Stock for Chassis (12m)',8400,'Mechanical Parts','2025-01-18','Karthik Rajan',true,'ERW tubes 32mm OD'],
    [4,'EKVC 2025 Registration Fee',15000,'Registration / Entry Fee','2025-01-25','Arjun Subramanian',true,'Official registration'],
    [5,'Wire harness — 16AWG & 22AWG spools',3200,'Electrical Components','2025-02-02','Drahrekot',false,'10m each colour'],
    [6,'PCB Fabrication — JLCPCB batch',2800,'Electrical Components','2025-02-10','Divya Krishnan',true,'BMS sense board x5'],
    [7,'Travel — Team to Coimbatore for testing',4500,'Travel & Logistics','2025-02-15','Arjun Subramanian',false,'Shared van hire'],
    [8,'Safety harness & fire extinguisher',5600,'Mechanical Parts','2025-02-20','Karthik Rajan',true,'FIA spec harness'],
    [9,'GKDC 2025 Entry + accommodation',22000,'Travel & Logistics','2025-03-01','Arjun Subramanian',true,'3 nights x 4 rooms'],
    [10,'Brake caliper overhaul kit',1800,'Mechanical Parts','2025-03-10','Vignesh Narayanan',false,'Front & rear'],
  ];
  const eSheet = ss.getSheetByName('Expenses');
  expenses.forEach(r => eSheet.appendRow(r));

  Logger.log('✅ Setup complete! All sheets created and seeded with sample data.');
  Logger.log('✅ Now deploy this script as a Web App (see setup guide).');
}
