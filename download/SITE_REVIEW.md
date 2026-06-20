# Numeria Institute — Production Site Review

**URL reviewed:** `https://numeria-institute-production.up.railway.app/`
**Date:** 2026-06-20
**Logged in as:** `mawuliro` (superuser)
**Browser:** headless Chrome 150, 1440×900 viewport
**Screenshots:** 38 files in `/home/z/my-project/download/site-review/`

---

## CRITICAL — fix today

### P1. `DEBUG=True` in production — security emergency

**Evidence:**
- `/en/cours/` returns the full Django debug traceback (template source code, file paths, Python paths, server info)
- `/en/this-page-does-not-exist/` returns the Django "technical 404" page listing **all URL patterns** with their names — including `/numeria-staff-portal/`, `/analytics/`, `/admin-panel/...` etc.
- The 500 page on `/en/cours/` shows: `Python Path: ['/app', '/opt/venv/bin', ...]`, `Server time: Sat, 20 Jun 2026 13:03:21 +0000`, full template source with line numbers

**Why this is critical:**
- Any visitor can see your source code, file layout, installed Python packages, and URL structure
- An attacker maps your entire app by hitting random URLs
- Errors leak database field names, model relationships, and template logic
- This violates GDPR/RGPD data-minimisation and is a textbook "sensitive information disclosure" finding in any pen-test

**Fix:** In your Railway environment variables, set:
```
DEBUG=False
```
Then redeploy. The `.env.example` correctly shows `DEBUG=False` — someone overrode it in the Railway dashboard.

### P2. `/en/cours/` and `/fr/cours/` are 500 errors — the entire courses catalogue is down

**Evidence:** Visiting `https://numeria-institute-production.up.railway.app/en/cours/` returns:
```
VariableDoesNotExist at /en/cours/
Failed lookup for key [cours_scolaires] in [{'cours': <QuerySet []>, 'matiere_active': '', ...}]
```

**Root cause:** This is finding **M6** from my earlier code review — the `cours/templates/cours/catalogue.html` template references context variables (`type_actif`, `cycle_actif`, `cours_generaux`, `cours_scolaires`, `classes`) that the `cours/views.py:catalogue` view doesn't provide. The template was written for a richer filter UI (type/cycle/classe) that was never implemented in the rebuilt view.

**Impact:** Students cannot browse the course catalogue. The "Courses" link in the main navigation goes to a 500 page. This is the primary entry point to your paid product and it's broken on production.

**Fix:** Either restore the type/cycle/classe filter logic in `cours/views.py:catalogue`, or simplify `catalogue.html` to remove the dead filter UI. This is a 30-minute fix.

### P3. Tailwind CSS loaded from CDN in production

**Evidence:** Console shows 28+ warnings on every page:
```
cdn.tailwindcss.com should not be used in production.
To use Tailwind CSS in production, install it as a PostCSS plugin
or use the Tailwind CLI: https://tailwindcss.com/docs/installation
```

**Impact:**
- ~100 KB+ of JS loaded on every page request just to compile CSS in the browser
- Flash of unstyled content (FOUC) on slow connections
- Render-blocking external request to a third-party CDN (privacy + availability risk)
- Hurts Core Web Vitals / SEO / Lighthouse score

**Fix:** Install Tailwind as a build step:
```bash
npm install -D tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./static/src/input.css -o ./static/dist/tailwind.css --minify
```
Add the build to your `railway.json` `startCommand` (or a `buildCommand`). Replace `<script src="https://cdn.tailwindcss.com"></script>` in `templates/base.html` with `<link rel="stylesheet" href="{% static 'dist/tailwind.css' %}">`.

---

## HIGH — fix this week

### P4. Broken notification link in mentorat acceptance flow

