import {
	NodeType,
	TextKind as UnknownKind,
	EmojiNameKind,
	MentionKind,
	LinkKind,
	TextKind
} from "./types"
import { groupBy } from "./utils"

const lowercase = "abcdefghijklmnopqrstuvwxyz".split("")
const uppercase = lowercase.map(c => c.toUpperCase())
const numeric = "1234567890".split("")
const whitespace = ["\n", " "]

type Diff<L, R> = L extends R ? (R extends L ? never : R) : L
type ExplicitKind = Diff<NodeType["kind"], "Text">

type Rule = {
	kind: ExplicitKind
	startsWith: string[]
	minimumValueLength: number
	leaveChars: string[]
	includeLeaveChar: boolean
	validValueChars?: string[]
	transformToValue?: (s: string) => string
}

// 優先度順
const rules: Rule[] = [
	{
		kind: LinkKind,
		startsWith: ["http://", "https://"],
		minimumValueLength: 7,
		includeLeaveChar: false,
		leaveChars: whitespace
	},
	{
		kind: MentionKind,
		startsWith: ["@"],
		validValueChars: [...lowercase, ...uppercase, ...numeric, "_"],
		transformToValue: s => s.slice(1),
		minimumValueLength: 1,
		includeLeaveChar: false,
		leaveChars: whitespace
	},
	{
		kind: EmojiNameKind,
		startsWith: [":"],
		validValueChars: [
			...lowercase,
			...uppercase,
			...numeric,
			..."+-_".split("")
		],
		transformToValue: s => s.slice(1, s.length - 1),
		minimumValueLength: 1,
		includeLeaveChar: true,
		leaveChars: [":"]
	}
]

function* parse(source: string) {
	let rule: Rule | null = null
	let consumedCount: number | null = null

	function consume(rule: Rule | null, end: number): NodeType {
		// [consumedCount ? consumedCount+1 : 0, end]
		const raw = source.slice(
			consumedCount != null ? consumedCount + 1 : 0,
			end + 1
		)
		const value =
			rule && rule.transformToValue ? rule.transformToValue(raw) : raw

		consumedCount = end

		if (rule !== null && value.length >= rule.minimumValueLength) {
			return {
				kind: rule.kind,
				raw,
				value
			}
		} else {
			return {
				kind: UnknownKind,
				raw,
				value: raw
			}
		}
	}

	for (let i = 0; i < source.length; i++) {
		const char = source[i]

		/** Dig values */
		if (rule !== null) {
			// 1. Valid -> continue
			if (
				rule.validValueChars !== undefined &&
				rule.validValueChars.includes(char)
			) {
				continue
			}

			// 2. Escape -> consume
			if (rule.includeLeaveChar == true && rule.leaveChars.includes(char)) {
				/* include & leave, [consumedCount+1 || 0, i]. */
				yield consume(rule, i)
				rule = null
				continue
			} else if (rule.leaveChars.includes(char)) {
				/* exclude & leave, [consumedCount+1 || 0, i[. MUST NOT USE continue because must find kind with current char */
				yield consume(rule, i - 1)
				rule = null
			}

			// 3. If no validValueChars, all are valid -> continue
			if (rule && rule.validValueChars === undefined) {
				continue
			}

			// Z. Invalid -> Left to dig new kind
			if (rule && rule.validValueChars) {
				rule = null
			}
		}

		/** Dig kind */
		if (whitespace.includes(char)) continue
		if ("\\" === char) {
			// skip next charactor
			i++
			continue
		}
		rule =
			rules.find(({ startsWith }): boolean => {
				return startsWith.some(expected => {
					const actual =
						expected.length === 1 ? char : source.slice(i, i + expected.length)
					return expected === actual
				})
			}) || null
		if (rule !== null) {
			/** emit unknown type */
			// [consumeCount+1, i[, [0, i[
			yield consume(null, i - 1)
		}
	}

	yield consume(rule, source.length)
}

function combineStraightTextNodes(nodes: NodeType[]): NodeType[] {
	return groupBy(nodes, (l, r) => l.kind === r.kind)
		.map(sameTypeNodes => {
			switch (sameTypeNodes[0].kind) {
				case TextKind:
					const text = sameTypeNodes.reduce((c, n) => c + n.raw, "")
					if (text.length === 0) return []
					const node: NodeType = {
						kind: TextKind,
						value: text,
						raw: text
					}
					return [node]
				default:
					return sameTypeNodes
			}
		})
		.reduce((flatten, remain) => [...flatten, ...remain], [] as NodeType[])
}
const ZWSP = ["\u202c", "%E2%80%AC"]
function removeTrailingZWSPFromLinkNodeValue(nodes: NodeType[]): NodeType[] {
	return nodes.map(node => {
		switch (node.kind) {
			case LinkKind: {
				if (!ZWSP.some(s => node.value.endsWith(s))) return node
				return {
					...node,
					value: ZWSP.reduce((value, zwsp) => {
						if (!value.endsWith(zwsp)) return value
						return value
							.split("")
							.slice(0, -zwsp.length)
							.join("")
					}, node.value)
				}
			}
			default:
				return node
		}
	})
}

const compose = <T>(...handlers: ((a: T) => T)[]) => (a: T) =>
	handlers.reduce((a, h) => h(a), a)
const optimize = compose(
	combineStraightTextNodes,
	removeTrailingZWSPFromLinkNodeValue
)
export default (s: string) => {
	// TypeScript scripts will be compiled to JavaScript, so users can pass ANY values not string...
	if (typeof s !== "string") return []
	if (s.length === 0) return []

	return optimize(Array.from(parse(s)))
}
