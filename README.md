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

### 3. Put the folder online
1. Sign in at app.netlify.com. You need an account, because Netlify deletes unclaimed drops after an hour.
2. Open **Sites > Add new site > Deploy manually**.
3. Drag the whole `LivePoll` folder onto the page.
4. Under **Site configuration > Change site name**, pick a short name such as `tf-poll`. The QR code points to that address.

After each change to `config.js`, drag the folder onto the site's **Deploys** tab again.

### 3b. Connect tfsurveys.com
1. In Netlify, open **Domain management > Add a domain** and enter `tfsurveys.com`.
2. Point the domain at Netlify in one of two ways:
   - **Netlify DNS (easiest):** at your registrar, replace the nameservers with the four that Netlify lists.
   - **Keep your registrar's DNS:** add an `A` record for `@` → `75.2.60.5` and a `CNAME` for `www` → `YOUR-SITE.netlify.app`.
3. Wait until Netlify shows **HTTPS: certificate active**. This can take from minutes up to a day. The PowerPoint Web Viewer needs HTTPS.

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
