## Run the tests suite

- run `vp install`, then `vp exec playwright install` takes a few minutes to download `playwright`;
- run `vpr test:ui` to open the Vitest UI in browser mode, or `vpr test` to run the tests in headless mode.

The tests run in a real browser (Chromium, via Playwright) and cover the library with 100% statement,
branch, function and line coverage.