**Evidence:** In `visioconference/consumers.py:540` (and similar in mentorat notifications), when a mentor accepts a mentorat request, the in-app notification tells the mentee to visit:
```
/mentorat/tableau-de-bord-mentee/
```
But the actual URL pattern (from `mentorat/urls.py:25`) is:
```
/mentorat/tableau-bord-mentee/   (no "de")
```
I verified: `/fr/mentorat/tableau-de-bord-mentee/` returns 404, `/fr/mentorat/tableau-bord-mentee/` returns 200.

**Impact:** Every accepted-mentorat notification is a dead link. Mentees can't reach their dashboard from the notification.

**Fix:** Change `'/mentorat/tableau-de-bord-mentee/'` to `reverse('mentorat:tableau_de_bord_mentee')` everywhere it appears. Use `python manage.py shell` + `from django.urls import reverse; reverse('mentorat:tableau_de_bord_mentee')` to verify.

### P5. `visio/` index page has no route

**Evidence:** Visiting `https://numeria-institute-production.up.railway.app/en/visio/` returns 404. Only `/visio/create/`, `/visio/join/`, `/visio/lobby/<code>/`, `/visio/room/<code>/` etc. exist (per `visioconference/urls.py`).

**Impact:** There's no "create or join a meeting" landing page reachable from the main navigation. Users have to know the `/visio/create/` URL.

**Fix:** Add `path('', views.create_room, name='index')` to `visioconference/urls.py` (or add a `path('', views.visio_index, name='index')` view that renders a landing page). Also: the visioconference app is not even in the main navigation — only reachable via direct URL.

### P6. `Mode sombre` (dark mode toggle) label is always in French

**Evidence:** Every page in both French and English locales shows the dark mode button label as `Mode sombre` (French). The tooltip should be `Dark mode` on `/en/` pages.

**Impact:** Minor i18n leak but very visible — it's in the header on every page.

**Fix:** Find the dark-mode toggle in `templates/base.html` (or wherever the header partial lives), wrap the label in `{% trans "Dark mode" %}`.

### P7. `Sandbox Python` button label is always in French

**Evidence:** Header has a `Sandbox Python` button (French) — should be `Python Sandbox` in English. Same issue as P6.

### P8. Contact form is a bilingual mess

**Evidence:** On `/en/contact/`, the form mixes French and English within the same form:

| Field | Label shown (on English locale) | Should be |
|---|---|---|
| Heading | `Contactez-nous` | `Contact us` |
| Subheading | `Envoyer un message` | `Send a message` |
| Name field | `Votre nom et prénom` | `Your full name` |
| Email field | `votre@email.com` | `your@email.com` |
| Organisation | `University, company, NGO...` | (correct) |
| Subject dropdown | `— Choose a subject —` (correct) | |
| Subject option 1 | `Demande d'information` | `Information request` |
| Subject option 2 | `Inscription aux filières` | `Enrollment in programmes` |
| Subject option 3 | `Partnership proposal` (correct) | |
| Subject option 4 | `Press / media contact` (correct) | |
| Subject option 5 | `Problème technique` | `Technical issue` |
| Subject option 6 | `Other` (correct) | |
| Submit button | `Envoyer le message 📨` | `Send message 📨` |
| Side heading | `Nos coordonnées` | `Our contact info` |
| Phone | `+228 XX XX XX XX` (placeholder!) | real phone |
| FAQ heading | `Questions fréquentes` | `Frequently asked questions` |

**Fix:** Wrap all `pages/views.py:contact` and `pages/forms.py` strings in `_()`. Re-extract messages: `python manage.py makemessages -l en` then translate in `locale/en/LC_MESSAGES/django.po` and run `python manage.py compilemessages`.

### P9. Contact phone is a placeholder

**Evidence:** The contact form shows `+228 XX XX XX XX` — the env var for the phone number was never set in Railway.

**Fix:** Add a real phone number to Railway env vars (e.g. `CONTACT_PHONE=+228 90 00 00 00`), or remove the phone line from the template if no phone is available.

### P10. Profile page mixed-language UI

