# Fixture Folder structure

Our fixtures here are structured according to the URLs they are mocking.

The structure is this:

```
{service}/{pathName}/{method}/{status}{.tag}.json
```

- `service` - A short name for the service.
  - `api` for https://testnet-api.bepswap.com,
  - `chain` for https://testnet-chain.bepswap.com
- `pathName` - A name that describes the pathName component of the API call. This has had all the `/`s replaced with `#` so that we can keep a relatively flat folder structure which makes it easier to parse.
- `method` - `GET`, `PUT`, `POST`, `DELETE` etc.
- `status` - `200`, `404` etc.

## To mock a fixture

In your cypress test you can use the `fx:` prefix to refer to the fixture path:

```js
cy.route('GET', '/tokens?token=FSN-F1B', 'fx:api/#v1#tokens/GET/200.fsn').as(
  'token-fsn',
);
```

Notice here the tag we have given the fixture is `.fsn` this could be anything we want that makes sense to keep our mocks unique and test specific eg.

```js
cy.route(
  'GET',
  '/tokens?token=FSN-F1B',
  'fx:api/#v1#tokens/GET/200.swap.fsn',
).as('token-swap-fsn');
```

Note: we can override route mocking in a specific test after doing general mocking.

See [cypress docs](https://docs.cypress.io/api/commands/route.html) for more info.
