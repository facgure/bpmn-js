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
# build the library and run all tests
npm run all

# spin up a single local modeler instance
npm start

# run the full development setup
npm run dev
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

This fork extends bpmn-js with a standalone production viewer/editor (`public/index.html`) and dev mode enhancements.

### Production viewer

A self-contained HTML page that bundles the BPMN modeler — no build step needed at runtime.

**Build:**

```sh
npm install
npm run distro          # builds dist/
cp -r dist/* public/   # copy bundles into public/
```

**Run locally:**

```sh
npx serve public
# open http://localhost:3000
```

**Features:**

| Feature | How |
|---|---|
| Open `.bpmn` file | Drag & drop onto canvas |
| Open from clipboard | Paste XML with `Ctrl+V` / `Cmd+V` |
| Open from URL | `?https://hostname.com/file.bpmn` (requires CORS) |
| Zoom in / out | `+` / `−` buttons (bottom-left) or mouse wheel |
| Fit to screen | `Fit` button |
| Edit diagram | Full modeler palette (top-left) |
| Save as `.bpmn` | `Save .bpmn` button (bottom-center) |
| Save as PNG | `Save PNG` button — exports @2x resolution |

> **Note:** URL param loading requires the source server to have `Access-Control-Allow-Origin` CORS headers.

### Dev mode

```sh
npm run start:viewer   # viewer-only mode (read-only)
npm start              # full modeler mode
```

Open `http://localhost:9876/debug.html` (or `9877` for viewer).

Additional dev shortcuts:

- **Drag & drop** a `.bpmn` file to replace the current diagram
- **Paste** BPMN XML from clipboard (`Ctrl+V`)
- **URL param** `?https://...` to load a remote diagram on startup
- Zoom controls at bottom-left of the canvas
