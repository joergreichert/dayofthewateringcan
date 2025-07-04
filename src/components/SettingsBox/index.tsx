import useEditableContext from '@/hooks/useEditableContext'

import Button from '../Button/index'

const SettingsBox = () => {
  const { editable, setEditable, showModal } = useEditableContext()

  return (
    <div className="mt-[35%] sm:mt-40 xl:mt-20 absolute z-2 left-3">
      <Button
        hidden={showModal}
        disabled={editable}
        type="button"
        onClick={e => {
          if (setEditable) {
            setEditable(!editable)
          }
        }}
      >
        {!editable ? 'Neue Gießung eintragen' : 'Bitte auf Karte klicken'}
      </Button>
    </div>
  )
}

export default SettingsBox
