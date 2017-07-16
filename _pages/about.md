---
layout:     page
title:      About
permalink:  /about/
---

<!-- ![cover](/img/cover.jpg)

Computer Science PhD Student
[Machine Learning and Perception Lab][1], Georgia Tech
abhshkdz \_at\_ gatech.edu -->

<div class="row" id="timeline-logos">
    <div class="col-xs-2">
        <div class="logo-wrap">
            <span class="helper"></span>
            <a href="//iitr.ac.in"><img src="/img/logos/iitr.jpg"></a>
        </div>
        <div class="logo-desc">
            IIT Roorkee<br>
            2011 - 2015
        </div>
    </div>
    <div class="col-xs-3">
        <div class="logo-wrap">
            <span class="helper"></span>
            <a href="//qbi.uq.edu.au"><img src="/img/logos/uq.png"></a>
        </div>
        <div class="logo-desc">
            Queensland Brain Institute<br>
            Summer 2015
        </div>
    </div>
    <div class="col-xs-2">
        <div class="logo-wrap">
            <span class="helper"></span>
            <a href="//vt.edu"><img src="/img/logos/vt.png"></a>
        </div>
        <div class="logo-desc">
            Virginia Tech<br>
            2015 - 2016
        </div>
    </div>
    <div class="col-xs-2">
        <div class="logo-wrap">
            <span class="helper"></span>
            <a target="_blank" href="//gatech.edu"><img src="/img/logos/gatech.png"></a>
        </div>
        <div class="logo-desc">
            Georgia Tech<br>
            2017 - Present
        </div>
    </div>
    <div class="col-xs-3">
        <div class="logo-wrap">
            <span class="helper"></span>
            <img src="/img/logos/fair.png">
        </div>
        <div class="logo-desc">
            Facebook AI Research<br>
            Summer 2017
        </div>
    </div>
</div>

I am a Computer Science PhD student at Georgia Tech, advised by [Prof. Dhruv Batra][2].
My research focuses on deep learning and its applications in computer vision and natural language processing.
Before transferring to Georgia Tech,
I spent one year at Virginia Tech as an intern and later as a graduate student
working with [Prof. Dhruv Batra][2] and [Prof. Devi Parikh][3].
My CV is available [here][33].

Prior to joining grad school, I worked on neural coding in zebrafish tectum
as an intern under [Prof. Geoffrey Goodhill][4] and [Lilach Avitan][5]
at the [Goodhill Lab][6], Queensland Brain Institute.

I graduated from [Indian Institute of Technology Roorkee][31] in 2015.
During my undergrad years, I've been selected twice for
Google Summer of Code ([2013][8] and [2014][9]),
won several hackathons and security contests ([Yahoo! HackU!][10],
[Microsoft Code.Fun.Do.][11], Deloitte CCTC [2013][12] and [2014][13]),
and been an active member of [SDSLabs][16].

On the side, I built [neural-vqa][19], an efficient Torch implementation for visual question answering (and its extension [neural-vqa-attention][35]),
and maintain [aideadlin.es][34] (countdowns to a bunch of CV/NLP/ML/AI conference deadlines),
and several other side projects ([HackFlowy][20], [graf][21], [etc][22]).
I also help maintain [Erdős][17], a competitive math learning platform I created during my undergrad.
I often [tweet][23], and post pictures from my travels on [Instagram][24] and [Tumblr][25].

---

<a name="/publications"></a>

# Publications

<h2 class="pubt">Learning Cooperative Visual Dialog Agents with Deep Reinforcement Learning</h2>
<p class="pubd">
    <span class="authors">Abhishek Das<sup>*</sup>, Satwik Kottur<sup>*</sup>, Stefan Lee, José M.F. Moura, Dhruv Batra</span><br>
    <span class="conf">ICCV 2017</span><br>
    <span class="links">
        <a target="_blank" href="//arxiv.org/abs/1703.06585">Paper</a>
    </span>
</p>

<img src="/img/visdial/qbot_abot.jpg">