**Evidence:** On `/en/comptes/profil/`, the page heading is `Mawulikplimi Roland Hounkpe` (correct, name) but section heading is `Informations académiques` (French). Action links mix:
- `🎓 Tableau de bord` (French — should be `Dashboard`)
- `✏️ Modifier le profil` (French — should be `Edit profile`)
- `🔐 Change password` (English — correct)
- `👋 Se déconnecter` (French — should be `Log out`)
- `⚠️ Delete my account` (English — correct)

**Fix:** Wrap strings in `comptes/templates/comptes/profil.html` in `{% trans %}`.

### P11. Staff admin panel is fully French on English locale

**Evidence:** On `/en/admin-panel/`, the entire sidebar is in French even though the rest of the site shows English:
- `🏠 Dashboard` (correct)
- `➕ Nouveau cours` → should be `New course`
- `➕ Nouvelle formation` → should be `New formation`
- `📚 Cours` → should be `Courses`
- `🎓 Formations` → should be `Formations`
- `📝 Blog / Articles` (acceptable)
- `🖼️ Médiathèque` → should be `Media library`
- `📩 Contacts` (acceptable)
- `📋 Candidatures` → should be `Applications`
- `🎓 Candidatures Mentor` → should be `Mentor applications`
- `🤝 Mentorat` → should be `Mentorship`
- `👥 Utilisateurs` → should be `Users`
- `💻 Exercices code` → should be `Code exercises`
- `🔘 Exercices QCM` → should be `MCQ exercises`
- `🔔 Notifications` (acceptable)
- `🐍 Sandbox Admin` (acceptable)
- `📊 Activité` → should be `Activity`
- `⚙️ Django Admin` (acceptable)
- `🌐 Voir le site` → should be `View site`

And inside the dashboard:
- `Bienvenue dans l'espace staff` → `Welcome to the staff space`
- `Créer un cours` → `Create a course`
- `Créer une formation` → `Create a formation`
- `Messages non lus` → `Unread messages`
- `Activité récente` → `Recent activity`
- `Statistiques clés` → `Key statistics`

Mixed-language stats cards:
- `📩 0 Unread messages` (mixed)
- `📋 0 Pending applications` (correct)
- `🧑🏫 0 Candidatures mentor` (French)
- `🤝 0 Mentorship requests` (correct)
- `👥 2 Active users` (correct)
- `📚 0 Published courses` (correct)

**Fix:** Wrap every string in `templates/admin_panel/_sidebar.html` (or wherever the sidebar partial is) and `templates/admin_panel/dashboard.html` in `{% trans %}`. Then run `makemessages` + translate.

### P12. Dashboard (`/en/comptes/tableau-de-bord/`) has the Python sandbox embedded inline

**Evidence:** The student dashboard has a full Python sandbox widget embedded inline (with `numpy`/`matplotlib`/`pandas`/`scipy`/`sympy` buttons, code editor, Run button, etc.). This appears on every dashboard load.

**Impact:**
- Heavy JS load on the most-visited student page
- Distracting — students see a code editor before their own courses
- The `Ctrl+Shift+P` floating button (visible on every page) already provides sandbox access

**Fix:** Remove the inline sandbox from `comptes/templates/comptes/tableau_de_bord.html`. Keep the floating `Ctrl+Shift+P` button only.

### P13. Dashboard action links are in French on English locale

**Evidence:** On `/en/comptes/tableau-de-bord/`:
- `Mon profil` → `My profile`
- `Actions rapides` → `Quick actions`
- `👤 Voir mon profil` → `View my profile`
- `✏️ Modifier mon profil` → `Edit my profile`
- `🔐 Changer mot de passe` → `Change password`
- `📚 Explorer les cours` → `Explore courses`
- `📝 Lire le blog` → `Read the blog`
- `💳 Mes paiements` → `My payments`
- `👋 Se déconnecter` → `Log out`
- "You are not enrolled in any course" → `Explorer les cours →` (button still in French)

### P14. Admissions page heading is French on English locale

**Evidence:** `/en/admissions/` shows `Rejoignez Numeria Institute` (French) as the main heading. Should be `Join Numeria Institute`.

