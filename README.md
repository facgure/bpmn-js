# bpmn-js - BPMN 2.0 for the web

[![Build Status](https://github.com/bpmn-io/bpmn-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/bpmn-js/actions?query=workflow%3ACI)

View and edit BPMN 2.0 diagrams in the browser.

[![bpmn-js screencast](./resources/screencast.gif "bpmn-js in action")](http://demo.bpmn.io/s/start)

## Installation

Use the library [pre-packaged](https://github.com/bpmn-io/bpmn-js-examples/tree/main/pre-packaged)
or include it [via npm](https://github.com/bpmn-io/bpmn-js-examples/tree/main/bundling)
into your node-style web-application.

## Usage

To get started, create a [bpmn-js](https://github.com/bpmn-io/bpmn-js) instance
and render [BPMN 2.0 diagrams](https://www.omg.org/spec/BPMN/2.0.2/) in the browser:

```javascript
const xml = '...'; // my BPMN 2.0 xml
const viewer = new BpmnJS({
  container: 'body'
});

try {
  const { warnings } = await viewer.importXML(xml);

  console.log('rendered');
} catch (err) {
  console.log('error rendering', err);
}
```

Checkout our [examples](https://github.com/bpmn-io/bpmn-js-examples) for many
more supported usage scenarios.

## Resources

* [Demo](http://demo.bpmn.io)
* [Issues](https://github.com/bpmn-io/bpmn-js/issues)
* [Examples](https://github.com/bpmn-io/bpmn-js-examples)
* [Forum](https://forum.bpmn.io)
* [Changelog](./CHANGELOG.md)

## Build and Run

Prepare the project by installing all dependencies:

```sh
npm install
```

Then, depending on your use-case you may run any of the following commands:

```sh
# run the production viewer locally (builds + serves public/)
npm run serve

# spin up a single local modeler instance (dev/test mode)
npm start

# spin up a viewer-only instance (dev/test mode)
npm start:viewer

# run the full development setup (all tests, watch mode)
npm run dev

# build the library and run all tests
npm run all
```

You may need to perform [additional project setup](./docs/project/SETUP.md) when
building the latest development snapshot.

## Related

bpmn-js builds on top of a few powerful tools:

* [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle): Read / write support for BPMN 2.0 XML in the browsers
* [diagram-js](https://github.com/bpmn-io/diagram-js): Diagram rendering and editing toolkit

It is an extensible toolkit, complemented by many [additional utilities](https://github.com/bpmn-io/awesome-bpmn-io).

## License

Use under the terms of the [bpmn.io license](http://bpmn.io/license).

---

## facgure fork

This fork ships a standalone production modeler (`public/index.html`) on top of the upstream bpmn-js library.

### Running locally

```sh
npm install
npm run serve
```

Opens at **http://localhost:3000** — `npm run serve` builds the bundles into `public/` and starts the static server in one step.

### Production modeler features

| Feature | How |
|---|---|
| Open `.bpmn` file | Drag & drop onto the canvas |
| Open from clipboard | Paste XML with `Ctrl+V` / `Cmd+V` |
| Open from URL | Add `?https://hostname.com/file.bpmn` to the URL (requires CORS on the source server) |
| Edit diagram | Full modeler palette on the left |
| Zoom in / out | `+` / `−` buttons (bottom-left) or mouse wheel |
| Fit to screen | `Fit` button |
| Reset zoom | `1:1` button |
| Save as `.bpmn` | `Save .bpmn` button (bottom-center) |
| Save as PNG | `Save PNG` button — exports at 2× resolution |

### Dev mode (test runner)

```sh
npm start              # full modeler — opens a browser automatically
npm run start:viewer   # viewer-only (no edit palette)
```

The local URL is printed in the terminal. Open the `.../debug.html` path to interact with the diagram directly.

### Project structure

| Path | Purpose |
|---|---|
| `lib/` | Library source (compiled to `dist/` by `npm run distro`) |
| `public/index.html` | Production HTML page (committed, served from `public/`) |
| `public/bpmn-*.js` | Built bundles (generated — not committed) |
| `public/assets/` | CSS and fonts (generated — not committed) |