<hr>
<h2 class="pubt">Grad-CAM: Why did you say that? Visual Explanations from Deep Networks via Gradient-based Localization</h2>
<p class="pubd">
    <span class="authors">Ramprasaath R. Selvaraju, Michael Cogswell, Abhishek Das, Ramakrishna Vedantam, Devi Parikh, Dhruv Batra</span><br>
    <span class="conf">ICCV 2017, NIPS 2016 Interpretable ML for Complex Systems Workshop</span><br>
    <span class="links">
        <a target="_blank" href="//arxiv.org/abs/1610.02391">Paper</a>
        <a target="_blank" href="https://github.com/ramprs/grad-cam">Code</a>
        <a target="_blank" href="http://gradcam.cloudcv.org/">Demo</a>
    </span>
</p>

<img src="/img/grad-cam/teaser.png">

<hr>
<h2 class="pubt">Visual Dialog</h2>
<p class="pubd" style="margin-bottom:20px;">
    <span class="authors">Abhishek Das, Satwik Kottur, Khushi Gupta, Avi Singh, Deshraj Yadav, José M.F. Moura, Devi Parikh, Dhruv Batra</span><br>
    <span class="conf">CVPR 2017 (Spotlight)</span><br>
    <span class="links">
        <a target="_blank" href="//arxiv.org/abs/1611.08669">Paper</a>
        <a target="_blank" href="//github.com/batra-mlp-lab/visdial">Code</a>
        <a target="_blank" href="http://visualdialog.org/">visualdialog.org</a>
        <!-- <a target="_blank" href="http://visualdialog.org/data">dataset</a> -->
        <a target="_blank" href="https://github.com/batra-mlp-lab/visdial-amt-chat">AMT chat interface</a>
        <a target="_blank" href="http://demo.visualdialog.org">Demo</a>
    </span>
</p>

<div id="vimeo-embed">
    <iframe src="https://player.vimeo.com/video/193092429?byline=0&portrait=0&color=ffffff" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

<hr>
<h2 class="pubt">Human Attention in Visual Question Answering: Do Humans and Deep Networks Look at the Same Regions?</h2>

<p class="pubd">
    <span class="authors">Abhishek Das<sup>*</sup>, Harsh Agrawal<sup>*</sup>, C. Lawrence Zitnick, Devi Parikh, Dhruv Batra</span> <br>
    <span class="conf">EMNLP 2016, ICML 2016 Workshop on Visualization for Deep Learning</span><br>
    <span class="links">
        <a target="_blank" href="//arxiv.org/abs/1606.03556">Paper</a>
        <a target="_blank" href="https://computing.ece.vt.edu/~abhshkdz/vqa-hat">Project+Dataset</a>
        <a target="_blank" href="https://github.com/abhshkdz/neural-vqa-attention">neural-vqa-attention</a>
    </span>
    <!-- Press: -->
    <div class="row pressdiv" style="margin: 5px 0 0 0; line-height: 1.4em;">
        <a style="border-bottom: 0;" target="_blank" href="http://nautil.us/issue/40/learning/is-artificial-intelligence-permanently-inscrutable">
            <div class="col-lg-1 col-md-1 col-xs-2" style="padding: 0;">
                <img src="/img/logos/nautilus.png" style="background: white; width: 60px;">
            </div>
            <div class="col-lg-11 col-md-11 col-xs-10">
                <span class="presslink">"Is Artificial Intelligence Permanently Inscrutable?" by Aaron Bornstein</span>
            </div>
        </a>
        <a style="border-bottom: 0;" target="_blank" href="http://www.theverge.com/2016/7/12/12158238/first-click-deep-learning-algorithmic-black-boxes">
            <div class="col-lg-1 col-md-1 col-xs-2" style="padding: 0;">
                <img src="/img/logos/theverge.png" style="margin-right: 5px; background: white; width: 60px;">
            </div>
            <div class="col-lg-11 col-md-11 col-xs-10">
                <span class="presslink">"Deep learning is creating computer systems we don't fully understand" by James Vincent</span>
            </div>
        </a>
        <a style="border-bottom: 0;" target="_blank" href="https://www.newscientist.com/article/2095616-robot-eyes-and-humans-fix-on-different-things-to-decode-a-scene/">
            <div class="col-lg-1 col-md-1 col-xs-2" style="padding: 0;">
                <img src="/img/logos/newscientist.jpg" style="background: white; width: 60px;">
            </div>
            <div class="col-lg-11 col-md-11 col-xs-10">
                <span class="presslink">"Robot eyes and humans fix on different things to decode a scene" by Aviva Rutkin</span>
            </div>
        </a>
        <a style="border-bottom: 0;" target="_blank" href="http://www.techradar.com/news/world-of-tech/robots-and-humans-see-the-world-differently-but-we-don-t-know-why-1324165">
            <div class="col-lg-1 col-md-1 col-xs-2" style="padding: 0;">
                <img src="/img/logos/techradar.png" style="background: white; width: 60px;">
            </div>
            <div class="col-lg-11 col-md-11 col-xs-10">
                <span class="presslink">"Robots and humans see the world differently – but we don't know why" by Duncan Geere</span>
            </div>
        </a>
        <a style="border-bottom: 0;" target="_blank" href="https://www.technologyreview.com/s/601819/ai-is-learning-to-see-the-world-but-not-the-way-humans-do/">
            <div class="col-lg-1 col-md-1 col-xs-2" style="padding: 0;">
                <img src="/img/logos/mittechreview.svg" style="background: white; width: 60px;">
            </div>
            <div class="col-lg-11 col-md-11 col-xs-10">
                <span class="presslink">"AI Is Learning to See the World—But Not the Way Humans Do" by Jamie Condliffe</span>
            </div>
        </a>
    </div>
