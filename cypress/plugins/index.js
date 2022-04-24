/// <reference types="cypress" />
// ***********************************************************

/**
 * @type {Cypress.PluginConfig}
*/
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  // https://esbuild.github.io/api/
  const esBuildOptions = {
    plugins: [require('./esbuild-istanbul')()]
  }
  
  // pass ESBuild options to be applied to each spec file
  on('file:preprocessor', require('@bahmutov/cypress-esbuild-preprocessor')(esBuildOptions));
  
  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
}
