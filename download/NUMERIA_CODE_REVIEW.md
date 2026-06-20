# Numeria Institute — Full Code Review

**Repo:** `github.com/mawuliro/numeria-institute` (private, `main` branch, commit `34f403f`)
**Stack:** Django 6.0.5 · Channels 4.1 · django-axes 8.3.1 · django-ratelimit 4.1.0 · Cloudinary · Resend email · Railway (4 uvicorn workers)
**Codebase:** ~17,000 lines of Python across 16 apps · 92 templates · 16 migrations · 9 test files (most empty)
**Review date:** 2026-06-20

---

## TL;DR — what you must improve

The platform is feature-rich (courses, paid formations, mentorat with escrow, visioconference with WebRTC, blog, analytics, admissions, admin panel) and the security *basics* are better than most Django projects I see (Axes + ratelimit + signed email tokens + HSTS + X-Frame-Options + Cloudinary media + no secrets in repo). But there are **4 critical issues that need to ship today** and a long tail of maintainability debt.

### Ship-blockers (do these this week)

| # | Issue | Why it's urgent |
|---|-------|-----------------|
| **S1** | **Sandbox payment provider exposed to all users in production** (`paiements/constants.py:7`) | Any logged-in user can enroll in any paid course / formation / mentorat session **for free**. Direct revenue loss. The whole monetisation layer is bypassable. |
| **S2** | **Code-exercise grading trusts client-supplied `is_correct`** (`cours/views.py:420-484`) | Students can mark every code exercise as solved with a single crafted POST → inflated grades & certificates. Academic integrity broken. |
| **S3** | **`/paiements/historique/` is a 500** (`paiements/views.py:201`) | `select_related('course')` should be `'cours'`; `p.montant` should be `p.montant_final`. Verified. Every student visiting "Mes paiements" crashes. |
| **S4** | **`/paiements/confirmation/` and `/paiements/page_paiement/` templates reference non-existent fields** | Post-payment receipts render blank course name, blank amount, blank session name. Verified. Students see an empty receipt after paying. |
| **S5** | **WebRTC is broken in production with 4 workers** (`settings.py:107-111` + `railway.json:7`) | `InMemoryChannelLayer` + class-level state on `MeetingConsumer` + 4 uvicorn workers means cross-worker signalling silently no-ops. Any meeting with >2 participants across workers breaks. Switch to `channels_redis`. |
| **S6** | **`mentorat/views.py` references undefined `logger`** (`mentorat/views.py:376, 391`) | Verified. Inside `except Exception as e:` blocks. Approve/reject mentor application crashes with `NameError` whenever Resend email API fails — exactly when you need logging. 1-line fix. |
| **S7** | **Verification email auto-logs user in** (`comptes/views.py:71`) | Anyone who obtains the verification URL (24h validity) gets a passwordless login. Drop the `login()` call. |

### High-value refactors (next 2-4 weeks)

- **Payment service duplication** — same 120-line `initier_paiement` / `traiter_paiement` boilerplate copy-pasted across `cours`, `formation`, `mentorat`, and `admissions` (the last one bypasses the service layer entirely and creates `Paiement` rows by hand).
- **291-line god function** `_handle_exercise_creation` in `admin_panel/views.py:1020-1307` with a dead 110-line `grouped` branch that creates orphan rows then errors.
- **9 god functions >80 lines** (4 in admin_panel). Extract `ModelForm`s and `model.transition_to()` methods.
- **75 `except Exception:` blocks, 13 silently `pass`** — including payment-notification, candidacy-email, and staff-audit-log failures. Bugs are invisible in production.
- **`LOGGING` root level = WARNING** — drops every `logger.info(...)`. Email-success logs and fraud/escrow logs in `mentorat/anti_fraude.py` never reach stdout.
- **No CSP, no Permissions-Policy headers** — any XSS that slips through immediately becomes full account takeover.
- **Bleach allowlist includes `<iframe>` and global `style` attribute** (`cours/templatetags/content_filters.py:14-32`) → stored XSS vector via lesson content.
- **Account deletion cascades to `Paiement` rows** (`on_delete=CASCADE`) — destroys financial/tax audit trail. OHADA requires 10-year retention.
- **Tests**: 10 of 13 `tests.py` files are 3-line stubs. ~2% coverage. No CI config. No `pytest.ini`. You cannot safely refactor without tests.

