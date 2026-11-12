# Live Poll

Attendees scan a QR code and vote on their phones. The results show up live on screen.

## How it works

You use three things:

| Link | What it does |
|---|---|
| `tfsurveys.com/q1` … `/q5` | One link per question. Opening it makes that question live on every phone and shows the live results and the QR code. |
| `tfsurveys.com` | The vote page. The QR code opens it. Phones always show the live question, so attendees scan only once. |
| `tfsurveys.com/admin` | Your page. See response counts, download results, and reset all responses. Needs your admin code. |

## During a presentation

1. On each question's slide, add a link to that question, such as `tfsurveys.com/q3`. In PowerPoint, select a shape or text and press **Ctrl+K**.
2. Before you start, open Chrome and press **F11** for full screen. The links then open there.
3. At each question, click the link. The question opens on everyone's phone, and the results fill the screen.
4. Press **Alt+Tab** to return to PowerPoint.

The results show percentages only. The slide links hold no secret, so the deck is safe to share.

## After a presentation

1. Open `tfsurveys.com/admin` and sign in.
2. Click **Download results** if you want to keep them.
3. Click **Reset all responses** twice. The second click confirms. This also closes voting on the phones.

## Change the questions

1. Edit the `questions` list in `config.js`. Up to 10 questions, with up to 12 choices each.
2. Reset all responses, because old answers stay tied to the question numbers.
3. Publish:
   ```
   git pull --rebase
   git add -A
   git commit -m "New questions"
   git push
   ```
   GitHub publishes in about a minute. Browsers can keep the old copy for up to 10 minutes, so change questions well before a talk.

## Good to know

- **Run a rehearsal the day before.** Supabase pauses free projects after 7 days without use. If yours is paused, click **Restore** in the Supabase dashboard.
- Attendees can change their answer while their question is live. Each phone counts once per question.
- Anyone who knows a question link could switch the live question. They can't see the admin page or reset results.
- The admin code is in `LivePoll-private\ADMIN-CODE.txt`, outside this public repo. To change it, run in the Supabase SQL Editor: `update poll_admin set code = 'new-code';`
- `tfsurveys.com/results.html` with no `?q=` follows whichever question is live. Add `&qr=0` to a results link to hide the QR code, or `&theme=dark` for a dark screen.

## Setup from scratch

1. Create a Supabase project. Paste all of `setup.sql` into **SQL Editor**, set your own admin code, and click **Run**.
2. Put the project URL and the anon public key into `config.js`.
3. Host this folder on GitHub Pages. For a custom domain, add four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a `CNAME` for `www` → `<user>.github.io`. Then set the domain in **Settings > Pages** and tick **Enforce HTTPS**.
