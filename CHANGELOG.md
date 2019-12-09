2.1.0
===
- 新機能: [バックスラッシュでルール検出をスキップできるように](https://github.com/linkage-community/bottlemail/pull/60)

2.0.2
===
- バグ修正: [http から始まる文字列すべてが Link と扱われる不具合の修正](https://github.com/linkage-community/bottlemail/pull/56)

2.0.1
===
- バグ修正: [2文字目からテキストでない何かがはじまるとバグるのを修正](https://github.com/linkage-community/bottlemail/pull/49)
  + Thanks! @428rinsuki

2.0.0
===
- 内部実装のアーキテクチャが大幅に変更され、パース結果が破壊的に変更されたためメジャーバージョンアップしました (2faa213fef1b91367f9daa1bdf30bfdf85f6e5d3)
	- '@at@at' は今後有効ではありません

1.0.0
===
- parser: :+1: :-1: が絵文字名として認識されない問題の修正
	+ https://github.com/linkage-community/bottlemail/issues/6
- internal: テストを追加

0.1.5
===
- lexer: 空白が認識されなかったバグの修正
- parser: Mention でより厳密にスクリーンネーム部をチェックをするように
  + 参照: https://github.com/rinsuki/sea/blob/28f8a3d2de31df4d2e294b9f0fe4558f8f132175/src/db/entities/user.ts#L17
- parser: チェック関数をメモするように

0.1.3
===
- `@at@at` が `at@at` というメンションと解釈されていたバグの修正
    - https://github.com/linkage-community/bottlemail/issues/2

0.1.2
===
- [.npmignore] 追加
    - .gitignore が参照されており dist 配布ができていなかった

0.1.1
===
- [package.json] 型定義への参照が漏れていたため追加した

0.1.0
===
初回リリース
