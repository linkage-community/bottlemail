import { dic as emojiNameDic } from "pictograph"
import {
	EmojiNameKind,
	LinkKind,
	TextKind,
	MentionKind,
	NodeType
} from "./types"
import parse, { parseOne } from "./parser"
import tokenize, { TokenType } from "./internal/lexer"

type ParseOneResult<T = typeof parseOne> = T extends (
	tokens: TokenType[]
) => infer R
	? R
	: void

describe("Parser", () => {
	describe("parse", () => {
		const testcase1 =
			"@otofune Yo! :smile: https://github.com/ http://[fe80::a1b3:125d:c1f8:4780]/ @ @test"
		test(`must parse '${testcase1}' as equivalent to the snapshot.`, () => {
			expect(parse(testcase1)).toMatchSnapshot()
		})

		const testcase2 = "@mention@mention"
		test(`must parse '${testcase2}' as '${MentionKind}' kind nodes.`, () => {
			const expected: NodeType[] = new Array<NodeType>(2).fill({
				kind: MentionKind,
				value: "mention",
				raw: "@mention"
			})
			expect(parse(testcase2)).toEqual(expected)
		})

		test("must parse empty string as `[]`.", () => {
			expect(parse("")).toEqual([])
		})
	})

	describe("parseOne", () => {
		test("must parse empty string as `[null, 0]`.", () => {
			const tokens = tokenize("")
			expect(tokens).toEqual([])
			const result = parseOne(tokens)
			expect(result).toEqual([null, 0])
		})

		describe(`must parse testcases as '${MentionKind}' kind.`, () => {
			const testcase1 = "@dolphin YO!"
			const testcase1ExpectedValue = "dolphin"
			test(`'${testcase1}' will be node having '${testcase1ExpectedValue}'.`, () => {
				const tokens = tokenize(testcase1)
				const result = parseOne(tokens)
				const expected: ParseOneResult = [
					{
						kind: MentionKind,
						value: testcase1ExpectedValue,
						raw: `@${testcase1ExpectedValue}`
					},
					2
				]
				expect(result).toEqual(expected)
			})
		})

		describe(`must parse testcases as '${EmojiNameKind}' kind.`, () => {
			for (const emojiName of Object.keys(emojiNameDic)) {
				const emojiNameWithColon = `:${emojiName}:`
				test(emojiNameWithColon, () => {
					const tokens = tokenize(emojiNameWithColon)
					const result = parseOne(tokens)
					const expected: ParseOneResult = [
						{
							kind: EmojiNameKind,
							value: emojiName,
							raw: emojiNameWithColon
						},
						tokens.length
					]
					expect(result).toEqual(expected)
				})
			}
		})

		describe(`must parse testcases as '${LinkKind}'kind.`, () => {
			const link1 = "http://[fe80::a1b3:125d:c1f8:4780]/"
			test(link1, () => {
				const tokens = tokenize(link1)
				const result = parseOne(tokens)
				const expected: ParseOneResult = [
					{
						kind: LinkKind,
						value: link1,
						raw: link1
					},
					tokens.length
				]
				expect(result).toEqual(expected)
			})
		})

		describe(`must parse testcases as '${TextKind}' kind.`, () => {
			const testcase1 =
				"This is what string but... :moe: <- after this must not be consumed"
			const testcase1ExpectedValue = testcase1.split(":")[0]
			test(`'${testcase1}' will be node having '${testcase1ExpectedValue}'.`, () => {
				const tokens = tokenize(testcase1)
				const result = parseOne(tokens)
				const expected: ParseOneResult = [
					{
						kind: TextKind,
						value: testcase1ExpectedValue,
						raw: testcase1ExpectedValue
					},
					10
				]
				expect(result).toEqual(expected)
			})

			const testcase2 =
				"This includes special identifiers :aa @*  but all are invalid as Emoji, Mention."
			test(`'${testcase2}' will be node having '${testcase2}'.`, () => {
				const tokens = tokenize(testcase2)
				const result = parseOne(tokens)
				const expected: ParseOneResult = [
					{
						kind: TextKind,
						value: testcase2,
						raw: testcase2
					},
					tokens.length
				]
				expect(result).toEqual(expected)
			})
		})
	})
})