---

## MEDIUM — fix when you can

### P15. Home page has duplicate "Why choose Numeria?" sections

**Evidence:** On the home page, the section `Why choose Numeria?` appears twice:
1. First occurrence with 3 cards: `Quality courses`, `Accessible everywhere`, `Free to start`
2. Second occurrence (labelled `NOS ATOUTS`) with 5 cards: `Quality courses`, `African roots`, `100% responsive`, `Official certificates`, `Interactive exercises`, `Accessible to all`

These look like leftover duplicates from a redesign. The second section also has a typo/duplicate text:
> "Multiple-choice questions with detailed answers visible only after passing.**Multiple-choice questions with detailed solutions revealed only after success.**"

Two sentences stuck together — looks like a copy-paste during translation that didn't fully replace the original.

**Fix:** Delete the first (smaller) "Why choose Numeria?" section. Fix the duplicated MCQ sentence.

### P16. Home page stats show "0 Available courses"

**Evidence:** The hero stats block shows:
- `2+ Enrolled students`
- `0 Available courses` ← problem
- `5 Countries represented`

The "0" is because the catalogue page is broken (P2) so no courses can be published. But also the stat counter probably counts `Course.objects.filter(status='published').count()` which is genuinely 0. Either publish some courses, or hide the stat when it's 0.

### P17. "Année de création" on the English about page

**Evidence:** `/en/a-propos/` shows `2025` labelled as `Année de création` (French). Should be `Year founded` or `Year established`.

### P18. `nav` link "Candidatures" is awkward in English

**Evidence:** The English nav shows `Applications` for `/admissions/`. That's fine. But on the French nav, it shows `Candidatures`. This is actually correct — just noting it works.

### P19. `numeriainstitude@gmail.com` typo in footer

**Evidence:** Every page footer shows the contact email as `numeriainstitude@gmail.com`. The correct spelling is `numeriainstitute@gmail.com` (with an `e` before the `@`). The typo is also in `settings.py:272, 302` as the default for `CONTACT_EMAIL` / `ADMIN_EMAIL`.

**Fix:** Either register the correct Gmail address, or update all references to use the actual `numeriainstitute@gmail.com` (and update the Railway env var).

### P20. `robots.txt` disallows `/admin/` but not `/numeria-staff-portal/`

**Evidence:** `https://numeria-institute-production.up.railway.app/robots.txt` shows:
```
Disallow: /admin/
```
But your actual admin URL is `/numeria-staff-portal/` (custom path). Google can index your admin login page.

**Fix:** Update `pages/views.py:robots_txt` to include `Disallow: /numeria-staff-portal/`.

### P21. No `Content-Security-Policy` header

**Evidence:** Response headers show:
- ✅ `strict-transport-security: max-age=31536000; includeSubDomains; preload` (HSTS — good)
- ✅ `x-frame-options: DENY` (good)
- ✅ `x-content-type-options: nosniff` (good)
- ✅ `referrer-policy: strict-origin-when-cross-origin` (good)
- ✅ `cross-origin-opener-policy: same-origin` (good)
- ❌ No `content-security-policy` header
- ❌ No `permissions-policy` header

**Impact:** Without CSP, any XSS that slips through can load scripts from any origin, exfiltrate cookies, etc.

**Fix:** Add `django-csp` and a strict policy. (This is finding **H6** from my earlier review — not yet fixed.)

### P22. Cookie has no `Secure` flag

**Evidence:** The `set-cookie` header on `/fr/`:
```
set-cookie: csrftoken=7MR3mQFG9YAE437tanFX6YmukWRwUyrh;
  expires=Sat, 19 Jun 2027 13:10:34 GMT;
  Max-Age=31449600;
  Path=/;
  SameSite=Lax
```
No `Secure` flag — the cookie can be sent over HTTP. This is finding **L2** from my earlier review: `SESSION_COOKIE_SECURE = not DEBUG` and `CSRF_COOKIE_SECURE = not DEBUG`. Since `DEBUG=True` in production (P1), cookies are insecure.

