# Gandiva Racing — Team Website

**Student-led. Engineer-driven.**  
Electric karting team competing at national level — website + internal team portal, all in a single HTML file with a Google Sheets backend.

---

## What's in this repo

| File | Purpose |
|---|---|
| `index.html` | The complete website (rename from `gandiva-final.html`) |
| `Code.gs` | Google Apps Script backend — paste into Apps Script |
| `SETUP-GUIDE.md` | Full step-by-step hosting instructions |

---

## Features

### Public website
- **Home** — hero, ticker, about snapshot, results list
- **About** — team philosophy, subsystems, stats
- **Results** — full competition history
- **Team** — member grid pulled live from Google Sheets
- **Gallery** — photo grid with lightbox (admin upload)
- **Contact** — enquiry form

### Team Portal (`/portal`)
- **Member login** — individual username + password (stored server-side, never in HTML)
- **Admin login** — full control panel
- **Submit donation** — log payment for admin verification with UPI/bank ref
- **Add expense** — buyers and admins can log team purchases
- **Donation tracker** — progress bars, pending/verified/unpaid status
- **Dashboard** — financial summary cards
- **Change password** — any member can update their own password
- **Admin panel:**
  - Approve / reject donations
  - Set verified donation amounts
  - Upload / delete gallery photos
  - Add / remove team members
  - Assign role types (member / buyer / admin)
  - Reset any member's password

### Role types
| Role | Can do |
|---|---|
| `member` | Submit donation, change password, view dashboard & donations |
| `buyer` | Everything member can + log/view expenses |
| `admin` | Everything + full admin panel |

---

## Tech stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | Single HTML file (vanilla JS, GSAP animations) | Free |
| Backend | Google Apps Script (REST API) | Free |
| Database | Google Sheets | Free |
| Hosting | Netlify (drag & drop) | Free |

**Total monthly cost: ₹0**

---

## Quick setup (20 minutes)

### 1 — Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) → create a blank sheet
2. Name it `Gandiva Racing Data`
3. Copy the Sheet ID from the URL:  
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

### 2 — Apps Script
1. In the sheet: **Extensions → Apps Script**
2. Delete everything, paste the entire contents of `Code.gs`
3. Replace `PASTE_YOUR_SHEET_ID_HERE` with your Sheet ID
4. **Save** (Ctrl+S)
5. Select function `setupSheets` from the dropdown → click **▶ Run**
6. Accept permissions when prompted
7. Check the Execution Log — should say ✅ Setup complete

### 3 — Deploy as Web App
1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me** · Who has access: **Anyone**
4. Click **Deploy** → copy the URL  
   `https://script.google.com/macros/s/ABC.../exec`

### 4 — Add URL to website
1. Open `index.html` in any text editor
2. Find: `const SCRIPT_URL = 'PASTE_YOUR_SCRIPT_URL_HERE';`
3. Replace with your URL from step 3
4. Save

### 5 — Host on Netlify
1. Go to [netlify.com](https://netlify.com) → sign up free
2. **Add new site → Deploy manually**
3. Drag and drop `index.html` into the upload box
4. Your site is live at `something.netlify.app`
5. Optional: rename under **Site settings → Change site name**

---

## Default credentials

### Member login
- Username: any roster username (e.g. `arjun.s`, `drahrekot`)
- Password: `GandivaTeam2025` (shared default until each member changes it)

### Admin login  
- Username: `admin`
- Password: `GandivaAdmin2025!`

> **Security note:** Passwords are stored in the Google Sheet and validated server-side. They are never embedded in the HTML source. Members can change their own password from the portal home screen.

### Default member usernames
| Name | Username | Role |
|---|---|---|
| Drahrekot | `drahrekot` | Member |
| Arjun Subramanian | `arjun.s` | Admin |
| Priya Venkatesh | `priya.v` | Member |
| Karthik Rajan | `karthik.r` | Buyer |
| Meghana Selvan | `meghana.s` | Member |
| Roshan Pillai | `roshan.p` | Member |
| Divya Krishnan | `divya.k` | Buyer |
| Vignesh Narayanan | `vignesh.n` | Member |

---

## Changing passwords

### Admin password
Edit `Code.gs` line:
```js
const ADMIN_PASS = 'GandivaAdmin2025!';
```
Then redeploy: **Deploy → Manage deployments → Edit → New version → Deploy**

### Member default password
Edit `Code.gs` line:
```js
const validPw = storedPw || 'GandivaTeam2025';
```

### Individual member password
- **Member themselves:** Portal → Home → Change Password
- **Admin:** Portal → Admin tab → Reset Member Password

---

## Updating the site

**If you edit `index.html`:**  
Go to Netlify → Deploys → drag-drop the new file. Updates in ~10 seconds.

**If you edit `Code.gs`:**  
Apps Script → Deploy → Manage deployments → Edit → Version: New version → Deploy.  
*(The URL stays the same — no need to update the HTML)*

---

## Troubleshooting

**"Backend error" on login:**  
Open the Script URL directly in a browser — it should return `{"error":"No action"}`. If it 404s, redeploy the Web App.

**Member can't log in:**  
Check spelling of username in the Members sheet. Admin can see/fix it from the Admin panel.

**Donations not showing:**  
Hit **↻ Refresh** in the dashboard, or reload the page. Data loads fresh each session.

**Images not loading in gallery:**  
Photos are stored as base64 in the Sheet — fine for up to ~50 photos. For larger galleries, link to Google Drive public image URLs instead.

---

## Competitions

- **EKVC** — Electric Kart Varsity Championship
- **GKDC** — Go Kart Design Challenge

---

*Gandiva Racing · Coimbatore · Est. 2022*