</p><img src="/img/vqa-hat/teaser.jpg">
<hr>

<a name="/talks"></a>

# Talks

<h2 class="talkt" style="font-weight:300;">ICML 2016 Workshop on Visualization for Deep Learning</h2>
<p class="talkd">
    <a target="_blank" href="http://techtalks.tv/talks/towards-transparent-visual-question-answering-systems/63026/"><img src="/img/talks/vqahat_icml16_deepviz.png"></a>
</p>
<hr>

<a name="/projects"></a>

# Side projects

<div class="row">
    <div class="col-sm-12">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/abhshkdz/neural-vqa-attention">neural-vqa-attention</a></h2>
        <p class="talkd">
            Torch implementation of an attention-based visual question answering model (Yang et al., CVPR16).
            The model looks at an image, reads a question, and comes up with an answer to the question and a heatmap of where it looked in the image to answer it.
            Some results <a href="https://computing.ece.vt.edu/~abhshkdz/neural-vqa-attention/figures/">here</a>.
            <a target="_blank" href="https://github.com/abhshkdz/neural-vqa-attention"><img class="project-img" src="/img/projects/neural-vqa-attention.jpg"></a>
        </p>
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="http://aideadlin.es">aideadlin.es</a></h2>
        <p class="talkd">
            aideadlin.es is a webpage to keep track of CV/NLP/ML/AI conference deadlines. It's hosted on GitHub, and countdowns are automatically updated via changes to the data file in the repo.
            <a target="_blank" href="http://aideadlin.es"><img style="margin-top: 10px;" src="/img/projects/ai-deadlines.png"></a>
        </p>
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/abhshkdz/neural-vqa">neural-vqa</a></h2>
        <p class="talkd">
            neural-vqa is an efficient, GPU-based Torch implementation of the visual question answering model from the NIPS 2015 paper 'Exploring Models and Data for Image Question Answering' by Ren et al.
            <a target="_blank" href="https://github.com/abhshkdz/neural-vqa"><img src="/img/projects/neural-vqa.jpg"></a>
        </p>
    </div>
</div>

<div class="row">
    <div class="col-sm-12">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://erdos.sdslabs.co">Erdős</a></h2>
        <p class="talkd">
            Erdős by <a target="_blank" href="//sdslabs.co">SDSLabs</a> is a competitive math learning platform, similar in spirit to <a href="https://projecteuler.net/">Project Euler</a>, albeit more feature-packed (support for holding competitions, has a social layer) and prettier.
            <a target="_blank" href="https://erdos.sdslabs.co"><img style="margin-top:10px;" src="/img/projects/erdos.png"></a>
        </p>
    </div>
</div>