**Fix:** Fix P1 first (set `DEBUG=False`). That automatically enables `Secure` on cookies.

---

## LOW — backlog

### P23. `2+ Enrolled students` claim is unverified

The hero stats show `2+ students` and `2 Enrolled students` — looks like the count of actual users in the DB rather than a real enrollment count. If you only have 2 test users, showing "2+" as a marketing stat is misleading. Either hide stats below a threshold (e.g. <50), or replace with content-focused stats ("6 modules", "100+ lessons", etc.).

### P24. Sitemap only contains the French homepage

**Evidence:** `https://numeria-institute-production.up.railway.app/sitemap.xml` shows only one URL: `https://numeria-institute-production.up.railway.app/fr/`. The `CoursSitemap` and `ArticleSitemap` return empty because there are no published courses or articles. Not a bug per se, but Google Search Console will see a near-empty sitemap.

### P25. Testimonials look hardcoded

**Evidence:** Home page shows two testimonials:
- `Marie K., Master's student: "The courses are excellent and adapted to our African context."`
- `Jean T., Professor: "Finally a platform that understands our educational needs."`

With only 2 enrolled students (per stats), these testimonials are presumably fabricated. Consider removing until you have real ones, or marking them as illustrative.

### P26. "POPULAR COURSES" section shows "No courses available at the moment."

The home page "Start learning today" section heading is `POPULAR COURSES` but the body says `No courses available at the moment.` — followed by a `View all courses →` button that leads to a 500 page (P2). Either publish courses or hide this section.

### P27. Sandbox floating button is on every page

The `🐍 Sandbox Python` floating button (`Ctrl+Shift+P`) is rendered on every page including login, register, password reset, privacy policy, TOS. It should probably only appear for authenticated users on app pages, not on marketing/legal pages.

### P28. Analytics dashboard reachable from main nav for any logged-in user

**Evidence:** The nav shows `📊 Analytics` link to `/analytics/` for any logged-in user (I see it as superuser, but the link is in the main nav template). The view is `@staff_member_required` (per the code review), so non-staff will get redirected to admin login — but the link shouldn't be visible to non-staff in the first place.

**Fix:** Wrap the `📊 Analytics` nav item in `{% if request.user.is_staff %}` in `templates/base.html`.

---

## Summary table

| ID | Severity | Issue | Page |
|----|----------|-------|------|
| P1 | CRITICAL | `DEBUG=True` in production — leaks source/URLs/paths | all error pages |
| P2 | CRITICAL | `/cours/` catalogue is a 500 in both languages | `/en/cours/`, `/fr/cours/` |
| P3 | CRITICAL | Tailwind CSS loaded from CDN in production | all pages |
| P4 | HIGH | Mentorat notification link is 404 (`tableau-de-bord-mentee` vs `tableau-bord-mentee`) | in-app notification |
| P5 | HIGH | `/visio/` index has no route — no landing page for video meetings | `/en/visio/` |
| P6 | HIGH | `Mode sombre` button label not translated | header on every page |
| P7 | HIGH | `Sandbox Python` button label not translated | header on every page |
| P8 | HIGH | Contact form is a bilingual mess (mixed FR/EN on EN locale) | `/en/contact/` |
| P9 | HIGH | Contact phone is `+228 XX XX XX XX` placeholder | `/en/contact/` |
| P10 | HIGH | Profile page mixes FR/EN | `/en/comptes/profil/` |
| P11 | HIGH | Staff admin panel is fully French on EN locale | `/en/admin-panel/` |
| P12 | HIGH | Python sandbox embedded inline in student dashboard | `/en/comptes/tableau-de-bord/` |
| P13 | HIGH | Dashboard action links not translated | `/en/comptes/tableau-de-bord/` |
| P14 | HIGH | Admissions heading `Rejoignez Numeria Institute` on EN locale | `/en/admissions/` |
| P15 | MED | Home page has duplicate "Why choose Numeria?" sections + duplicated MCQ sentence | home |
| P16 | MED | "0 Available courses" stat | home |
| P17 | MED | `Année de création` on EN about page | `/en/a-propos/` |
| P19 | MED | Email typo `numeriainstitude@gmail.com` (missing `e`) | footer on every page |
| P20 | MED | `robots.txt` doesn't disallow actual admin URL | `/robots.txt` |
| P21 | MED | No CSP header | all pages |
| P22 | MED | CSRF cookie has no `Secure` flag (caused by P1) | all pages |
| P23 | LOW | "2+ students" stat looks like test data | home |
| P24 | LOW | Sitemap only contains the French homepage | `/sitemap.xml` |
| P25 | LOW | Testimonials look fabricated | home |
| P26 | LOW | "POPULAR COURSES" section shows "No courses available" + link to 500 | home |
| P27 | LOW | Sandbox floating button on every page including legal pages | all pages |
| P28 | LOW | Analytics link visible to non-staff in main nav | header |

