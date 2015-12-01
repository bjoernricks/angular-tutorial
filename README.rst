Installation
============

On Debian based systems node.js and the node package manger can be installed
with::

    apt-get install nodejs npm

Afterwards the required node.js modules can be installed via::

    npm install

Currently two modules are required:

    * http-server - for serving the tutorial
    * bower - to install the used JavaScript libraries (e.g. angularjs)

Afterwards bower install must be run::

    ./node_modules/bower/bin/bower install

Running
=======

To start the tutorial a simple web server can be used. E.g. the node.js 
http-server::

    ./node_modules/http-server/bin/http-server -c-1 angular_tutorial

The option -c-1 will disable browser caching. With the option -p a port can be
specified. By default the http-server uses port 8080.

