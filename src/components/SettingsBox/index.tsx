import useEditableContext from '@/hooks/useEditableContext'
import { AppConfig } from '@/lib/AppConfig'

import { Button } from '../CreateDialog'

const SettingsBox = () => {
  const { editable, setEditable } = useEditableContext()

  return (
    <div className="mt-40 lg:mt-20 absolute z-10 left-3">
      <Button
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
