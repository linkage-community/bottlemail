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

NodeType について
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
`is${kind}` というヘルパ関数があるので、これを使うとよい。
[src/types.ts](./src/types.ts) に定義されているが、[src/index.ts](./src/index.ts) から re-export されているため、直接 import できる

## 想定 Q&A

### 空文字列 (`""`) のときはどのような結果になりますか？
空配列になる

### 例外は発生しますか？
発生しない。文字列でないものが与えられた場合、空配列になる

### `Link` Kind では、`node.raw` と `node.value` に違いはありますか？
URL として無効な文字列を除去したものが入る。  
現在は iOS でコピーアンドペーストすると稀に発生することがある、末尾についた ZWSP (ゼロ幅スペース) を除去する。
