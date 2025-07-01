import React from 'react'

import Button from '../Button'
import Modal from '../Modal'
import Overlay from '../Overlay'

type SplashProps = {
  setShowSplash: React.Dispatch<React.SetStateAction<boolean>>
}

export const SplashScreen: React.FC<SplashProps> = ({ setShowSplash }: SplashProps) => {
  const handleClose = () => {
    setShowSplash(false)
  }

  return (
    <Overlay onClick={() => setShowSplash(false)}>
      <Modal onClick={e => e.stopPropagation()}>
        <div className="w-full p-5">
          <div className="grid grid-cols-2 gap-3 ml-5 mr-5">
            <Button type="button" onClick={handleClose}>
              Schließen
            </Button>
          </div>
        </div>
      </Modal>
    </Overlay>
  )
}
