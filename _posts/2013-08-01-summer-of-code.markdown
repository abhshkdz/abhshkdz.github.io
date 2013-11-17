---

layout:     post
title:      "Summer of Code"
date:       2013-08-01 00:00:00
excerpt:    "ICU Visualization Project & PHP Security Project"
logo:       "/img/summer-of-code/icu-visualizations-mockup.png"

---

This summer has proved to be a busy one for me. I've been working in parallel on two major open-source projects. One is Emory University's Intensive Care Unit Visualization & Analytics project, for which I was selected as a Google Summer of Code developer, and the other is OWASP's PHP Security Project. It has been a huge learning experience so far.

## ICU Visualization & Analytics

![mockup](/img/summer-of-code/icu-visualizations-mockup.png)

The ICU Visualization & Analytics Project under Emory University mainly deals with the development of an intuitive web interface for clinicians to monitor patient state in realtime. The visualizations include the data coming in from all the sensors as well as results obtained from algorithms running on the raw data. My initial work included trying out a few of the graphing libraries out there including HighCharts, Rickshaw, D3, Cubism. While bare metal D3 gave me all the power and customization options I wanted, Rickshaw was specifically built for handling large amounts of time-series data. There was no point re-inventing the wheel and I decided to stick with Rickshaw.

The application is JS-heavy and the stack consists of Node, Socket.IO, Backbone, Underscore, Rickshaw, D3, Foundation & jQuery. Prior to working on this project, I had some experience in the Backbone + Underscore + Socket.IO stack from my [HackFlowy][1] days. The major obstacle has been the proper handling of raw data coming in at 240Hz. Any mismanagement and the application starts to lag excessively after 10-15 seconds. My project mentor, Dr. Sharath Cholleti, has been highly supportive & appreciative of my work. We have bi-weekly meetings over Hangouts or phone and we set short-term, achievable goals and so far, it has worked out well for both of us.

![screenshot](/img/summer-of-code/icu-visualizations-screenshot.png)

![screenshot](/img/summer-of-code/icu-visualizations-screenshot2.png)

## PHP Security Project

The [PHP Security Project][2], on the other hand, demands a sound knowledge of PHP and web security. The project has about 10 developers onboard and the mailing list is always flooded with doubts, debates and discussions. It is a project that addresses the [OWASP Top 10 list](https://www.owasp.org/index.php/Top_10_2013-Top_10) and provides decoupled libraries, and a demonstrative framework providing easy to use standard security practices for PHP applications. I've been actively involved in the development of the Database Communication library and the HTTP Request / Response handling library.

The next library I work on is going to be one that handles CSRF. While employing per-page & per-session tokens has been considered the classic way to prevent CSRF, recently a lot of security experts have come up with their own solutions. I'm going through some of these papers at the moment to decide on the most secure and future-proof solution. Later this month, I'll get my hands dirty and work on it's implementation. This is a very important library and has to be handled perfectly.

[1]: https://github.com/abhshkdz/hackflowy
[2]: https://github.com/owasp/phpsec
