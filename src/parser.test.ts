import { MentionKind, NodeType } from "./types"
import parse from "./parser"

describe("Parser", () => {
	test("must return `[]` when no argument given.", () => {
		// JavaScript user can use
		expect((parse as any)()).toEqual([])
	})

	test("must parse empty string as `[]`.", () => {
		expect(parse("")).toEqual([])
	})

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
})
