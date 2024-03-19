type ActionButtonProps = {
  actionType?: 'add' | 'syncExport'
  click?: () => void
  hidden?: boolean | (() => boolean)
  loading?: boolean
}

export type { ActionButtonProps }