### Hygiene backlog

- `staticfiles/` (1.8 MB) + `messages.mo` committed to git; neither in `.gitignore`
- 37 of 136 `messages.*()` calls not wrapped in `_()` — English-locale users see French mixed with English
- 23 hardcoded `/fr/admin-panel/...` URLs in 3 templates — break for English-locale staff
- 7 unused top-level imports across 4 files
- 4 `log_staff_action` calls use wrong `action_type='notification_sent'` (copy-paste from notification view)
- Admin URL `/numeria-staff-portal/` hardcoded in source — move to env var, add `Disallow:` to robots.txt
- `print()` debug statements in `comptes/views.py:215, 244`
- No `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `DEPLOY.md`
- 3 non-reversible migrations (`reverse_code=RunPython.noop`) — `migrate --reverse` will silently leave DB inconsistent

---

## Project snapshot

### Apps (16)

| App | Purpose | Notable files |
|-----|---------|---------------|
| `pages` | Public pages (home, about, contact, privacy, robots, sitemap) | `views.py` (218 LOC) |
| `cours` | Course catalogue, lessons, exercises (MCQ, code, fill-blank, drag-drop), progress | `views.py` (882 LOC), `views_grades.py` (192) |
| `formation` | Paid formations (cohort-based, with sessions) | `views.py` (75) |
| `comptes` | Auth (registration, login, password reset, profile, account deletion) | `views.py` (295), `tests.py` (144 — real) |
| `paiements` | Payment service layer + provider integrations (sandbox + 5 stubs) | `views.py` (208), `service.py`, `constants.py`, `models.py` |
| `admissions` | School admissions & candidacy | `views.py` (325) |
| `communaute` | Community forum | `views.py` (321) |
| `mentorat` | 1-to-1 mentorship with escrow (48h hold) + anti-fraud signature | `views.py` (772), `anti_fraude.py`, `tests.py` (140 — real) |
| `analytics` | Staff-only dashboards | `views.py` (208) |
| `blog` | CMS for articles | `views.py` (55) |
| `notifications` | In-app notification feed | `views.py` (163) |
| `admin_panel` | Staff panel (courses, formations, blog, candidatures, mentorat, sandbox) | `views.py` (1321), `views_blocks.py` (603), `views_sandbox.py` (84) |
| `visioconference` | WebRTC meeting rooms with waiting room, host moderation | `views.py` (134), `consumers.py` (439) |
| `notifications` | In-app notifications | `views.py` (163) |

### Deployment

- **Railway** with Nixpacks builder.
- **Procfile**: `web: python manage.py migrate && uvicorn numeria_project.asgi:application --host 0.0.0.0 --port $PORT --workers 1`
- **railway.json** deploy command: `python manage.py migrate && python manage.py collectstatic --noinput && gunicorn numeria_project.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 4 --timeout 120`

> ⚠️ **Inconsistency:** Procfile says `--workers 1`, railway.json says `--workers 4`. The Procfile is the fallback; Railway uses railway.json. So **4 workers** is what's actually running in production. This is what makes the WebRTC issue (S5) a real bug and not a theoretical concern.

### Stack notes

- **Django 6.0.5** (latest stable, released Oct 2025). Uses the new `STORAGES` dict format. `USE_L10N` deprecated but still tolerated.
- **Channels 4.1** with **`InMemoryChannelLayer`** — fine for local dev, broken for any multi-worker deploy.
- **Cloudinary** for media storage when `DEBUG=False` and `CLOUDINARY_URL` is set; falls back to local filesystem otherwise.
- **Resend** for transactional email (via `numeria_project/emails.py`).
- **django-axes** for brute-force protection (5 failures → 1h lockout).
- **django-ratelimit** on registration, login, password reset, contact form.

---

## Critical findings (verified)

### S1 — Sandbox payment provider exposed in production

**Files:**
- `paiements/constants.py:1-8` — `'sandbox'` provider has `'disponible': True`
- `paiements/service.py:187-192` — `process_sandbox()` immediately calls `confirmer_paiement(paiement, reference_provider='SANDBOX-TEST')` which marks the payment as `'reussi'` and grants access
- `paiements/views.py:143, 158` — `initier_paiement()` accepts user-supplied `provider` from POST
- Same flaw replicated in `admissions/views.py:99-126` and `mentorat/views.py:719-733`

**Impact:** Any registered user can enroll in any paid course, paid formation, mentorat séance, or pay candidacy fees **without paying any money**. Mentorat sessions confirmed via sandbox also trigger the 48h escrow release — Numeria would be on the hook to pay mentors for sessions that were never actually paid for.

**Fix:**
1. In `paiements/constants.py`, set `'disponible': settings.DEBUG` for the sandbox entry, or remove it entirely.
2. In `paiements/service.py:process_sandbox`, add `if not settings.DEBUG: raise NotImplementedError("Sandbox disabled in production")`.
3. Never trust client-supplied `provider` for free confirmation — derive it from a server-side allowlist.

### S2 — Code-exercise grading trusts client-supplied `is_correct`

**File:** `cours/views.py:420-484` (`submit_code_exercise`)

**Code path:** Client runs Pyodide in the browser → POSTs `{"code": "...", "is_correct": true, ...}` → server reads `body.get('is_correct')` → if True, awards full `exercise.points`, sets `is_solved = True`, fires `notify_exercise_solved`, records `ExerciseAttempt`.

**Impact:** A single crafted POST marks every code exercise as solved. Grades, progress, certificate eligibility all compromised.

**Fix:**
1. **Best:** Run code evaluation server-side (sandboxed container / restricted interpreter); compute `is_correct` from `expected_output` / `test_code` server-side.
2. **Minimum:** Sign the client result with an HMAC keyed by a server secret (similar to `mentorat/anti_fraude.py:ValidateurPaiement.generer_signature`).
3. **Floor:** Ignore `body.get('is_correct')` entirely; require server-side test execution before awarding points.

### S3 — `/paiements/historique/` is a 500

**File:** `paiements/views.py:199-208`

```python
paiements = Paiement.objects.filter(
    etudiant=request.user
).select_related('course')   # ← FieldError: Paiement has 'cours', not 'course'

