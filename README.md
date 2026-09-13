# Senpa Delta — ONYX connection restoration R3

## Installation
Upload the contents of this folder to the existing repository/project root, replacing existing files. Keep api, build, static and img folders. Redeploy the existing Vercel project and reload with Ctrl+F5. Select EU - ONYX.

## Verified source findings
- The uploaded tracker pointed to eu.mi.com:2001; the supplied ONYX menu points to eu.senpa.io:2001. The tracker now uses that ONYX endpoint. This does not establish that the endpoint is Delt.io ffaeu2.
- Both builds use the identical bundle.wasm SHA-256: c0ae1dba9f1f8b232b8c88cf13b5ccef4b880b977f76c6f44a773a44f06c7849. Replacing it would have no effect.
- ONYX spawn sends [0, playerSlot], with nickname sent separately by playerInfo. Removed the incompatible nickname-plus-ASCII-0 spawn payload in this build.
- Restored the reference ?password= query, encoding a supplied password.
- Spawn requests on a connecting socket wait for the handshake event instead of relying on a one-second timer. Requests clear on disconnect/cleanup.
- Multibox uses the current connection URL rather than stale storage. Player-slot toggle no longer passes a slot as a connection ID.
- Migrates only the old senpaio:server endpoint; other saved settings remain.

## Files changed
api/tracker.js, build/senpaobs.js, index.html, restore-server.js (new), README.md.
The existing engine, renderer and assets are retained. The reference engine loader targets a different UI and is not a drop-in replacement. No auth helper or embedded account token was imported from the reference.

## Validation and limits
Local assertions passed for ONYX spawn bytes, both connection IDs, dual player-slot bytes, preventing duplicate spawn for a live slot, delayed handshake, duplicate handshake, invalid input, saved endpoint migration and tracker GET/405 behavior. Modified JavaScript passed syntax checks.

Live DNS resolution failed in this environment for both eu.mi.com and eu.senpa.io (temporary name-resolution failure). This does not prove either domain is globally unavailable. Browser smoke testing could not run because Chromium is not installed. Actual connection, authentication, spawn, multibox gameplay and physics remain unverified. Client metadata does not change server physics. This archive is a source-grounded repair candidate, not a claim of verified live gameplay.

## R2 captcha diagnosis
The user screenshot confirms the WebSocket opened to eu.senpa.io:2001. Turnstile then returns 110200 (domain not authorized). Cloudflare requires the widget owner to authorize the deployment hostname in Turnstile > Settings > Hostname Management. This archive cannot perform that account-side change.

R2 keeps a readable error visible for 110200 instead of silently hiding the captcha. It never submits an empty or fabricated token. Removed a duplicate captcha-overlay element: React already creates it. Server display name is now EU - ONYX.

Official reference: https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/

## R3: deployed ONYX comparison
Fetched https://ffadual.vercel.app/ and its engine/auth scripts. Both scripts match the uploaded reference byte-for-byte. ONYX sends the token returned by ONYXAuth after handshake; its auth helper auto-seeds an embedded account credential. R3 does NOT reuse that credential. It loads a sanitized helper for the user's own Senpa token, with a SENPA account button. Token saved means stored locally, not verified by the server. Reload after saving your own token. Do not share tokens in chat.

Turnstile response now uses kind 2 as in ONYX. Captcha requests from both sockets reach the UI with their connection ID; responses go to that connection. These fix protocol differences but cannot authorize a hostname or guarantee gameplay. Error 110200 remains an account-side hostname rejection if the server requires that challenge.

Tests: spawn regressions, authentication packet format and no-token behavior, captcha packet kind and target connection, JavaScript syntax. No live gameplay verified.
