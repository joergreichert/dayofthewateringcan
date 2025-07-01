import { useContext } from 'react'

import { EditableContext } from '@/src/lib/api/EditableContextProvider'

const useEditableContext = () => {
  const editableInstance = useContext(EditableContext)
  const editable = editableInstance?.editable
  const setEditable = editableInstance?.setEditable
  const showModal = editableInstance?.showModal
  const setShowModal = editableInstance?.setShowModal

  return { editable, setEditable, showModal, setShowModal }
}

export default useEditableContext
