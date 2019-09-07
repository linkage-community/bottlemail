type Node<T> = {
  kind: T,
  value: string,
  raw: string,
}

export const TextKind = 'Text'
// raw, value are same
export type Text = Node<typeof TextKind>

export const EmojiNameKind = 'EmojiName'
// eg: raw => ':smile:', value => 'smile'
export type EmojiName = Node<typeof EmojiNameKind>

export const LinkKind = 'Link'
// raw, value are same
export type Link = Node<typeof LinkKind>

export const MentionKind = 'Mention'
// eg: raw => '@dolphin', value => 'dolphin'
export type Mention = Node<typeof MentionKind>

export type NodeList = Link | Text | Mention | EmojiName

// helpers
export const isText = (n: NodeList): n is Text => {
  return n.kind === TextKind
}
export const isEmojiName = (n: NodeList): n is EmojiName => {
  return n.kind === EmojiNameKind
}
export const isLink = (n: NodeList): n is Link => {
  return n.kind === LinkKind
}
export const isMention = (n: NodeList): n is Mention => {
  return n.kind === MentionKind
}