contexte = {
    'paiements': paiements,
    'total_depense': sum(
        p.montant for p in paiements if p.statut == 'reussi'  # ← AttributeError: Paiement has 'montant_final', not 'montant'
    ),
}
```

Verified: `paiements/models.py:50` declares `cours = ForeignKey(...)`, line 77 declares `montant_final = DecimalField(...)`. This is post-rebuild field-rename fallout — someone renamed the model fields but didn't update the view.

**Fix:** `select_related('cours', 'formation')`; `p.montant` → `p.montant_final`. Add a smoke test that GETs `/paiements/historique/` and asserts 200.

### S4 — All three `paiements/` templates reference non-existent fields

**Files:**
- `paiements/templates/paiements/historique.html:44-60`
- `paiements/templates/paiements/confirmation.html:19-22, 39`
- `paiements/templates/paiements/page_paiement.html:3, 12, 97, 123-166, 178`

Templates reference `paiement.objet_type` (no such field), `paiement.montant` (it's `montant_final`), `paiement.formation_inscription.session.formation.titre` (model has direct `formation` FK; `Course` has `title` not `titre`). Django silently renders these as empty strings — pages load but show blank titles, amounts, session names.

**Impact:** Post-payment confirmation page and payment page show no price/course/session info. Students see a blank receipt after paying.

**Fix:** Rewrite all 3 templates against the current model. Add a `Paiement.get_objet_type()` model method. Add template-rendering tests.

### S5 — WebRTC broken with 4 Railway workers

**Files:**
- `numeria_project/settings.py:107-111` — `CHANNEL_LAYERS.default.BACKEND = 'channels.layers.InMemoryChannelLayer'`
- `visioconference/consumers.py:13-16` — class-level dicts `room_participants`, `room_peer_channels`, `channel_peer_map`, `room_waiting_requests`
- `railway.json:7` — `--workers 4`

**Why it breaks:** `InMemoryChannelLayer` only delivers messages between channels in the same Python process. With 4 workers, WebSocket connections are load-balanced randomly. `MeetingConsumer.send_to_peer()` (line 314) calls `self.channel_layer.send(channel_name, ...)` which silently no-ops if the target channel lives in another worker.

**Concrete failure modes:**
- In any meeting with >2 participants across workers, WebRTC `offer`/`answer`/`ice_candidate` signalling is dropped → peers can't connect.
- The waiting-room admit/reject flow breaks: a host on worker A cannot admit a participant whose socket is on worker B.
- Host-authorization checks (`if room.host_id != self.user.id: return`) only work for actions routed through the host's own worker — a participant on a different worker can send `mute_all` / `end_meeting` and the broadcast goes out to that worker's subset.

**Fix:**
1. Switch to `channels_redis.core.RedisChannelLayer`. Add `REDIS_URL` to Railway env.
2. Delete all class-level dicts on `MeetingConsumer`; move participant state to Redis hashes (or rely on the existing `MeetingParticipant` DB rows + a Redis pub/sub group per room).
3. Wrap capacity check + admission in `SELECT FOR UPDATE` on `MeetingRoom` to fix the TOCTOU race in `has_capacity`.

### S6 — `mentorat/views.py` references undefined `logger`

**File:** `mentorat/views.py:1` (`import logging`), `:376` and `:391` (`logger.error(...)`)

Verified: the file imports `logging` but never creates `logger = logging.getLogger(__name__)`. Lines 376/391 call `logger.error(...)` inside `except Exception as e:` blocks → `NameError: name 'logger' is not defined`, masking the original exception with a 500.

**Impact:** Mentor-application approve/reject crash with confusing 500 whenever Resend email API fails — exactly when logging is needed.

**Fix:** Add `logger = logging.getLogger(__name__)` after line 1. One line.

### S7 — Verification email auto-logs user in

**File:** `comptes/views.py:61-72` (`verify_email`)

The verification token is `signing.dumps({'user_id': user.pk}, salt=...)` with `max_age=24h`. On click, `verify_email` activates the user AND immediately calls `login(request, user, backend='django.contrib.auth.backends.ModelBackend')` — no password check, no session rotation, no rate limit.

**Impact:** Anyone who obtains the verification URL (email forwarded to shared inbox, mail provider scanning, browser history on shared computer) gets a fully authenticated session for that user for 24h after registration.

**Fix:**
1. Drop the `login()` call. After verification, redirect to the login page with a success flash.
2. Add `@ratelimit(key='ip', rate='20/h', block=True)` on `verify_email`.
3. Bind the token to a per-user nonce stored in DB so a re-issued token invalidates the previous one.
4. Reduce `EMAIL_VERIFICATION_MAX_AGE` to 1h.

---

## High-severity findings

### H1 — `paiement_seance.confirmer()` called unconditionally

**File:** `mentorat/views.py:719-733`

```python
paiement, nouveau = creer_paiement(etudiant=request.user, paiement_seance=paiement_seance, provider=provider)
paiement_seance.lier_paiement(paiement)
if paiement.statut != 'reussi':
    traiter_paiement(paiement, provider)
