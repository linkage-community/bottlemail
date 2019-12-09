import { MentionKind, TextKind, EmojiNameKind } from "./types"
import parse from "./parser"

import pictograph from "pictograph"

describe("Parser", () => {
	it("must return `[]` when no argument given.", () => {
		// JavaScript user can use
		expect((parse as any)()).toEqual([])
	})

	it("must parse empty string as `[]`.", () => {
		expect(parse("")).toEqual([])
	})

	describe("complex cases", () => {
		const testcase1 =
			"@otofune Yo! :smile: https://github.com/ http://[fe80::a1b3:125d:c1f8:4780]/ @ @test"
		test(`must parse '${testcase1}' as equivalent to the snapshot.`, () => {
			expect(parse(testcase1)).toMatchSnapshot()
		})

		const testcase2 =
			"This includes special identifiers :aa @*  but all are invalid as Emoji, Mention."
		test(`must parse '${testcase2}' as '${TextKind}' kind node.`, () => {
			expect(parse(testcase2)).toEqual([
				{ kind: TextKind, value: testcase2, raw: testcase2 }
			])
		})
	})

	describe("simple cases", () => {
		const testcase1 = "@dolphin"
		const testcase1Expected = "dolphin"
		it(`must parse '${testcase1}' as node with value '${testcase1Expected}'`, () => {
			expect(parse(testcase1)).toEqual([
				{ kind: MentionKind, value: testcase1Expected, raw: testcase1 }
			])
		})

		describe("about " + EmojiNameKind, () => {
			for (const name of Object.keys(pictograph.dic)) {
				const emojiName = `:${name}:`
				it(`must parse '${emojiName}' as ${EmojiNameKind} node with value '${name}'`, () => {
					expect(parse(emojiName)).toEqual([
						{
							kind: EmojiNameKind,
							value: name,
							raw: emojiName
						}
					])
				})
			}
		})
	})

	it(`"(@dolphin hi)" correctly parse`, () => {
		expect(parse("(@dolphin hi)")).toEqual([
			{ kind: TextKind, value: "(", raw: "(" },
			{ kind: MentionKind, value: "dolphin", raw: "@dolphin" },
			{ kind: TextKind, value: " hi)", raw: " hi)" }
		])
	})

	const nonURLStartsWithHTTP = "httpisgod"
	it(`parse "${nonURLStartsWithHTTP}" as Text`, () => {
		expect(parse(nonURLStartsWithHTTP)).toEqual([
			{ kind: TextKind, value: "httpisgod", raw: "httpisgod" }
		])
	})
})
