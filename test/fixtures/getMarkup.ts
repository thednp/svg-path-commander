export default function getMarkup() {
  const markup = `<div class="row row-lg">
    <div class="col col-md-4 mx-auto">
      <div class="text-center">
        <svg id="test-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M0 0L0 0" fill="rgba(255,0,255,0.75)"></path>
        </svg>
      </div>
    </div>
  </div>`;

  const domParser = new DOMParser();
  let tempDocument = domParser.parseFromString(markup, 'text/html');
  const container = tempDocument.querySelector('div')!;

  return container;
}
