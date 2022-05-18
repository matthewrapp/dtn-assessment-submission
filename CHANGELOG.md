## Resolve Issues on 05/18/22

#### ngrok failing on `npm i`

We needed to bump up the version due to some incompatability with the Macbook and M1 Processor.

[Source](https://github.com/inconshreveable/ngrok/issues/429#issuecomment-997806578)


#### Router issue

React App was breaking because we required the `BrowserRouter` to be wrapping the `Switch` + `Route`.
I believe because the initial implementation was considered nested routing, it wasn't happy.

[Source 1](https://stackoverflow.com/questions/50584641/invariant-violation-you-should-not-use-switch-outside-a-router)
[Source 2](https://v5.reactrouter.com/web/guides/quick-start/2nd-example-nested-routing)


#### Tapable?

```
ERROR in .../frontend-interview-exercise/node_modules/@types/webpack/index.d.ts(30,3):
TS2305: Module '"../../../../../../../../../../frontend-interview-exercise/node_modules/tapable/tapable"' has no exported member 'Tapable'.

ERROR in .../frontend-interview-exercise/node_modules/@types/webpack/index.d.ts(943,23):
TS2707: Generic type 'SyncWaterfallHook<T, AdditionalOptions>' requires between 1 and 2 type arguments.
```

This issue appears when we run `npm start`. I can't really nail down the issue, my guess is that this is probably some incompatable versioning between webpack and it's dependency on tapable. Solution seems to have been to add `@types/tapable` at `1.0.2`. My initial install of that dependency was at `2.2.2` and error was still appearing.

[Source](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24239#issuecomment-383783867)
