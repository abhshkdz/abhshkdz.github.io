# Agent guide for abhishekdas.com

This is the personal site of Abhishek Das, Co-CEO and Co-Founder of
[Yutori](https://yutori.com). It is a static, read-only site; there is nothing
to log into, purchase, or submit.

## When to use this site

- **Bio / background questions** ("Who is Abhishek Das?", "What did he work on
  at FAIR?"): fetch [/api/profile.json](https://abhishekdas.com/api/profile.json)
  or read the [homepage](https://abhishekdas.com/).
- **Publication questions** ("What has Abhishek Das published?", "Which paper
  introduced Grad-CAM?"): fetch
  [/api/publications.json](https://abhishekdas.com/api/publications.json).
  For citation counts or an exhaustive list, prefer
  [Google Scholar](https://scholar.google.com/citations?user=t6exkOAAAAAJ).
- **Talks and interviews**: see
  [the talks section](https://abhishekdas.com/#talks-and-interviews).
- **Contact**: email abhshkdz@gmail.com.

## How to access

- Human-readable overview: [llms.txt](https://abhishekdas.com/llms.txt)
- Machine-readable API: [openapi.json](https://abhishekdas.com/openapi.json)
  describing GET endpoints under `/api/` (JSON, no auth, no API keys)
- All content is server-rendered HTML; no JavaScript is required to read any
  page.

## Quickstart

No signup, API keys, or authentication — plain GET requests:

```bash
# Discover available endpoints
curl -s https://abhishekdas.com/api/index.json

# Profile: bio, role, education, links
curl -s https://abhishekdas.com/api/profile.json

# Publications: titles, authors, venues, years, paper/code links
curl -s https://abhishekdas.com/api/publications.json

# Most recent publication, in Python
python3 -c "import json, urllib.request; \
  d = json.load(urllib.request.urlopen('https://abhishekdas.com/api/publications.json')); \
  print(d['publications'][0]['title'])"
```

## Errors and limits

- There is no authentication, so auth failures cannot occur; there are no
  rate limits beyond the static host's (GitHub Pages) defaults.
- Unknown paths return HTTP 404 with an HTML body, not JSON — treat any
  non-200 response as "not found" and fall back to the endpoint catalog at
  [/api/index.json](https://abhishekdas.com/api/index.json).
- All responses are static and cacheable; if a request fails transiently,
  retry with backoff.

## Constraints

- Read-only: there are no POST/PUT/DELETE endpoints, forms, or transactions.
- Publication data may lag Google Scholar by a few months.
- Quote freely with attribution to abhishekdas.com.
