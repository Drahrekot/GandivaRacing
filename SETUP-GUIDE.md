# Gandiva Racing — Full Setup Guide
## Free hosting, live backend, zero server cost

---

## What you'll set up
| Service | Purpose | Cost |
|---|---|---|
| Google Sheets | Stores all data (members, expenses, donations, gallery) | Free |
| Google Apps Script | Backend API (receives and saves data) | Free |
| Netlify | Hosts the website publicly | Free |

**Total time: ~20 minutes**

---

## STEP 1 — Create your Google Sheet

1. Go to **sheets.google.com** and click **+ Blank**
2. Name it `Gandiva Racing Data` (click "Untitled spreadsheet" at top)
3. Look at the URL — it looks like:
   `https://docs.google.com/spreadsheets/d/`**`1ABCxyz...`**`/edit`
4. **Copy that long ID** (the bold part between `/d/` and `/edit`)
   → You'll need it in the next step

---

## STEP 2 — Set up the Apps Script backend

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all the code in the editor (it shows a blank `function myFunction()`)
3. Open the file `Code.gs` you downloaded
4. **Paste the entire contents** into the Apps Script editor
5. Find this line at the top and replace the placeholder:
   ```
   const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
   ```
   → Replace `PASTE_YOUR_SHEET_ID_HERE` with the Sheet ID you copied in Step 1
6. Click **💾 Save** (Ctrl+S / Cmd+S)

---

## STEP 3 — Run the one-time sheet setup

1. In the Apps Script editor, find the function dropdown (top toolbar, says "myFunction" or similar)
2. Click it and select **`setupSheets`**
3. Click the **▶ Run** button
4. Google will ask for permissions — click **Review permissions → Allow**
   (It says "This app isn't verified" — that's fine, it's YOUR script. Click "Advanced → Go to Gandiva Racing (unsafe)")
5. Wait ~10 seconds
6. Click **Execution log** at the bottom — you should see:
   `✅ Setup complete! All sheets created and seeded with sample data.`
7. Go back to your Sheet — you'll now see 4 tabs: **Members, Expenses, Donations, Gallery**

---

## STEP 4 — Deploy as Web App

1. In Apps Script, click **Deploy → New deployment**
2. Click the ⚙️ gear icon next to "Select type" and choose **Web app**
3. Fill in:
   - **Description**: `Gandiva Racing API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` ← **this is important**
4. Click **Deploy**
5. Google will ask for permissions again — click **Authorize access → Allow**
6. You'll get a URL like:
   `https://script.google.com/macros/s/AKfy.../exec`
7. **Copy this entire URL** — you'll paste it into the website

---

## STEP 5 — Add the URL to your website

1. Open `index.html` in a text editor (Notepad, VS Code, anything)
2. Find this line (near line 1127, in the `<script>` section):
   ```javascript
   const SCRIPT_URL = 'PASTE_YOUR_SCRIPT_URL_HERE';
   ```
3. Replace `PASTE_YOUR_SCRIPT_URL_HERE` with the URL you copied
4. Save the file

---

## STEP 6 — Host on Netlify (free)

1. Go to **netlify.com** and sign up (free — use Google or GitHub)
2. After signing in, click **"Add new site" → "Deploy manually"**
3. Drag and drop your `index.html` file into the upload box
4. Netlify gives you a URL like `jolly-koala-abc123.netlify.app`
5. **Optional: rename it** → Site settings → Change site name → `gandivaracing` → becomes `gandivaracing.netlify.app`

That's it — your site is live!

---

## STEP 7 — Test everything

Open your Netlify URL and test:

### Test as Member:
1. Click **Team Portal**
2. Choose **Member** tab
3. Username: `arjun.s` | Password: `GandivaTeam2025`
4. You should land on a welcome screen with active actions: **Submit Donation**, **Change Password**
5. Try logging a donation → check your Google Sheet → it should appear in the Donations tab as pending

### Test as Admin:
1. Click **Team Portal**
2. Choose **Admin** tab
3. Username: `drahrekot` | Password: `GandivaAdmin2025!`
4. You should see the full dashboard with all tabs (Home, Dashboard, Expenses, Donations, Admin)
5. Try approving the member's pending donation in the Admin Panel → check the Donations sheet → status should change to `verified`

---

## Passwords & Usernames

### Seeded Member accounts:
- Team Captain: username `arjun.s` | password `GandivaTeam2025`
- Powertrain: username `priya.v` | password `GandivaTeam2025`
- Chassis Lead: username `karthik.r` | password `GandivaTeam2025`
- BMS Designer: username `meghana.s` | password `GandivaTeam2025`
- CFD: username `roshan.p` | password `GandivaTeam2025`
- Embedded Systems: username `divya.k` | password `GandivaTeam2025`
- Fabrication: username `vignesh.n` | password `GandivaTeam2025`

### Seeded Admin account:
- Head of Electrical & Chassis: username `drahrekot` | password `GandivaAdmin2025!`

---

## Changing passwords

### For Members:
- Members can change their own passwords securely by logging into the **Team Portal**, clicking the **Change Password** action card, and entering their current and new passwords.

### For Admins (Resetting member passwords):
- Admins can reset any team member's password directly from the **Admin Panel** under the **Reset Member Password** section.

---

## Managing the team (Admin tasks)

### Add a new member:
- Go to **Team Portal → Admin tab → Add Team Member**
- Fill name, username, role, department, role type, and set an initial password → click Add

### Approve/Reject a donation:
- Go to **Team Portal → Admin tab**
- Under "Pending Approvals" table, click **✓** to verify or **✕** to reject

### Add gallery photos:
- Go to **Team Portal → Admin tab → Gallery Management**
- Click **+ Upload Photos** → select images
- They appear on the public Gallery page immediately

### Delete an expense:
- Go to **Team Portal → Admin tab → All Expenses**
- Click **Del** next to the entry

---

## Updating the site (re-deploy)

If you change anything in `index.html`:
1. Go to **netlify.com → your site**
2. Go to **Deploys** tab
3. Drag-drop the new `index.html` file → Netlify updates in ~10 seconds

If you change anything in `Code.gs`:
1. Apps Script → **Deploy → Manage deployments**
2. Click the ✏️ edit icon → **Version: New version** → **Deploy**

---

## Troubleshooting

**"Could not reach backend" error:**
- Make sure you deployed the script with "Anyone" access
- Check the `SCRIPT_URL` in your HTML matches exactly what Apps Script gave you
- Try opening the script URL directly in a browser — it should return `{"error":"No action specified"}`

**Member can't log in:**
- Check their username in the Members sheet (exact match, case-insensitive)
- Admin can reset passwords and add/remove members from the Admin tab

**Data not updating:**
- If you re-deploy Apps Script, make sure you selected "New version" during deployment so the changes take effect
- Open the Sheet directly to verify data is there

---

## Security notes

- **Secure Passwords**: Passwords are saved in your Google Sheet and verified server-side. They are never sent to the client browser or stored in the HTML source code.
- **Admin Access**: Only users with `roleType: admin` can perform admin actions (approvals, password resets, member addition/removal).
- **Sheet Link**: Never share your Google Sheet link publicly — it contains all financial data and member passwords.
- **Apps Script URL**: The Apps Script URL is unlisted — keep it confidential.
