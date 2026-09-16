# API docs (Swagger UI)

Static Swagger UI page with a set of predefined OpenAPI specifications. All files needed at runtime are in `api-docs/`.

```
api-docs/
  index.html            page (Swagger UI init)
  config.js             list of specifications  <- edit this
  swagger-ui.bundle.js  swagger-ui-bundle.js + swagger-ui-standalone-preset.js (swagger-ui-dist)
  swagger-ui.css
  oauth2-redirect.html/.js, favicons, LICENSE, NOTICE, VERSION
scripts/
  update-swagger-ui.mjs rebuild vendor files from npm
  serve.mjs             local static server
frame-test.html         simple example of embedding in an iframe
frame-test-portal.html  host "portal" page: spec switcher, topbar toggle, highlighted iframe
```

## Specifications

Edit `api-docs/config.js`. `url` is either absolute (the server must send CORS headers) or relative to `index.html`, e.g. `"../openapi.yaml"`.

## Embedding in an iframe

```html
<iframe src="https://<user>.github.io/<repo>/api-docs/?spec=Petstore%20(OpenAPI%203)&topbar=0"
        style="width:100%;height:800px;border:0"></iframe>
```

Parameters:

- `spec=<name>` — spec from `config.js` to open first;
- `topbar=0` — hide the top bar with the spec selector (only the `spec` is shown).

The online validator, `?url=` from the query string and deep linking (hash rewrite) are disabled.
GitHub Pages does not send `X-Frame-Options`, so the page can be framed from any site.

## Update Swagger UI

```
node scripts/update-swagger-ui.mjs            # latest
node scripts/update-swagger-ui.mjs 5.33.0     # exact version
```

## Local check

```
node scripts/serve.mjs 8080
```

Open http://localhost:8080/frame-test.html or http://localhost:8080/frame-test-portal.html.

## GitHub Pages

Settings → Pages → Deploy from a branch → `main` / `(root)`. The page will be available at `https://<user>.github.io/<repo>/api-docs/`.