<div class="row">
    <div class="col-sm-6">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/abhshkdz/graf">graf</a></h2>
        <p class="talkd">
            graf plots pretty git contribution bar graphs in the terminal.
            <code>gem install graf</code> to install.
            <a target="_blank" href="https://github.com/abhshkdz/graf"><img style="margin-top:10px;" src="/img/projects/graf.gif"></a>
        </p>
    </div>
    <div class="col-sm-6">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/abhshkdz/HackFlowy">HackFlowy</a></h2>
        <p class="talkd">
            Clone of <a href="//workflowy.com">WorkFlowy.com</a>, a beautiful, list-based note-taking website that has a 500-item monthly limit on the free tier :-(. This project is an open-source clone of WorkFlowy. "Make lists. Not war." :-)
            <a target="_blank" href="https://github.com/abhshkdz/HackFlowy"><img style="margin-top:40px;" src="/img/projects/hackflowy.png"></a>
        </p>
    </div>
</div>

<div class="row">
    <div class="col-sm-6">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/abhshkdz/AirMaps">AirMaps</a></h2>
        <p class="talkd">
            AirMaps was a fun hackathon project that lets users navigate through Google Earth with gestures and speech commands using a Kinect sensor. It was the <a target="_blank" href="https://blog.sdslabs.co/2014/02/code-fun-do">winning entry in Microsoft Code.Fun.Do</a>.
            <a target="_blank" href="https://github.com/abhshkdz/AirMaps"><img style="margin-top:10px;" src="/img/projects/airmaps.jpg"></a>
        </p>
    </div>
    <div class="col-sm-6">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/sdslabs/hackview">HackView</a></h2>
        <p class="talkd">
            Another fun hackathon-winning project built during Yahoo! HackU! 2012 that involves webRTC-based P2P video chat, and was faster than any other video chat provider (at the time, before Google launched Hangouts).
        </p>
    </div>
    <div class="col-sm-6">
        <h2 class="talkt" style="font-weight:300;"><a target="_blank" href="https://github.com/abhshkdz/8tracks-downloader">8tracks-downloader</a></h2>
        <p class="talkd">
            Ugly-looking, but super-effective bash script for downloading entire playlists from 8tracks. (Still works as of 10/2016).
        </p>
    </div>
</div>

---

[1]: //mlp.ece.vt.edu/
[2]: //computing.ece.vt.edu/~dbatra/
[3]: //computing.ece.vt.edu/~parikh/
[4]: //www.qbi.uq.edu.au/professor-geoffrey-goodhill
[5]: //researchers.uq.edu.au/researcher/2490
[6]: //cns.qbi.uq.edu.au/
[7]: //developers.google.com/open-source/gsoc/
[8]: /posts/summer-of-code/
[9]: /posts/gsoc-reunion-2014/
[10]: //blog.sdslabs.co/2012/09/hacku
[11]: //blog.sdslabs.co/2014/02/code-fun-do
[12]: //www.facebook.com/SDSLabs/posts/527540147292475
[13]: /posts/deloitte-cctc-3/
[14]: /posts/google-india-community-summit/
[15]: //blog.sdslabs.co/2013/10/syntax-error-2013
[16]: //sdslabs.co/
[17]: //erdos.sdslabs.co/
[18]: //projecteuler.net/
[19]: //github.com/abhshkdz/neural-vqa
[20]: //github.com/abhshkdz/HackFlowy
[21]: //github.com/abhshkdz/graf
[22]: //github.com/abhshkdz
[23]: //twitter.com/abhshkdz
[24]: //instagram.com/abhshkdz
[25]: http://x.abhishekdas.com/
[26]: https://computing.ece.vt.edu/~abhshkdz/vqa-hat
[27]: http://arxiv.org/abs/1606.03556
[28]: https://www.newscientist.com/article/2095616-robot-eyes-and-humans-fix-on-different-things-to-decode-a-scene/
[29]: https://www.technologyreview.com/s/601819/ai-is-learning-to-see-the-world-but-not-the-way-humans-do/
[30]: http://www.theverge.com/2016/7/12/12158238/first-click-deep-learning-algorithmic-black-boxes
[31]: http://iitr.ac.in/
[32]: https://www.facebook.com/dhruv.batra.1253/posts/1783087161932290
[33]: https://computing.ece.vt.edu/~abhshkdz/cv.pdf
[34]: http://aideadlin.es/
[35]: //github.com/abhshkdz/neural-vqa-attention
