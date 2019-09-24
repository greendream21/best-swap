The following is an opinionated living document with some preliminary draft suggestions to talk about that are open for discussion with the team:

# What to test and how

- Test major critical path operations with cypress. Avoid testing edge cases here. What we need here is a sanity check for simple happy paths. Eg. Can a user swap tokens with the interface without error. Empty wallet, No wallet etc. Does the interface render and display correct alerts etc.
- Test your app logic in detail including edge cases in isolation with a unit test.

# Guidelines for Unit Testing

- Try to structure your code so as to separate app logic from interface
  - Ideally extract critical logic to a unit tested function or React Hook.
  - Isolate smart and dumb components can use snapshot testing for the dumb ones.
  - Saga makes it easy to test critical data fetching logic.
- Keep your unit tests as close to the code they are testing as possible as they must be kept in sync. eg. avoid `__TEST__` folders as they introduce distance between your code and your test code. A better approach is to create `*.test.js` files next to the thing they are testing.
- Only use snapshot testing for dumb components that only render views. SS testing is often abused and not particularly valuable.

# Guidelines for cypress testing

- Reference DOM elements using a `data-test` attribute: eg.

  ```html
  <button data-test="go-button">Go</button>
  ```

  These elements are then easily found using selectors in cypress:

  ```js
  cy.get('[data-cy="go-button"]').click();
  ```

  Avoid using classes as classes are primarily for styling and often change.

- Don't test with live data unless it is a basic smoke test use stubbing for all server routes. https://docs.cypress.io/guides/guides/network-requests.html#Stubbing

- Test specs in isolation, programmatically log into your application, and take control of your application’s state.

- Use closures to get access to elements: https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html#Return-Values

- Only test what you control. Try to avoid requiring a 3rd party server. When necessary, always use cy.request() to talk to 3rd party servers via their APIs.

- Don't couple multiple tests together. Tests should always be able to be run independently from one another and still pass.

- Don't write tiny tests with single assertions

- Clean up state before tests run in beforeEach. This is valuable because you can look at the state after the test has run to debug it.
