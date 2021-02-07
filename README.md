# Some DateTime Utilities

> Please use the [ECMAScript proposal](https://tc39.es/proposal-temporal/docs/index.html) instead of this. It was released as I was working on this. It has a lot of the same ideas but with a better implementation and more standardized documentation. 

`Core functionality is from Vercel's _ms_ library`

Lets you do some useful operations such as shifting TZ

```typescript
Time.parseDateTime("8/17/2020, 3:40:04 AM")
    .changeTZ("Central")
    .changeTZ("UTC")
    .timeString()
```

Checkout `test.js` file to see more example implementation code.
