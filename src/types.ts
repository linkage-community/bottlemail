export const TextType = 'Text'
export type Text = {
  type: typeof TextType,
  payload: string,
}
export const EmojiNameType = 'EmojiName'
export type EmojiName = {
  type: typeof EmojiNameType,
  // > ":smile:"
  payload: string,
  // > "smile"
  name: string,
}
export const LinkType = 'Link'
export type Link = {
  type: typeof LinkType,
  payload: string
}
export const MentionType = 'Mention'
export type Mention = {
  type: typeof MentionType,
  // > "@dolphin"
  payload: string,
  // > "dolphin"
  username: string,
}
export type Node = Link | Text | Mention | EmojiName

export const isText = (n: Node): n is Text => {
  return n.type === TextType
}
export const isEmojiName = (n: Node): n is EmojiName => {
  return n.type === EmojiNameType
}
export const isLink = (n: Node): n is Link => {
  return n.type === LinkType
}
export const isMention = (n: Node): n is Mention => {
  return n.type === MentionType
}
