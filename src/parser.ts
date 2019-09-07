import tokenize, { Token } from "./lexer";
import { Node } from "./types";

const check = (t: Token['type'], p: (s: string) => boolean) => (token: Token) => {
  return token.type === t && p(token.payload)
}
const payloadReducer = (pv: string, t: Token): string => pv+t.payload

export const parseOne = (tokens: Token[]): [Node, number] => {
  if (tokens.length === 0) return [undefined, 0]

  // Mention
  if (tokens[0].type === 'AT' && tokens[1] && tokens[1].type === 'TEXT') {
    return [
      {
        type: "Mention",
        payload: tokens.slice(0,2).reduce(payloadReducer, ""),
        username: tokens[1].payload,
      },
      2
    ]
  }

  // Link
  if (
    tokens.length >= 3 &&
    check('TEXT', p => ['http', 'https'].includes(p))(tokens[0]) &&
    tokens[1].type === 'COLON' &&
    check('TEXT', p => p.startsWith('//'))(tokens[2])
  ) {
    const idx = tokens.findIndex(v => v.type === 'WHITESPACE')
    // idx あるならそこまでで打ちどめ
    // index+1 が len だが、whitespace は含めないので
    const length = idx !== -1 ? idx : tokens.length
    return [
      {
        type: 'Link',
        payload: tokens.slice(0, length).reduce(payloadReducer, ""),
      },
      length
    ]
  }

  // emoji name :thinking:
  if (
    tokens.length >= 3 &&
    tokens[0].type === 'COLON' &&
    check('TEXT', p => /^\w+$/.test(p)) &&
    tokens[2].type === 'COLON'
  ) {
    return [
      {
        type: 'EmojiName',
        payload: tokens.slice(0,3).reduce(payloadReducer,""),
        name: tokens[1].payload,
      },
      3
    ]
  }

  // Text
  const idx = tokens.findIndex(t => t.type === 'WHITESPACE')
  // 次の whitespace まで消化する
  const length = idx !== -1 ? idx+1 : tokens.length
  const payload = tokens.slice(0, length).reduce(payloadReducer, "")
  const [node,index] = parseOne(tokens.slice(length))
  if (node && node.type === 'Text') {
    return [
      {
        type: 'Text',
        payload: payload + node.payload
      },
      length + index
    ]
  }
  return [
    {
      type: 'Text',
      payload
    },
    length
  ]
}

export default (s: string) => {
  let tokens = tokenize(s)
  const nodes: Node[] = []
  while (tokens.length > 0) {
    console.dir(tokens)
    const [node, length] = parseOne(tokens)
    console.log(length)
    console.dir(node)
    tokens = tokens.slice(length)
    nodes.push(node)
  }
  return nodes
}