paiement_seance.confirmer()  # ← unconditional — no check that paiement.statut == 'reussi'
```

`paiement_seance.confirmer()` (mentorat/models.py:645-649) sets `statut = 'confirme'` with no check on `paiement.statut`. Compounds S1: any mentee can mark a paid séance as confirmed for free, and after 48h Numeria owes the mentor money that was never collected.

**Fix:** `paiement_seance.confirmer()` must refuse to run unless `self.paiement and self.paiement.statut == 'reussi'`.

### H2 — bleach allowlist includes `<iframe>` + global `style` → stored XSS

**File:** `cours/templatetags/content_filters.py:14-32`

`ALLOWED_TAGS` includes `'iframe'` and `ALLOWED_ATTRS['*'] = ['class', 'id', 'style']`. A staff-authored (or compromised-staff) lesson can embed `<iframe src="https://evil.com">` and inline CSS like `background:url(https://attacker/...)` for data exfiltration. Output is `mark_safe`'d, so this hits every enrolled student.

**Fix:**
1. Remove `'iframe'` from `ALLOWED_TAGS`. Use a dedicated `[YOUTUBE id=...]` marker expanded to a hardcoded `<iframe src="https://www.youtube-nocookie.com/embed/{id}">` template.
2. Remove `'style'` from the global `'*'` attribute list.
3. Pass `protocols=bleach.sanitizer.ALLOWED_PROTOCOLS` explicitly to scrub `javascript:` URLs.
4. Add a Content-Security-Policy header (see H6).

### H3 — Staff-authored `text_content` rendered with `|safe` in admin preview → admin-to-admin XSS

**Files:**
- `templates/admin_panel/blocks/block_preview.html:7` — `{{ block.text_content|safe }}`
- `templates/admin_panel/blocks/block_preview.html:34` — `{{ block.exercise.instructions|safe }}`
- `templates/admin_panel/cours_preview.html:58` — `{{ block.content|safe }}`
- `formation/templates/formation/voir_lecon.html:66` — `{{ lecon.contenu_html|safe }}` (field doesn't exist on the model)

A staff user (or attacker who CSRF'd a staff session) can input `<script>...</script>` and have it execute in another staff member's browser on the preview page → escalation to full admin compromise.

**Fix:** Pipe all `text_content` / `instructions` through the `render_content` filter from `content_filters.py` instead of `|safe`.

### H4 — 291-line god function `_handle_exercise_creation` + dead `grouped` branch

**File:** `admin_panel/views.py:1020-1307`

One dispatcher handles 7 exercise types + a dead `grouped` branch (lines 1178-1289, ~110 lines that create orphan `MCQExercise`/`FillBlankExercise` rows then unconditionally error at line 1288). Each branch hand-parses `request.POST.get(...)` with no `Form`, no validation, ad-hoc `int(...)` coercion. Wrapped in a catch-all `except Exception as e: messages.error(...)` that flattens all errors into a user-facing string with no logging.

**Fix:**
1. Extract one `ModelForm` per exercise type in `cours/forms_exercises.py`.
2. Replace with a 30-line dispatcher.
3. Delete the dead `grouped` branch (it's creating orphan rows on every attempt — no `transaction.atomic()`).
4. Replace catch-all with `logger.exception(...)`.

### H5 — Payment-init boilerplate duplicated across 4 sites; admissions bypasses service layer

**Files:**
- `paiements/views.py:88-131` and `:134-177` (course + formation)
- `mentorat/views.py:719-750`
- `admissions/views.py:99-146` (drift — hand-rolls `Paiement.objects.create(statut='reussi', provider='sandbox', ...)`)

Same 6-step pattern copy-pasted ~120 lines across 4 modules. Admissions doesn't use `creer_paiement`/`traiter_paiement` at all — bypasses the service layer: no idempotency, no `frais_plateforme`, no IP/user-agent logging.

**Impact:** Any bug fix (e.g. sandbox-gate from S1) must be applied in 4 places; admissions already out of sync and most dangerous (marks payments `reussi` with no service-layer guard).

**Fix:** Create `paiements/service.py:init_payment(...)` + `process_payment(...)`; all 4 call sites become 5-line wrappers; delete admissions' hand-rolled `Paiement.objects.create`.

### H6 — No CSP, no Permissions-Policy headers

**File:** `numeria_project/settings.py` (entire file)

HSTS, X-Frame-Options, SECURE_CONTENT_TYPE_NOSNIFF, SECURE_REFERRER_POLICY are set (good). But there is no Content-Security-Policy, no Permissions-Policy. Without CSP, any XSS that slips through (H2, H3, or the SVG-photo vector) immediately becomes full account takeover.

**Fix:**
1. Install `django-csp` and add a strict policy: `default-src 'self'`, `script-src 'self' 'nonce-...'`, `style-src 'self' cdn.tailwindcss.com`, `img-src 'self' data: res.cloudinary.com`, `frame-src www.youtube-nocookie.com player.vimeo.com`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`.
2. Add `PERMISSIONS_POLICY = {'camera': '(self)', 'microphone': '(self)', 'geolocation': '()'}`.
3. Add `SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin'` and `SECURE_CROSS_ORIGIN_EMBEDDER_POLICY = 'credentialless'` (Django 6 supports these).

### H7 — 75 `except Exception:` blocks; 13 silently `pass`

**Files:** 25 files. Top offenders: `admin_panel/views_blocks.py` ×8, `cours/views.py` ×7, `admin_panel/views.py` ×7, `numeria_project/emails.py` ×9. Silent `pass` at `paiements/views.py:35`, `admissions/views.py:310,321`, `admin_panel/utils.py:13`, `cours/grades.py:101`, `cours/views.py:615`, etc.

Bugs in payment notifications, candidacy emails, staff-action logging, Cloudinary operations are invisible — no log, no Sentry, no metric.

**Fix:** Replace `except Exception: pass` with `except Exception: logger.exception(...)`; use `except (json.JSONDecodeError, ValueError, TypeError):` for JSON parsing; add `flake8-blind-except` to CI.

### H8 — `LOGGING` root level = WARNING drops all `logger.info(...)`

**File:** `numeria_project/settings.py:321-324`

App modules inherit root WARNING; no explicit app loggers defined. 9 email-success logs in `numeria_project/emails.py` and 2 fraud/escrow logs in `mentorat/anti_fraude.py:218,230` (`'PAIEMENT DÉBLOQUÉ #...'`, `'PAIEMENT CONTESTÉ PAR MENTOR #...'`) never reach stdout.

**Fix:** Add explicit app loggers at `'INFO'` for `numeria_project`, `mentorat`, `paiements`, `admin_panel`, `cours`, `comptes` with `propagate: False`.

### H9 — Anemic models — state transitions hand-rolled in 2 views with divergent side effects

**Files:** `admin_panel/views.py:233-341` (`candidature_action`), `admissions/views.py:293-326` (`changer_statut`)

`Candidature` has no `transition_to()` method. Two views mutate `Candidature.statut` directly with **divergent side effects**: `admin_panel.views.candidature_action` sends email + notification + writes `StaffActivityLog`; `admissions.views.changer_statut` does none of that. Same state change via two paths → bugs (candidature accepted via admissions panel sends no email).

**Fix:** Add `Candidature.transition_to(action, by_user, notes, rejection_reason)` centralizing statut + timestamps + reviewer + email + notification + audit-log; both views call it.

### H10 — N+1 in `exercise_results_csv` — up to 5000 extra queries per export

**File:** `admin_panel/views.py:898-913`

Loop over `ExerciseAttempt.objects.filter(...).select_related('student')[:5000]` with `CodeExercise.objects.filter(pk=attempt.exercise_id).first()` inside the loop → 5001 queries worst case. Staff "Export CSV" likely times out Railway request (30s) and degrades shared Postgres.

**Fix:** `ex_titles = dict(CodeExercise.objects.filter(id__in=ex_ids).values_list('id','title'))` before the loop → 2 queries total.

### H11 — Profile photo upload has no server-side type/size validation (SVG XSS)

**Files:** `comptes/models.py:18-23` (`photo = CloudinaryField(...)`), `comptes/forms.py:194-199` (only `accept='image/*'` client-side)

No `FileExtensionValidator`, no `validate_image` validator, no `max_upload_size` check. SVG is an image — an SVG containing `<script>` will be served inline by Cloudinary and execute in the user's browser when the photo URL is opened directly.

**Fix:**
1. Add `validators=[FileExtensionValidator(['jpg','jpeg','png','webp'])]` to `Profil.photo`.
2. Add a `validate_image_size(value)` validator (e.g. 2 MB max).
3. Configure Cloudinary `resource_type='image'` with `format='jpg'` to force rasterization.

### H12 — `gerer_demande` mutates state on GET (CSRF)

**File:** `mentorat/views.py:508-547`, `mentorat/urls.py:21`

`gerer_demande` accepts URL-path `action` (`accepter`/`refuser`) and immediately calls `demande.accepter()` / `demande.refuser()` — no `if request.method == 'POST':` guard, no CSRF check. Any logged-in mentor who is tricked into loading `<img src="https://numeria.app/mentorat/demande/42/accepter/">` will silently accept the demand.

**Fix:** Change URL to require POST; read `action` from `request.POST`; add `if request.method != 'POST': return HttpResponseNotAllowed(['POST'])`.

### H13 — Account deletion cascades to `Paiement` rows — destroys audit trail

**Files:** `comptes/views.py:282-294` (`supprimer_compte`), `paiements/models.py:48` (`etudiant = ForeignKey(User, on_delete=CASCADE)`)

`request.user.delete()` cascades through every payment record — reference, amount, provider, IP, user-agent, date destroyed. OHADA (francophone Africa accounting standard) requires 10-year retention.

**Fix:**
1. Change `Paiement.etudiant` to `on_delete=models.SET_NULL, null=True` and add immutable `etudiant_email_snapshot = models.EmailField()` + `etudiant_username_snapshot` captured at payment creation.
2. Add a `User.deleted_at` soft-delete flag instead of hard `user.delete()`; replace `supprimer_compte` with anonymization.

---

## Medium & low findings (summary table)

| ID | Sev | Title | Primary location |
|----|-----|-------|------------------|
| M1 | MED | `resend_verification_email` not rate-limited → email bombing | `comptes/views.py:75-90` |
| M2 | MED | Admin URL `/numeria-staff-portal/` hardcoded; not in robots.txt Disallow | `settings.py:260`, `urls.py:62` |
| M3 | MED | Visioconference room passwords stored in clear text | `visioconference/models.py:20`, `views.py:47` |
| M4 | MED | Duplicate `class Migration` in `formation/migrations/0002_recreate_tables.py:13-18` (dead) | — |
| M5 | MED | 3 RunPython migrations non-reversible (`reverse_code=RunPython.noop`) | `cours/migrations/0002,0003`, `formation/migrations/0002` |
| M6 | MED | Hardcoded `/fr/admin-panel/` URLs (23 occurrences) in 3 templates | `cours_edit.html`, `formation_edit.html`, `full_sandbox.html` |
| M7 | MED | `staticfiles/` (1.8 MB) + `messages.mo` committed; not gitignored | repo root, `.gitignore` |
| M8 | MED | 37 of 136 `messages.*()` calls not wrapped in `_()` | `communaute/`, `paiements/`, `admin_panel/`, etc. |
| M9 | MED | `catalogue.html` expects 5 context vars view doesn't provide | `cours/templates/cours/catalogue.html` |
| M10 | MED | Forms layer anemic — 7 admin endpoints hand-roll POST | `admin_panel/views.py:776-809, 949-968, 1020-1307` |
| M11 | MED | Consumer class-level mutable state + TOCTOU capacity race | `visioconference/consumers.py:13-16, 95-150` |
| M12 | MED | Block ordering: `count()` collision + non-atomic reorder loop | `admin_panel/views_blocks.py:106, 159, 117-126` |
| M13 | MED | `print()` debug statements in `comptes/views.py:215, 244` | — |
| L1 | LOW | f-string SQL in 3 migration files (no runtime risk) | `cours/migrations/0002,0003`, `formation/migrations/0002` |
| L2 | LOW | Cookie-secure flags coupled to `DEBUG` | `settings.py:295-296` |
| L3 | LOW | `SECURE_SSL_REDIRECT=False` relies on Railway edge TLS | `settings.py:286-287` |
| L4 | LOW | 7 unused top-level imports across 4 files | `mentorat/views.py:1`, `comptes/views.py:2,13`, etc. |
| L5 | LOW | 4 `log_staff_action` calls use wrong `action_type='notification_sent'` | `views_cours.py:127,161`, `views.py:729,759` |
| L6 | LOW | 10/13 test files 3-line stubs; no CI config; no `pytest.ini` | — |
| L7 | LOW | No `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `DEPLOY.md` | repo root |
| L8 | LOW | `_post_payment_actions` swallows exceptions silently | `paiements/views.py:18-36` |
| L9 | LOW | `Procfile` says `--workers 1`, `railway.json` says `--workers 4` — inconsistent | `Procfile`, `railway.json` |

---

## What's good (positive findings)

Don't lose these while refactoring:

- **Auth hardening** — Axes brute-force protection (5 attempts → 1h lockout) + django-ratelimit on registration / login / password reset / contact. Login redirect uses `url_has_allowed_host_and_scheme` to prevent open redirect.
- **No secrets in repo** — scanned for `ghp_`, `sk_live`, `AKIA`, `xoxb-`, `glpat-`, JWT patterns, `SECRET_KEY=...`, `PASSWORD=...`, `API_KEY=...` — no matches. `.env.example` has only placeholders.
- **No `@csrf_exempt`** anywhere. No `eval()` / `exec()` / `pickle.loads()` / `os.system()` / `shell=True` in app code.
- **No `.raw()` or `.extra()` ORM calls** — only raw SQL is in 3 migration files with hardcoded identifiers (low risk).
- **Email tokens** properly signed with `django.core.signing.dumps` + salt + `max_age`.
- **Contact reply** strips CRLF from subject and validates recipient email — prevents header injection.
- **MCQ grading** is server-side; submitted choice IDs are validated against the exercise.
- **HSTS** preloaded for 1 year with subdomains. **X-Frame-Options=DENY**. **SECURE_CONTENT_TYPE_NOSNIFF**. **SECURE_REFERRER_POLICY=strict-origin-when-cross-origin**.
- **Cookies** secured (`SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SAMESITE=Lax`) when `DEBUG=False`.
- **All admin_panel views** are decorated with `@staff_only`; all state-changing endpoints additionally have `@require_POST`.
- **Cloudinary** media storage (no local file handling in production).
- **`.gitignore`** correctly excludes `.env`, `*.sqlite3`, `media/`.
- **i18n** is bilingual fr/en with `i18n_patterns` (most strings wrapped, see M8 for the gaps).
- **Sitemap + robots.txt** present.
- **Real test files** in `comptes/tests.py` (144 LOC) and `mentorat/tests.py` (140 LOC) — a foundation to build on.

---

## Recommended remediation order

### Week 1 — ship-blockers
1. **S1** — disable sandbox in production (1-hour fix, biggest revenue impact).
2. **S3 + S4** — fix broken `paiements` views + templates (half-day, students currently see 500s and blank receipts).
3. **S6** — 1-line `logger = logging.getLogger(__name__)` in `mentorat/views.py`.
4. **S7** — drop `login()` call from `verify_email` (1-line fix).
5. **S5** — switch to `channels_redis` (1-2 days including Redis setup on Railway).

### Week 2 — integrity & security
6. **S2** — server-side grading (largest effort, biggest integrity win; 3-5 days).
7. **H1** — `paiement_seance.confirmer()` check (1-line).
8. **H2 + H3 + H6** — tighten bleach allowlist, route all `|safe` content through `render_content`, add CSP. 2 days.
9. **H11** — profile photo validators (1 hour).
10. **H12** — `gerer_demande` POST-only (1 hour).
11. **H13** — payment record retention (1 day).

### Weeks 3-4 — refactors
12. **H5** — payment service consolidation (2-3 days).
13. **H4** — extract exercise forms + delete dead `grouped` branch (3-4 days).
14. **H9** — `Candidature.transition_to()` model method (1 day).
15. **H7 + H8 + M13** — replace `except Exception: pass` with `logger.exception(...)`; add app loggers at INFO; remove `print()` (1 day).
16. **H10** — CSV N+1 fix (15 minutes).

### Weeks 5+ — hygiene
17. **M1-M13** — i18n, hardcoded URLs, gitignore, migrations, catalogue drift, forms layer.
18. **L1-L9** — unused imports, log action_types, README/ARCHITECTURE, Procfile consistency.
19. **L6** — add tests for everything you touched in weeks 1-4. Add `pytest-django`, CI workflow, `pytest.ini`. Without this, the next refactor will reintroduce bugs.

---

## Next steps

1. **Revoke the GitHub PAT you shared with me** — `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`. Tokens shared in chat should be considered compromised. I've already stripped it from the local clone's `git remote` URL, but you should still rotate it.
2. **Start with S1** — it's a 1-hour fix that closes the biggest revenue leak. Disable the sandbox provider in production.
3. **Add tests before refactoring** — the codebase is at ~2% coverage. The `paiements` field-rename bug (S3) would have been caught by a single GET smoke test. Add `pytest-django` and a `tests/test_smoke.py` covering every URL pattern as a safety net before any major refactor.
4. **Pick one critical fix to ship today** and let me know if you want me to draft the patch.

Full detailed findings (with line-by-line evidence) for both the security audit and the code-quality audit are persisted in `/home/z/my-project/worklog.md`. This consolidated report is saved at `/home/z/my-project/download/NUMERIA_CODE_REVIEW.md`.
