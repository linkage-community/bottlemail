import tokenize, { TokenType } from "./lexer"

describe("Lexer", () => {
	const expectedATToken: TokenType = {
		type: "AT",
		payload: "@"
	}
	const expectedCOLONToken: TokenType = {
		type: "COLON",
		payload: ":"
	}

	describe("Type 'AT' cases", () => {
		const test1times = "@"
		test(`'${test1times}' must have 1 length. All tokens must be 'AT' type.`, () => {
			const tokens = tokenize(test1times)
			expect(tokens).toEqual([expectedATToken])
		})

		const test5times = test1times.repeat(5)
		test(`'${test5times}' must have 5 length. All tokens must be  'AT' type.`, () => {
			const tokens = tokenize(test5times)
			expect(tokens).toEqual(new Array(5).fill(expectedATToken))
		})
	})

	describe("Type 'COLON' cases", () => {
		const test1times = ":"
		test(`'${test1times}' must have 1 length. All tokens must be 'COLON' type.`, () => {
			const tokens = tokenize(test1times)
			expect(tokens).toEqual([expectedCOLONToken])
		})

		const test5times = test1times.repeat(5)
		test(`'${test5times}' must have 5 length. All tokens must be 'COLON' type.`, () => {
			const tokens = tokenize(test5times)
			expect(tokens).toEqual(new Array(5).fill(expectedCOLONToken))
		})
	})

	describe("Type 'WHITESPACE' cases", () => {
		const space = " "
		test(`SPACE must have 1 length. All tokens must be 'TEXT' type.`, () => {
			const tokens = tokenize(space)
			const expected: TokenType[] = [
				{
					type: "WHITESPACE",
					payload: space
				}
			]
			expect(tokens).toEqual(expected)
		})

		const tab = "\t"
		test(`TAB must have 1 length. All tokens must be 'TEXT' type.`, () => {
			const tokens = tokenize(tab)
			const expected: TokenType[] = [
				{
					type: "WHITESPACE",
					payload: tab
				}
			]
			expect(tokens).toHaveLength(1)
			expect(tokens).toEqual(expected)
		})

		const lf = "\n"
		test(`LF must have 1 length. All tokens must be 'WHITESPACE' type.`, () => {
			const tokens = tokenize(lf)
			const expected: TokenType = {
				type: "WHITESPACE",
				payload: lf
			}
			expect(tokens).toHaveLength(1)
			expect(tokens[0]).toEqual(expected)
		})

		const long = [space.repeat(5), lf.repeat(3), tab.repeat(3)].join("")
		test(`long whitespaces (${long}) must have 1 length. All tokens must be 'WHITESPACE' type.`, () => {
			const tokens = tokenize(long)
			const expected: TokenType[] = [
				{
					type: "WHITESPACE",
					payload: long
				}
			]
			expect(tokens).toEqual(expected)
		})
	})

	describe("Type 'TEXT' cases", () => {
		const test1 = "This=is=text!!!~~HAPPY~~YEAH!"
		test(`'${test1}' must have 1 length. All tokens must be 'TEXT' type.`, () => {
			const tokens = tokenize(test1)
			const expected: TokenType[] = [
				{
					type: "TEXT",
					payload: test1
				}
			]
			expect(tokens).toEqual(expected)
		})
	})

	describe("Complex cases", () => {
		const testcase1 =
			"@otofune Yo! :smile: https://github.com/ http://[fe80::a1b3:125d:c1f8:4780]/ @ @test"
		test(`'${testcase1}' must equal to snapshot`, () => {
			const tokens = tokenize(testcase1)
			expect(tokens).toMatchSnapshot()
		})

		const testcase2 = "@ :smile:"
		test(`'${testcase2}' must be expected`, () => {
			const tokens = tokenize(testcase2)
			const expected: TokenType[] = [
				expectedATToken,
				{
					type: "WHITESPACE",
					payload: " "
				},
				expectedCOLONToken,
				{
					type: "TEXT",
					payload: "smile"
				},
				expectedCOLONToken
			]
			expect(tokens).toEqual(expected)
		})
	})
})
