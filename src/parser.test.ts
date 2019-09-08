import { dic as emojiNameDic } from 'pictograph'
import { EmojiNameKind, NodeType } from './types';
import parser from './parser';

describe('Parser', () => {
	describe('Emoji', () => {
		for (const emojiName of Object.keys(emojiNameDic)) {
			test(`':${emojiName}:' must be parsed as '${EmojiNameKind}' kind.`, () => {
				const emojiNameWithColon = `:${emojiName}:`
				const nodes = parser(emojiNameWithColon)
				const expected: NodeType[] = [
					{
						kind: EmojiNameKind,
						value: emojiName,
						raw: emojiNameWithColon
					}
				]
				expect(nodes).toEqual(expected)
			})
		}
	})
})
