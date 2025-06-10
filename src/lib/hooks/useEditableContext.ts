import { useContext } from 'react'

import { EditableContext } from '@/src/lib/api/EditableContextProvider'

const useEditableContext = () => {
  const editableInstance = useContext(EditableContext)
  const editable = editableInstance?.editable
  const setEditable = editableInstance?.setEditable

  return { editable, setEditable }
}

export default useEditableContext
