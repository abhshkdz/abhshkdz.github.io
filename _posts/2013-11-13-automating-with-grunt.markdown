---

layout:     post
title:      "Workflow Automation with Grunt"
date:       2013-11-13 00:00:00
excerpt:    "Grunt is a JS command-line build tool that is used to automate repetitive tasks"
logo:       "/img/grunt/logo.png"

---

![Grunt](/img/grunt/logo.png)

I recently came across [Grunt.js](http://gruntjs.com/) while working on [Erdős](http://blog.sdslabs.co/2013/10/erdos-codebot) at [SDSLabs](//github.com/sdslabs). It is a task-based command line tool similar to Brunch, Maven, Gradle, and I love it! It's primarily used to automate repetitive tasks in the development workflow and any (lazy) developer would fall in love with it. It takes care of tasks like compilation, minification, concatenation, versioning, cache-busting, linting, unit testing, etc. It isn't limited to JS-specific tasks either, and it's fairly easy to leverage the power of Node by using [child processes](http://gruntjs.com/api/grunt.util#grunt.util.spawn). Also, it is well supported by an extremely active plugin development community. There may be other Javascript task runner solutions, but I don’t know of any at the moment that are worth taking a look at. In this post, I'll go through the setup and a few Grunt tasks that I find really useful.

## The basic setup

As I've mentioned earlier, Grunt uses Node.js and is installed via NPM (Node Package Manager). Once you've got those ready, install the Grunt CLI globally.

```bash
npm install -g grunt-cli
grunt --version
```

The second command should output your current command line module version. Next, create `package.json`, which keeps track of the dependencies we're using in our project so we don't have to push the node modules when collaborating with other developers.

This is what the project directory looks like which I'll be referring to throughout this post.

```
my-test-app/
|--assets/
|--|--dist/
|--|--style.css
|--|--main.js
|--|--jquery.js
|--index.tmpl
|--package.json
|--gruntfile.js
```

### package.json

```json
{
  "name": "Erdos",
  "version": "0.1.0",
  "author": "Abhishek Das",

  "devDependencies" : {
    "grunt": "~0.4.0",
    "grunt-contrib-cssmin": "*",
    "grunt-contrib-uglify": "*",
    "grunt-hashres": "*",
    "grunt-env": "*",
    "grunt-preprocess": "*",
    "matchdep": "*"
  }
}
```

Run `npm install`, and NPM will go fetch these for us and place them in a `node_modules` folder (which should ideally be under gitignore).

## Tasks

Create `gruntfile.js` which defines the workflow and tasks for Grunt to execute. Inside `gruntfile.js`, all configuration is done by passing an object literal to `grunt.initConfig()`.

```javascript
module.exports = function(grunt){

  "use strict";

  /* Load grunt modules */
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    /* All grunt tasks go here */

  });

  /* Public grunt tasks - to be called from command line */
  grunt.registerTask('default', ['cssmin','uglify','env:production','preprocess','hashres']);

};
```

### [CSS Minification](https://github.com/gruntjs/grunt-contrib-cssmin)

This is used to minify all the CSS files for use in the production environment.

```javascript
cssmin: {
  production: {
    src: 'assets/*.css',
    dest: 'assets/dist/style.css'
  }
}
```

This task can now be executed by calling `grunt cssmin:production` on the command line.

### [Uglify JS](https://github.com/gruntjs/grunt-contrib-uglify)

This takes care of javascript compression and minification, thus reducing file size which is important for websites to load fast.

```javascript
uglify: {
  production: {
    files: {
      'assets/dist/main.js': ['assets/*.js']
    }
  }
}
```

This task can now be executed by running `grunt uglify:production` from the command line. It will concatenate and uglify `jquery.js` and `main.js` in one file.

### [Environment Configuration](https://github.com/jsoverson/grunt-env/)

This is a grunt task to automate environment configuration for other tasks. It can be used with the grunt-preprocess plugin to build `index.html` on-the-fly.

```javascript
env: {
  development: {
    NODE_ENV: 'development'
  },
  production: {
    NODE_ENV: 'production'
  }
}
```

### [Preprocess](https://github.com/jsoverson/grunt-preprocess/)

As mentioned earlier, Grunt can preprocess files based off environment configuration.

```javascript
preprocess: {
  html: {
    src: 'index.tmpl',
    dest: 'index.html'
  }
}
```

This task can now be executed by calling `grunt preprocess` on the command line. Our `layout.tmpl` can have logical blocks. This is useful in including analytics only on the production build, throwing in some ascii art, changing static asset paths based on environment etc.

```html
<!doctype html>
<html>
  <!-- @if NODE_ENV = 'production' -->
  <!--
        ,---,.
    ,'  .' |             ,---,
  ,---.'   |  __  ,-.  ,---.'|   ,---.
  |   |   .',' ,'/ /|  |   | :  '   ,'\   .--.--.
  :   :  |-,'  | |' |  |   | | /   /   | /  /    '
  :   |  ;/||  |   ,',--.__| |.   ; ,. :|  :  /`./
  |   :   .''  :  / /   ,'   |'   | |: :|  :  ;_
  |   |  |-,|  | ' .   '  /  |'   | .; : \  \    `.
  '   :  ;/|;  : | '   ; |:  ||   :    |  `----.   \
  |   |    \|  , ; |   | '/  ' \   \  /  /  /`--'  /
  |   :   .' ---'  |   :    :|  `----'  '--'.     /
  |   | ,'          \   \  /              `--'---'
  `----'             `----'

  -->
  <!-- @endif -->
  ...
```

### [Cache-busting](https://github.com/Luismahou/grunt-hashres)

grunt-hashres is an extremely useful plugin that hashes js and css files and renames the `<script>` and `<link>` declarations that refer to them in my html/php/etc files.

```javascript
hashres: {
  options: {
    encoding: 'utf8',
    fileNameFormat: '${name}.${hash}.${ext}',
    renameFiles: true
  },
  production: {
    src: ['assets/dist/style.css','assets/dist/main.js'],
    dest: 'index.html'
  }
}
```

This task can now be executed by running `grunt hashres:production` from the command line. It would change `<link rel="stylesheet" href="assets/dist/style.css">` to `<link rel="stylesheet" href="assets/dist/style.130fdfaa.css">` and `<script src="assets/dist/main.js">` to `<script src="assets/dist/main.9c4cc83e.js">` in `index.html`. It would also rename the corresponding CSS & JS files in the `assets/dist` directory. This is much better than using a timestamp because the hash only changes when a file has been updated.

## Build

Public grunt tasks defined at the bottom of `gruntfile.js` can be called directly from the command line. The `default` task is executed by running `grunt`. Environment variables should ideally be picked up from the project configuration file. [Here](https://gist.github.com/abhshkdz/7460904) is the complete gruntfile for convenience. If everything went right, you should see the following output when you run `grunt`.

![Output](/img/grunt/output.png)

This was just a basic introduction and walkthrough to using Grunt. Actual usage would definitely be more robust and complex. Grunt comes with pretty much everything you’ll need to use it on a large project and can be extended as much as you want.
