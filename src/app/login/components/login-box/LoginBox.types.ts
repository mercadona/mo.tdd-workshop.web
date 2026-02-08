export type LoginBoxProps = {
  userId: string
  validateAndSaveUser: () => void
  session: {
    uuid: string
    name: string
  }
}
