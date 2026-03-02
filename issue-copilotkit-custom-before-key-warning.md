Title
Warning: duplicate React keys for custom message renderers (`${message.id}-custom-before/-custom-after`)

## Summary
When using `renderCustomMessages`, CopilotKit v2 renders “custom before/after” UI for each message with React keys derived only from `message.id`:

- `${message.id}-custom-before`
- `${message.id}-custom-after`

If the same `message.id` can appear more than once in the rendered list (which can happen in practice depending on message merging, placeholder/state snapshot messages, or rehydration), React logs the warning about duplicate keys. It’s not a functional error, but it’s noisy and makes debugging harder.

## Where it happens
Repo: https://github.com/CopilotKit/CopilotKit

File:
- [`packages/v2/react/src/components/chat/CopilotChatMessageView.tsx`](https://github.com/CopilotKit/CopilotKit/blob/main/packages/v2/react/src/components/chat/CopilotChatMessageView.tsx)

## Expected behavior
Custom “before/after” message elements should always have stable, unique keys for a given rendered message element.

## Actual behavior
React warning in console (typical):
- “Encountered two children with the same key … Keys should be unique…”

## Why this happens (root cause)
The key is computed only from `message.id` + the constant suffix (`custom-before` / `custom-after`). That assumes `message.id` is unique across all rendered message items.

In real usage, the message view can end up rendering entries where `message.id` is repeated in the list (for example: messages can be re-inserted/merged from different sources, placeholders/state snapshots can shadow/duplicate IDs, or a backend can emit non-unique IDs). When that happens, the custom UI elements also duplicate their keys, triggering React’s warning.

## Proposed fix
Include more disambiguating information in the key—at minimum `message.role` (minimal change), and optionally `index` as a fallback.

Change keys in `CopilotChatMessageView.tsx`:

Before:
```ts
key={`${message.id}-custom-before`}
key={`${message.id}-custom-after`}
```

After (minimal improvement):
```ts
key={`${message.id}-${message.role}-custom-before`}
key={`${message.id}-${message.role}-custom-after`}
```

Optional “bulletproof” version (guaranteed unique even if id+role duplicates):
```ts
key={`${message.id}-${message.role}-${index}-custom-before`}
key={`${message.id}-${message.role}-${index}-custom-after`}
```

## Impact
- Removes an annoying console warning
- Makes custom message rendering more robust to imperfect/duplicate message IDs
- No breaking API change; only affects React keys
