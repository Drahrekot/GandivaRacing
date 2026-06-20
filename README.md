# 🏎️ Gandiva Racing Club Website

A sleek, dark-themed club management website with, powered by Google Apps Script and hosted on Netlify. Database hosted with Google sheets for easier access.

---

## 🚀 Features

### 👥 User Management
- Multi-user login system with username & password authentication
- Users can change their own passwords after logging in
- Admin can reset or change any user's password
- Role-based access: **Admin** and **Member** roles


### 💰 Expense Tracking
- Members can log and submit expenses
- Admin can view, approve, or delete expense entries
- All data stored in Google Sheets in real-time

### 🎁 Donation Management
- Members can submit donation status
- Admin has a dedicated dashboard to **approve or reject** donations
- Real-time status updates reflected instantly

### 🖼️ Gallery Management
- Admin can **upload** and **delete** gallery photos
- Clean photo grid display for all members to view

### 🔐 Secure Authentication
- Server-side password validation via Google Apps Script
- Session-based login (no passwords stored in the browser)
- Secure backend — all sensitive logic lives in Apps Script

### 🎨 Design & Animations
- Dark theme with 🔴 red accent color scheme
- Smooth GSAP-powered animations
- Fully **mobile-friendly** and responsive layout

---

## 🛠️ Setup Guide

### Step 1 — 📋 Set Up Google Sheets

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Create the following sheets (tabs) inside it:
   - `Users` — stores usernames, hashed passwords, and roles
   - `Expenses` — stores expense entries
   - `Donations` — stores donation records
   - `Gallery` — stores photo URLs
3. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

---

### Step 2 — ⚙️ Set Up Google Apps Script

1. Go to [script.google.com](https://script.google.com) and create a **New Project**
2. Paste the provided `Code.gs` backend script into the editor
3. Replace the placeholder with your Spreadsheet ID:
   ```js
   const SHEET_ID = "YOUR_SPREADSHEET_ID";
   ```
4. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and copy the **Web App URL** — you'll need this next

---

### Step 3 — 🌐 Configure the Frontend

1. Open `config.js` (or the relevant config section in `index.html`)
2. Paste your Apps Script Web App URL:
   ```js
   const BACKEND_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
   ```
3. Save the file

---

### Step 4 — ☁️ Deploy to Netlify

1. Push your frontend files to a **GitHub repository**
2. Go to [netlify.com](https://netlify.com) and click **Add new site → Import from Git**
3. Connect your GitHub repo
4. Set build settings:
   - Build command: *(leave empty if no build step)*
   - Publish directory: `/` or `public/`
5. Click **Deploy Site** 🎉
6. Your site will be live at `https://your-site-name.netlify.app`

---

### Step 5 — 👤 Create the First Admin User

1. Open your Google Sheet → `Users` tab
2. Manually add the first row:

   | Username | Password (hashed) | Role  |
   |----------|-------------------|-------|
   | admin    | *(set via script)*| admin |

3. Run the `createAdminUser` function in Apps Script to set the initial admin password securely

---

## 🗂️ Project Structure

```
📁 Gandiva-club/
├── 📄 index.html          — Main website entry point
├── 🔧 config.js           — Backend URL and app settings
├── 🖼️ assets/             — Images, icons, fonts
└── 📄 README.md           — You are here!
```

---

## 🔑 Default Admin Access

| Field    | Value          |
|----------|----------------|
| Username | `admin`        |
| Password | *(set on first run)* |
| Role     | `Admin`        |

> ⚠️ **Change the default admin password immediately after first login!**

---

## 📱 Browser & Device Support

| Platform | Support |
|----------|---------|
| 💻 Desktop (Chrome, Firefox, Edge) | ✅ Full |
| 📱 Mobile (iOS & Android)          | ✅ Full |
| 🗂️ Tablet                          | ✅ Full |

---

## 🧰 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| 🎨 Frontend | HTML, CSS, JavaScript   |
| ✨ Animations | GSAP                  |
| ⚙️ Backend  | Google Apps Script      |
| 🗄️ Database | Google Sheets           |
| ☁️ Hosting  | Netlify                 |

---

## 🆘 Troubleshooting

**❌ Login not working?**
→ Check that your Apps Script is deployed as a Web App with access set to *"Anyone"*

**❌ Data not updating?**
→ Re-deploy the Apps Script (every code change needs a new deployment)

**❌ CORS errors in the browser console?**
→ Make sure the Apps Script returns proper JSON with `ContentService`

**❌ Site not loading on Netlify?**
→ Check that the `BACKEND_URL` in `config.js` is correct and the script is deployed

---

## 📬 Support

For issues or feature requests, contact the site admin or raise a ticket in the project repository.

---

*Built with Passion.*
