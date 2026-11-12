# Live Poll

Attendees scan a QR code on your slide and vote on their phones. The results show up live on the slide.

| File | Who uses it |
|---|---|
| `index.html` | Attendees. The QR code opens this page. |
| `results.html` | Your slides. Live bars plus the QR code. |
| `admin.html` | You. Open questions, close voting, download results, clear results. |
| `config.js` | Your questions and Supabase keys. |
| `setup.sql` | Run once in Supabase. |

## Try it first (demo mode)

With blank Supabase keys, the poll runs in demo mode. Votes stay in one browser, so phones can't join. The admin code is `demo`.

## Setup (about 20 minutes)

### 1. Create the Supabase project
1. Sign up at supabase.com. The free plan is enough.
2. Click **New project**. Pick a name, a database password, and a US region.
3. Open **SQL Editor > New query** and paste in all of `setup.sql`.
4. Find `CHANGE-ME-to-a-long-code` and replace it with your own admin code. Make it long.
5. Click **Run**. You should see "Success. No rows returned."
6. Open **Project Settings > API**. Copy the **Project URL** and the **anon public** key into `config.js`.

### 2. Write your questions
Edit the `questions` list in `config.js`. Each question can have up to 12 choices. Keep the choices short, because they need to fit on one line of the slide.

### 3. Put the folder online (GitHub Pages)
This folder is its own git repo: `ZachMo/tfsurveys`. Everything in it is public, so keep the admin code out of it.

To publish a change, commit and push:
```
git add -A
git commit -m "New questions"
git push
```
GitHub publishes in about a minute, but browsers can keep the old copy for up to 10 minutes. Change questions well before a talk.

### 3b. Connect tfsurveys.com
1. At your registrar, add these DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `zachmo.github.io`
2. In the repo, open **Settings > Pages**. Check that the custom domain reads `tfsurveys.com`.
3. When the certificate is ready, tick **Enforce HTTPS**. This can take from minutes up to a day. The PowerPoint Web Viewer needs HTTPS.

`config.js` already points the QR code at `https://tfsurveys.com`. If you choose a subdomain instead, such as `poll.tfsurveys.com`, change `voteUrl` to match.

### 4. Build the slides
1. Open `https://tfsurveys.com/admin` and sign in with your admin code.
2. Under **Links for your slides**, copy the link for each slide.
3. In PowerPoint, click **Insert > Get Add-ins**. Search for **Web Viewer** and add it.
4. Paste the link into the Web Viewer box and stretch the box to fill the slide.
5. Repeat for each slide: one Join slide, then one slide per question.

When a question slide shows, that question opens on every phone. The slide links hold your admin code, so don't send the deck to clients.

**Backup plan:** If the add-in has trouble, present `results.html` in a browser tab. Use `admin.html` on your phone to open each question.

## After the presentation
1. In `admin.html`, click **Download CSV** to keep the results.
2. Click **Clear all results** twice. The second click confirms.

## Good to know
- **Run a rehearsal the day before.** Supabase pauses free projects after 7 days without use. If yours is paused, click **Restore** in the Supabase dashboard. It takes a few minutes.
- Attendees can change their answer while the question is open. Each phone counts once per question.
- Each phone gets a random ID. Someone who clears their browser data can vote again. That's fine for a poll, but not for a binding vote.
- To change the admin code, run this in the SQL Editor: `update poll_admin set code = 'new-code';`
- URL options for `results.html`: `?q=2` shows question 2 without opening it. `&qr=0` hides the QR code. `&theme=dark` gives a dark slide.
