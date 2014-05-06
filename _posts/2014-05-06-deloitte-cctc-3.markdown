---

layout:     post
title:      "Collegiate Cyber Threat Competition - Wave III"
date:       2014-05-06 00:00:00
excerpt:    "SDSLabs participated in and won the 3rd Deloitte CCTC"

---

Deloitte has been organizing the Collegiate Cyber Threat Competition every year for the past 3 years. SDSLabs has been fortunate enough to [be the winning team][cctc1] [three years in a row now][cctc2]. Although they change the format of the competition every year and will continue to do so, their main idea is to get students and industry experts together on the same platform, and discuss and tackle challenges in cyber security. Taking part in the competition is in itself an immense learning experience. This post summarizes my experience at this year's CCTC.

## Round 0

Since SDSLabs has been participating in the earlier two iterations of CCTC, we were looking forward to Deloitte coming to our campus this year as well. Round 0 was held at several college campuses across India in February, and involved a written quiz in teams of 3. The problems ranged from web application security to networking and were fairly straightforward. 3 teams were shortlisted from each campus to proceed to the following rounds. Our team, Legacy, consisted of Abhay Rana, Ravi Kishore and myself.

![round-0](/img/cctc-3/round-0.jpg)

## Round 1

Round 1 was an online jeopardy-style CTF. There were multiple categories of problems such as SQL injection, XSS, cryptography, network analysis, etc which had difficulty-based point values. We were to submit a flag obtained by solving the challenge, and the 1st two teams to solve every challenge were given bonus points. Solutions to most of the challenges are given [here](http://github.com/captn3m0/cctc3-solutions) and we had a lot of fun solving them. We solved all but one challenge and were happy to be on top of the leaderboard before it was frozen, although we were later told that the final leaderboard was much closer than we expected. Top 5 teams from Round 1 were invited for the grand finals held in Hyderabad on May 1-2.

![round-1-leaderboard](/img/cctc-3/round-1-leaderboard.jpg)

## Round 2

Round 2 was organized at the Hyderabad International Convention Centre. We landed in Hyderabad on the evening of 1st May, checked in at the Novotel and had some time to freshen up before meeting the Deloitte team for dinner. We were under the impression that the finals would take place the following morning and we would enjoy a peaceful night's sleep. They seemed to have other plans for us though. After dinner, the competition was declared open, and each team was handed 2 identical laptops with 2 VMs each which we were told were known to be compromised. We had all night to analyze the systems, identify the extent of compromise, the malicious files/processes, the changes (filesystem/registry) made by them, the network activity, etc. and were to deliver a presentation on our findings to a panel of security experts from the industry. This was for 400 points. In addition, we also had to submit a [STIX](http://stix.mitre.org/) document to share the security threat information with our peers (in a real-world scenario), which was for 200 points.

Both the VMs were Windows machines. We weren't allowed to mess with the host machine, or transfer files from the VMs to the internet or external media. Initially, our attention was divided over both the VMs but we were very early to figure out that one of them was a decoy (thanks to Nemo's intuition). We used a host of tools such as CurrProcess, Wireshark, RegScanner, ProcessActivityView, SmartSniffer, Malware Bytes, HijackThis, etc. We kept logging our observations and steps on a shared WorkFlowy list. 

This round was very exciting, more so because we hadn't taken part in this kind of a challenge ever before and the whole real-world scenario of working in a Cyber Incident Response Team was very new to us. Although we were far from discovering all the malicious files and processes, we did well enough in our analysis to be declared the winners and were awarded INR 120000.

![winners](/img/cctc-3/winners.jpg)

We thoroughly enjoyed taking part in this version of CCTC. Both round 1 and round 2 had brilliant challenges and we learnt a lot in the process. We are looking forward to next year's competition and we have been promised that it'll be bigger and better.

[cctc1]: http://captnemo.in/blog/2011/11/20/cctc-blog/
[cctc2]: https://www.facebook.com/photo.php?fbid=10151631176199203&set=t.622604202&type=3&theater