---

## Recommended action order

### Today (1-2 hours)
1. **P1** — Set `DEBUG=False` in Railway env vars and redeploy. This single change fixes P22 (cookie Secure flag) and stops source-code leaks.
2. **P19** — Fix the `numeriainstitude@gmail.com` typo to `numeriainstitute@gmail.com` everywhere (or register the typo'd address).
3. **P20** — Add `Disallow: /numeria-staff-portal/` to `robots.txt`.

### This week (1-2 days)
4. **P2** — Fix the `cours/catalogue.html` template/view mismatch so the courses page stops 500ing. Without this, no one can browse courses.
5. **P4** — Fix the mentorat notification link with `reverse('mentorat:tableau_de_bord_mentee')`.
6. **P5** — Add a `/visio/` index route.
7. **P9** — Set the `CONTACT_PHONE` env var or remove the phone line from the contact template.
8. **P3** — Set up Tailwind as a build step (removes 28+ console warnings, faster page loads, better SEO).

### Next 2-3 weeks (i18n cleanup — one big batch)
9. **P6, P7, P8, P10, P11, P13, P14, P17** — All i18n issues. The fix is the same workflow for all of them:
   - Wrap every bare French string in `{% trans "..." %}` (templates) or `_("...")` (views/forms)
   - Run `python manage.py makemessages -l en` to extract
   - Translate the new entries in `locale/en/LC_MESSAGES/django.po`
   - Run `python manage.py compilemessages`
   - Redeploy
   This is roughly 1-2 days of work for one developer.

### Later (product polish)
10. **P12, P15, P16, P23, P24, P25, P26, P27, P28** — UX/quality issues that become visible once the i18n and 500 errors are fixed.

### After all the above
11. **P21** — Add CSP header (do this last, after the Tailwind build is in place, so you can lock down `style-src` properly).

---

## What's working well

To end on a positive note — these things are working correctly in production:

- ✅ Login flow works (I logged in successfully)
- ✅ `/paiements/historique/` works (my fix from the previous batch is deployed and functional) — was a 500 before, now 200
- ✅ `/admin-panel/` staff dashboard works and is fast
- ✅ `/numeria-staff-portal/` Django admin works
- ✅ Dark mode toggle works (button is functional even though label isn't translated)
- ✅ Language switcher works (🇫🇷/🇬🇧 buttons switch locale)
- ✅ HSTS preload is active
- ✅ X-Frame-Options DENY is set
- ✅ HTTPS is enforced at the Railway edge
- ✅ Sitemap.xml is reachable
- ✅ robots.txt is reachable
- ✅ CSRF protection is active
- ✅ The `RatelimitedPasswordResetView` is in place (rate-limited)
- ✅ Session cookie is HttpOnly + SameSite=Lax

The fixes from my previous PR (sandbox aside) are deployed and working. The remaining issues are mostly i18n discipline (which the code review flagged as M5/M8) and the `DEBUG=True` configuration error.
