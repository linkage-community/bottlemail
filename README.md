@linkage-community/bottlemail [![npm version](https://badge.fury.io/js/%40linkage-community%2Fbottlemail.svg)](https://badge.fury.io/js/%40linkage-community%2Fbottlemail) [![codecov](https://codecov.io/gh/linkage-community/bottlemail/branch/master/graph/badge.svg)](https://codecov.io/gh/linkage-community/bottlemail)
===

これはなに
---
文字列からメンション (`@dolphin`), ウェブサイト (`https://github.com`), 絵文字名 (`:emoji:`) を取りだすためのライブラリ

使いかた
---

```typescript
import parse, { NodeType } from '@linkage-community/bottlemail'
const nodes: NodeType[] = parse('@otofune Yo! :smile: https://github.com/ http://[fe80::a1b3:125d:c1f8:4780]/ @ @test')
console.dir(nodes)
/*
[ { kind: 'Mention', raw: '@otofune', value: 'otofune' },
  { kind: 'Text', raw: ' Yo! ', value: ' Yo! ' },
  { kind: 'EmojiName', raw: ':smile:', value: 'smile' },
  { kind: 'Text', raw: ' ', value: ' ' },
  { kind: 'Link',
    raw: 'https://github.com/',
    value: 'https://github.com/' },
  { kind: 'Text', raw: ' ', value: ' ' },
  { kind: 'Link',
    raw: 'http://[fe80::a1b3:125d:c1f8:4780]/',
    value: 'http://[fe80::a1b3:125d:c1f8:4780]/' },
  { kind: 'Text', raw: ' @ ', value: ' @ ' },
  { kind: 'Mention', raw: '@test', value: 'test' } ]
*/
```

記法について
---
詳しくは [src/parser.ts](./src/parser.ts) を参照するとよい

- 開始文字によって Kind の判定が始まる
- `\` (バックスラッシュ) があると次の文字の開始文字判定がスキップされる

NodeType はどういうデータなの
---

詳しくは [src/types.ts](./src/types.ts) を参照するとよい

```typescript
type NodeType = {
  kind: "EmojiName" | "Mention" | "Link" | "Text",
  value: string,
  raw: string,
}
```

### 例

種類|kind|raw|value
--|--|--|--
絵文字名|`EmojiName`|`:smile:`|`smile`
メンション|`Mention`|`@dolphin`|`dolphin`
テキスト|`Text`|`yee haw`|`yee haw`
ウェブサイト|`Link`|`https://github.com`|`https://github.com`

### Type Guard
`is${kind}` というヘルパ関数があり、これも [src/types.ts](./src/types.ts) に置いている

## 想定 Q&A

### 空文字列 (`""`) のときはどのような結果になりますか？
空の配列になる

### 例外は発生しますか？
発生しない。もし発生したら例外なので報告を。
