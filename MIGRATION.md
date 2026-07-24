# Migrating to 5.0.0

Version 5.0.0 corrects public TypeScript definitions to match the Link Web SDK.
Runtime behavior is unchanged.

## Handle nullable public tokens

The `public_token` passed to `onSuccess` is now typed as `string | null`. Check
for `null` before using it in flows that do not create an Item:

```tsx
const onSuccess: PlaidLinkOnSuccess = (publicToken, metadata) => {
  if (publicToken) {
    exchangePublicToken(publicToken);
  }
};
```

Item-based flows continue to return a public token.

## Pass exit options as an object

Replace the legacy boolean argument:

```tsx
exit(true);
```

with the Link Web SDK options object:

```tsx
exit({ force: true });
```

Call `exit()` without arguments for a graceful exit.

## Submit Layer phone number and date of birth separately

Submit a phone number first:

```tsx
submit({ phone_number: '+14155550123' });
```

After receiving `LAYER_NOT_AVAILABLE`, submit date of birth separately:

```tsx
submit({ date_of_birth: '1975-01-18' });
```

Do not include both fields or use `null` placeholders in the same submission.

## Create handlers before calling handler methods

The global `window.Plaid` type no longer includes handler methods. Create a
handler before calling `open`, `submit`, `exit`, or `destroy`:

```tsx
const handler = window.Plaid.create(config);
handler.open();
```

Applications using `usePlaidLink` do not need to create a handler directly.

## Update strict metadata handling

The corrected callback types include additional event metadata fields and
nullable `display_message` and `transfer_status` values. Add null checks where
needed and update any manually constructed callback metadata used in tests.
