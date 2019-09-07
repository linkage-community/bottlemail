import tokenize, { TokenType } from "./internal/lexer";
import { NodeType } from "./types";

const check = (t: TokenType["type"], p?: (s: string) => boolean) => (
  token: TokenType
) => {
  if (!p) return token.type === t;
  return token.type === t && p(token.payload);
};
const payloadReducer = (pv: string, t: TokenType): string => pv + t.payload;

export const parseOne = (tokens: TokenType[]): [NodeType | null, number] => {
  if (tokens.length === 0) return [null, 0];

  // Mention
  if (
    tokens.length >= 2 &&
    check("AT")(tokens[0]) &&
    check("TEXT")(tokens[1])
  ) {
    return [
      {
        kind: "Mention",
        raw: tokens.slice(0, 2).reduce(payloadReducer, ""),
        value: tokens[1].payload
      },
      2
    ];
  }

  // Link
  if (
    tokens.length >= 3 &&
    check("TEXT", p => ["http", "https"].includes(p))(tokens[0]) &&
    check("COLON")(tokens[1]) &&
    check("TEXT", p => p.startsWith("//"))(tokens[2])
  ) {
    const idx = tokens.findIndex(v => check("WHITESPACE")(v));
    // idx あるならそこまでで打ちどめ
    // index+1 が len だが、whitespace は含めないので
    const length = idx !== -1 ? idx : tokens.length;
    const raw = tokens.slice(0, length).reduce(payloadReducer, "");
    return [
      {
        kind: "Link",
        raw,
        value: raw
      },
      length
    ];
  }

  // emoji name :thinking:
  if (
    tokens.length >= 3 &&
    check("COLON")(tokens[0]) &&
    check("TEXT", p => /^\w+$/.test(p))(tokens[1]) &&
    check("COLON")(tokens[2])
  ) {
    return [
      {
        kind: "EmojiName",
        raw: tokens.slice(0, 3).reduce(payloadReducer, ""),
        value: tokens[1].payload
      },
      3
    ];
  }

  // Text
  const idx = tokens.findIndex(t => t.type === "WHITESPACE");
  // 次の whitespace まで消化する
  const length = idx !== -1 ? idx + 1 : tokens.length;
  const raw = tokens.slice(0, length).reduce(payloadReducer, "");
  const [node, index] = parseOne(tokens.slice(length));
  if (node && node.kind === "Text") {
    const joinedRaw = raw + node.raw;
    return [
      {
        kind: "Text",
        raw: joinedRaw,
        value: joinedRaw
      },
      length + index
    ];
  }
  return [
    {
      kind: "Text",
      raw,
      value: raw
    },
    length
  ];
};

export default (s: string) => {
  let tokens = tokenize(s);
  const nodes: NodeType[] = [];
  while (tokens.length > 0) {
    const [node, length] = parseOne(tokens);
    tokens = tokens.slice(length);
    // note: null になるのは tokens が length: 0 のときのみ
    nodes.push(node!);
  }
  return nodes;
};
