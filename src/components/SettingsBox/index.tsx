import useEditableContext from '@/hooks/useEditableContext'
import { AppConfig } from '@/lib/AppConfig'

const SettingsBox = () => {
  const { editable, setEditable } = useEditableContext()

  return (
    <button
      className="absolute z-10 left-5 top-5 bg-white p-3 z-10"
      disabled={editable}
      type="button"
      style={{ marginTop: AppConfig.ui.barHeight }}
      onClick={e => {
        if (setEditable) {
          setEditable(!editable)
        }
      }}
    >
      {!editable ? 'Neue Gießung eintragen' : 'Bitte auf Karte klicken'}
    </button>
  )
}

export default SettingsBox
