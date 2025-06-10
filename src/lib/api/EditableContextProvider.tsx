import { Context, createContext, useState } from 'react'

interface EditableContextValues {
  editable: boolean
  setEditable: (e: boolean) => void
}

export const EditableContext: Context<EditableContextValues | undefined> = createContext<
  EditableContextValues | undefined
>(undefined)

interface EditableContextProviderProps {
  children: React.ReactNode
}

const EditableContextProvider = ({ children }: EditableContextProviderProps) => {
  const [editable, setEditable] = useState<boolean>(false)

  return (
    <EditableContext.Provider value={{ editable, setEditable }}>
      {children}
    </EditableContext.Provider>
  )
}

export default EditableContextProvider
