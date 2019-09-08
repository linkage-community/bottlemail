import { NodeType } from "./types"
import tokenize from "./internal/lexer"
import { parseOnce } from "./internal/parse-once"

export default (s: string) => {
	let tokens = tokenize(s)
	const nodes: NodeType[] = []
	while (tokens.length > 0) {
		const [node, length] = parseOnce(tokens)
		tokens = tokens.slice(length)
		// note: null になるのは tokens が length: 0 のときのみ
		nodes.push(node!)
	}
	return nodes
}
