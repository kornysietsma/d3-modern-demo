This is a work in progress!

# D3 on a modern browser

This is an experiment in running d3 on a (very) modern browser,
taking advantage of all the things that the latest specs
give you.

Specifically:

- Native es6
- es6 modules (as of Chrome 62, which came out in November 2017)
- CSS grids (which means we no longer really need a css framework)

Also it will use immutable.js because as a functional programmer,
I still find es6's native FP a bit limiting; specifically it's
really hard to create a copy of a data structure with minor
mutations, and it's quite hard to efficiently use `reduce` at all.

## Viewing the chart

Sadly es6 modules won't work with `file://` URLs, as they break
CORS.

So to view the chart, you need to run a tiny http server - the easiest way is to use python:

`python -m SimpleHTTPServer 8000`

And then browse to `http://localhost:8000/docs/index.html`

Or you should be able to view the chart in Github Pages, I think.
