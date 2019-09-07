type Token<T extends string> = {
  type: T,
  payload: string,
}
export type TokenType = Token<"AT"> | Token<"TEXT"> | Token<"WHITESPACE"> | Token<"COLON">

export default function tokenize(s: string, iv: TokenType[] = []): TokenType[] {
  if (s.length === 0) return iv

  // remove whitespaces
  const ws = /^\s+/.exec(s)
  if (ws) {
    return tokenize(
      s.substr(ws[0].length),
      [
        ...iv,
        {
          type: "WHITESPACE",
          payload: ws[0]
        }
      ]
    )
  }

  // atmark
  if (s.startsWith('@')) {
    return tokenize(
      s.substr(1),
      [
        ...iv,
        {
          type: "AT",
          payload: "@"
        }
      ]
    )
  }

  // colon
  if (s.startsWith(':')) {
    return tokenize(
      s.substr(1),
      [
        ...iv,
        {
          type: 'COLON',
          payload: ':'
        }
      ]
    )
  }

  // text
  const trr = /^[^\s:]+/.exec(s)
  return tokenize(
    s.substr(trr[0].length),
    [
      ...iv,
      {
        type: "TEXT",
        payload: trr[0]
      }
    ]
  )
}
