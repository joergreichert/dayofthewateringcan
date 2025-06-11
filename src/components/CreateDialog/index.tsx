import InputNumber from 'rc-input-number'
import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'

import useEditableContext from '@/hooks/useEditableContext'
import { WATER_TYPE_ID } from '@/lib/constants'

const Overlay = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(52, 64, 84, 0.6);
  backdrop-filter: blur(8px);
  animation: fadein 0.5s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25rem;
  height: 18rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.1), 0px 8px 8px -4px rgba(16, 24, 40, 0.04);
  transition: all 0.5s ease;
  z-index: 1;
`

const Button = styled.button`
  background-color: #3f51b5;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: #283593;
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

export interface LiterOption {
  readonly value: number
  readonly label: string
}

export interface WaterTypeOption {
  readonly value: WATER_TYPE_ID
  readonly label: string
}

type ModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>
  latitude: number | undefined
  longitude: number | undefined
}

export const WateringModal: React.FC<ModalProps> = ({
  setShowModal,
  setSubmit,
  latitude,
  longitude,
}: ModalProps) => {
  const { editable, setEditable } = useEditableContext()
  const defaultWaterTypeOptions: readonly WaterTypeOption[] = [
    { value: WATER_TYPE_ID.NOT_SPECIFIED, label: 'Keine Angabe' },
    { value: WATER_TYPE_ID.RAINWATER, label: 'Regenwasser' },
    { value: WATER_TYPE_ID.SERVICEWATER, label: 'Brauchwasser' },
    { value: WATER_TYPE_ID.TAPWATER, label: 'Leitungswasser' },
    { value: WATER_TYPE_ID.RIVERWATER, label: 'Flußwasser' },
    { value: WATER_TYPE_ID.OTHER_WATER, label: 'anderes Wasser' },
  ]
  const getWaterTypeValue = (label: string): WATER_TYPE_ID => {
    const found = defaultWaterTypeOptions.filter(opt => opt.label === label)
    if (found && found.length > 0) {
      return found[0].value
    }
    return WATER_TYPE_ID.NOT_SPECIFIED
  }
  const createWaterTypeOption = (label: string): WaterTypeOption => ({
    label,
    value: getWaterTypeValue(label),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [literValue, setLiterValue] = useState(0)
  const [waterTypeOptions, setWaterTypeOptions] = useState(defaultWaterTypeOptions)
  const [waterTypeValue, setWaterTypeValue] = useState<WaterTypeOption | null>(
    defaultWaterTypeOptions[0],
  )

  const handleCreateWaterType = (inputValue: string) => {
    setIsLoading(true)
    setTimeout(() => {
      const newOption = createWaterTypeOption(inputValue)
      setIsLoading(false)
      setWaterTypeOptions(prev => [...prev, newOption])
      setWaterTypeValue(newOption)
    }, 1000)
  }

  const handleSubmit = () => {
    setSubmit(true)
    setShowModal(false)
    setEditable && setEditable(false)
  }

  return (
    <Overlay onClick={() => setShowModal(false)}>
      <Modal onClick={e => e.stopPropagation()}>
        <div className="w-full p-5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[max-content_1fr] gap-3 p-5">
              <span>Ort</span>
              <span>{longitude}</span>
              <span className="mt-2">Gegossene Liter</span>
              <InputNumber
                controls
                onChange={elem => elem && setLiterValue(elem)}
                style={{ borderWidth: '1px', borderStyle: 'solid', boxSizing: 'border-box' }}
                className="m-1 p-1"
                value={literValue}
                min={0}
                max={300}
                step={1}
              />
              <span className="mt-2">Verwendetes Wasser</span>
              <CreatableSelect
                id="water-type-select"
                isDisabled={isLoading}
                isLoading={isLoading}
                formatCreateLabel={newValue => `${newValue} anlegen`}
                onChange={newValue => setWaterTypeValue(newValue)}
                onCreateOption={handleCreateWaterType}
                options={waterTypeOptions}
                value={waterTypeValue}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 p-5">
              <Button type="submit">Eintragen</Button>
              <Button type="button" onClick={() => setShowModal(false)}>
                Abbrechen
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </Overlay>
  )
}
