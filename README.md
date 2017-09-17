# Locomotive

[![Build](https://travis-ci.org/jaredhanson/locomotive.png)](https://travis-ci.org/jaredhanson/locomotive)
[![Coverage](https://coveralls.io/repos/jaredhanson/locomotive/badge.png)](https://coveralls.io/r/jaredhanson/locomotive)
[![Quality](https://codeclimate.com/github/jaredhanson/locomotive.png)](https://codeclimate.com/github/jaredhanson/locomotive)
[![Dependencies](https://david-dm.org/jaredhanson/locomotive.png)](https://david-dm.org/jaredhanson/locomotive)
[![Tips](http://img.shields.io/gittip/jaredhanson.png)](https://www.gittip.com/jaredhanson/)


[http://locomotivejs.org](http://locomotivejs.org/)

Locomotive is a framework that brings structure and MVC patterns to web
applications using [Node](http://nodejs.org) and [Express](http://expressjs.com/).

## Installation

    $ npm install locomotive

## Quick Start

`lcm`, the command line interface to Locomotive, can be used to generate a
starter application.  To use it, install Locomotive globally.

    $ npm install locomotive -g
    
Next, create an application and install dependencies.

    $ lcm create hello
    $ cd hello
    $ npm install
    
Start the server.

    $ lcm server

The application is available at [localhost:3000](http://localhost:3000).

Start the server with node debug mode

	$ lcm server --debug (node --debug mode)
	$ lcm server --debug-brk (node --debug-brk mode)

Then you can use debug tools like [node-inspector](https://github.com/dannycoates/node-inspector) to debug your application as usual.

## Guide

The [Locomotive Guide](http://locomotivejs.org/guide/) is the official source
for documentation, and is a handy reference to have available when developing
web applications powered by Locomotive.

## Datastore Adapters

<table>
  <thead>
    <tr><th>Adapter</th><th>Description</th><th>Developer</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="https://github.com/jaredhanson/locomotive-mongoose">Mongoose</a></td><td>Mongoose ODM adapter.</td><td></td></tr>
  </tbody>
</table>

## Tests

    $ npm install
    $ make test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2017 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/locomotive'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/locomotive.svg' /></a>
