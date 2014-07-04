# Manila JS 009 Slide Deck

This project is the slide deck and proof of concept for the
Cross-Origin Resource Sharing (CORS) talk by
[__Richard Neil Ilagan__](http://github.com/richardneililagan)
for [Manila JS](http://manilajs.com) Fridays 009.

## Setting up for development

This project runs on a __Node__ server, and uses a global [Gulp](http://gulpjs.com/) module and the __Ruby SASS__ compiler as part of the build process requirements.

To check for a Node installation on your local development machine:

    node -v
    => v0.10.25 (or similar)
    
To check for a ready Ruby SASS compiler:

    ruby -v
    => ruby 1.9.3p545 (2014-02-24) [i386-mingw32] (or similar)
    
    gem -v
    => 1.8.28 (or similar)
    
    sass -v
    => Sass 3.3.9 (Maptastic Maple) (or similar)
    
If any of the above fail, you'll have to install the missing components first.

### Installing Node

Grab the [latest Node JS binaries here](http://nodejs.org/).

### Installing Ruby

Get the [latest stable version of Ruby for your machine here](https://www.ruby-lang.org/en/downloads/).
Make sure to grab and install the DevKit as well.

### Installing Ruby SASS

Once Ruby is up and available, run `gem install sass` from a shell.

### Get the source code

    cd /path/to/your/dev/directory
    git clone git@github.com:richardneililagan/manila-js-009-cors.git <optional-folder-name>
    
### Initialize Node dependencies

    cd /path/to/your/copy/of/manila-js-009-cors
    npm install
    
Also, install global Node dependencies uses by this project:

    npm install -g gulp

## Firing up the server

To start the web server, run `gulp serve` from the root directory of this project. Point your browser to http://localhost:9000 afterwards.

This also starts the file watcher for server files, and will automatically restart the server when a change is detected on any server-dependent file.

## Making changes to client code

When making changes to code for the client (e.g. stylesheets, HTML pages, client JS, etc), you might find it easier to run `gulp watch` while making changes as well. This will automatically re-process and re-deploy your changed files into the server directories.

`gulp watch` can run alongside `gulp serve` (in a different shell).

If you're using LiveReload, `gulp watch` will also fire a LiveReload server on port 35729. If you have a compatible browser (or browser extension), making changes to client files will automatically make the browser reload the changed files.

## Notes

If you just want to compile the client app files, run `gulp build`. This will prep the `/dist` directory with all the client files for this project.
