// Type Guard functions test

import {
	NodeType,
	isEmojiName,
	isMention,
	isText,
	isLink,
	EmojiNameKind,
	TextKind,
	LinkKind,
	MentionKind,
	ReferenceKind,
	isReference
} from "./types"

const emojiNameNode: NodeType = {
	kind: EmojiNameKind,
	value: "hello",
	raw: ":hello:"
}
const textNode: NodeType = {
	kind: TextKind,
	value: "text!",
	raw: "text!"
}
const linkNode: NodeType = {
	kind: LinkKind,
	value: "https://github.com",
	raw: "https://github.com"
}
const mentionNode: NodeType = {
	kind: MentionKind,
	value: "yo",
	raw: "@yo"
}
const referenceNode: NodeType = {
	kind: ReferenceKind,
	value: "100",
	raw: ">>100"
}

describe("Type Guards", () => {
	describe("isText", () => {
		test("when Text -> true", () => {
			expect(isText(textNode)).toBeTruthy()
		})
		test("when others -> false", () => {
			expect(isText(linkNode)).toBeFalsy()
			expect(isText(mentionNode)).toBeFalsy()
			expect(isText(emojiNameNode)).toBeFalsy()
		})
	})
	describe("isEmojiName", () => {
		test("when EmojiName -> true", () => {
			expect(isEmojiName(emojiNameNode)).toBeTruthy()
		})
		test("when others -> false", () => {
			expect(isEmojiName(linkNode)).toBeFalsy()
			expect(isEmojiName(mentionNode)).toBeFalsy()
			expect(isEmojiName(textNode)).toBeFalsy()
		})
	})
	describe("isLink", () => {
		test("when Link -> true", () => {
			expect(isLink(linkNode)).toBeTruthy()
		})
		test("when others -> false", () => {
			expect(isLink(textNode)).toBeFalsy()
			expect(isLink(mentionNode)).toBeFalsy()
			expect(isLink(emojiNameNode)).toBeFalsy()
		})
	})
	describe("isMention", () => {
		test("when Mention -> true", () => {
			expect(isMention(mentionNode)).toBeTruthy()
		})
		test("when others -> false", () => {
			expect(isMention(linkNode)).toBeFalsy()
			expect(isMention(textNode)).toBeFalsy()
			expect(isMention(emojiNameNode)).toBeFalsy()
		})
	})
	describe("isReference", () => {
		test("when Reference -> true", () => {
			expect(isReference(referenceNode)).toBeTruthy()
		})
		test("when others -> false", () => {
			expect(isReference(mentionNode)).toBeFalsy()
		})
	})
})
