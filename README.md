# Yulu Telecaller Dashboard — Website

A static site (no build step) that talks directly to the Supabase project
(`knnmfgmmlrcetejaktox`) using the public anon key, same as the dashboard
you were using as a Claude Artifact.

## Deploying

1. Upload `index.html` to your GitHub repo (`yulu-telecaller-dashboard`)
   via the web UI: open the repo → **Add file → Upload files** → drag
   `index.html` in → **Commit changes**.
2. Go to netlify.com, sign up/log in, **Add new site → Import an existing
   project → Deploy with GitHub**, pick this repo.
3. Leave the build command blank and the publish directory as `.` (or `/`)
   — there is nothing to build, it's a static file.
4. Deploy. Netlify gives you a `*.netlify.app` URL immediately; every future
   GitHub upload to this repo auto-redeploys it.

## Editor login

Editors log in with the email/password account you created in Supabase
Authentication → Users. Anyone without a login sees the dashboard as
view-only (no upload buttons).
