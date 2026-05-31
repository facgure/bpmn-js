export * from './helper';

import fileDrop from 'file-drops';

import {
  insertCSS,
  getBpmnJS
} from './helper';


// add core styles
insertCSS('diagram-js.css', require('diagram-js/assets/diagram-js.css'));
insertCSS('bpmn-js.css', require('../assets/bpmn-js.css'));
insertCSS('bpmn-embedded.css', require('bpmn-font/dist/css/bpmn-embedded.css'));
insertCSS('diagram-js-testing.css',
  'body .test-container { height: auto }' +
  'body .test-content-container { height: 90vh; position: relative; }'
);

// be able to load files into running bpmn-js test cases
document.documentElement.addEventListener('dragover', fileDrop('Drop a BPMN diagram to open it in the currently active test.', function(files) {
  const bpmnJS = getBpmnJS();

  if (bpmnJS && files.length === 1) {
    bpmnJS.importXML(files[0].contents);
  }
}));

// paste BPMN XML from clipboard (Ctrl+V / Cmd+V)
document.addEventListener('paste', function(event) {
  const bpmnJS = getBpmnJS();
  if (!bpmnJS) return;

  const text = event.clipboardData.getData('text/plain');
  if (text.includes('<bpmn:definitions') || text.includes('<definitions')) {
    event.preventDefault();
    bpmnJS.importXML(text)
      .then(() => bpmnJS.get('canvas').zoom('fit-viewport'))
      .catch(err => console.error('[paste] invalid BPMN:', err));
  }
});

insertCSS('file-drops.css', `
  .drop-overlay .box {
    background: orange;
    border-radius: 3px;
    display: inline-block;
    font-family: sans-serif;
    padding: 4px 10px;
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
`);

insertCSS('zoom-controls.css', `
  .bpmn-zoom-controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    z-index: 100;
  }
  .bpmn-zoom-controls button {
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background: #fff;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bpmn-zoom-controls button:hover {
    background: #f0f0f0;
  }
  .bpmn-zoom-controls .sep {
    width: 8px;
  }
`);

(function addZoomControls() {
  var controls = document.createElement('div');
  controls.className = 'bpmn-zoom-controls';
  controls.innerHTML = [
    '<button title="Zoom In">+</button>',
    '<button title="Zoom Out">−</button>',
    '<div class="sep"></div>',
    '<button title="Fit to Screen" style="font-size:11px">Fit</button>',
    '<button title="Reset Zoom (100%)" style="font-size:10px">1:1</button>',
  ].join('');

  var buttons = controls.querySelectorAll('button');

  function withViewer(fn) {
    var bpmnJS = getBpmnJS();
    if (bpmnJS) fn(bpmnJS);
  }

  buttons[0].addEventListener('click', function() {
    withViewer(function(v) { v.get('zoomScroll').stepZoom(1); });
  });
  buttons[1].addEventListener('click', function() {
    withViewer(function(v) { v.get('zoomScroll').stepZoom(-1); });
  });
  buttons[2].addEventListener('click', function() {
    withViewer(function(v) { v.get('canvas').zoom('fit-viewport'); });
  });
  buttons[3].addEventListener('click', function() {
    withViewer(function(v) { v.get('canvas').zoom(1); });
  });

  document.body.appendChild(controls);
}());

insertCSS('empty-state.css', `
  .bpmn-empty-state {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }
  .bpmn-empty-state-box {
    text-align: center;
    font-family: sans-serif;
    color: #999;
    user-select: none;
  }
  .bpmn-empty-state-box svg {
    display: block;
    margin: 0 auto 16px;
    opacity: 0.3;
  }
  .bpmn-empty-state-box p {
    margin: 6px 0;
    font-size: 14px;
  }
  .bpmn-empty-state-box kbd {
    background: #eee;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 12px;
    font-family: sans-serif;
  }
`);

(async function showEmptyState() {
  var placeholder = document.createElement('div');
  placeholder.className = 'bpmn-empty-state';
  placeholder.innerHTML =
    '<div class="bpmn-empty-state-box">' +
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
        '<polyline points="14 2 14 8 20 8"/>' +
        '<line x1="12" y1="18" x2="12" y2="12"/>' +
        '<line x1="9" y1="15" x2="15" y2="15"/>' +
      '</svg>' +
      '<p>Drop a <strong>.bpmn</strong> file here</p>' +
      '<p>or paste XML from clipboard <kbd>Ctrl+V</kbd></p>' +
    '</div>';

  // append inside the test content container so position:absolute works correctly
  var container = document.querySelector('.test-content-container') || document.body;
  container.appendChild(placeholder);

  // poll for viewer instance
  var bpmnJS;
  for (var i = 0; i < 50; i++) {
    bpmnJS = getBpmnJS();
    if (bpmnJS) break;
    await new Promise(function(r) { setTimeout(r, 100); });
  }
  if (!bpmnJS) return;

  // hide placeholder on first successful import
  bpmnJS.on('import.done', function handler(event) {
    if (!event.error) {
      placeholder.style.display = 'none';
      bpmnJS.off('import.done', handler);
    }
  });
}());

// load BPMN from URL query param, e.g. ?https://hostname.com/file.bpmn
(async function loadFromUrlParam() {
  const search = window.location.search;
  if (!search) return;

  const url = search.slice(1);
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;

  // poll until bpmnJS instance is ready (created by the running test)
  let bpmnJS;
  for (let i = 0; i < 50; i++) {
    bpmnJS = getBpmnJS();
    if (bpmnJS) break;
    await new Promise(r => setTimeout(r, 100));
  }

  if (!bpmnJS) {
    console.warn('[url-loader] no bpmnJS instance found after 5s');
    return;
  }

  // wait for the initial diagram import to finish before replacing it
  if (!bpmnJS.getDefinitions()) {
    await new Promise(resolve => {
      bpmnJS.on('import.done', function handler() {
        bpmnJS.off('import.done', handler);
        resolve();
      });
    });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const xml = await response.text();
    await bpmnJS.importXML(xml);
    bpmnJS.get('canvas').zoom('fit-viewport');
  } catch (e) {
    console.error('[url-loader] failed to load BPMN from:', url, e);
  }
}());