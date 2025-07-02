import InputNumber from 'rc-input-number'
import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

import useEditableContext from '@/hooks/useEditableContext'
import { useSaveWaterings } from '@/hooks/useWateringsApi'
import { WATER_TYPE_ID } from '@/lib/constants'
import { Watering } from '@/lib/types/entityTypes'

import Button from '../Button/index'
import Modal from '../Modal'
import Overlay from '../Overlay'

export interface LiterOption {
  readonly value: number
  readonly label: string
}

export interface WaterTypeOption {
  readonly value: WATER_TYPE_ID
  readonly label: string
}

type ModalProps = {
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>
  latitude: number | undefined
  longitude: number | undefined
  resolvedLocation: string | undefined
}

export const WateringModal: React.FC<ModalProps> = ({
  setSubmit,
  latitude,
  longitude,
  resolvedLocation,
}: ModalProps) => {
  const saveWaterings = useSaveWaterings()
  const { setEditable, setShowModal } = useEditableContext()
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
    const watering: Watering = {
      name: resolvedLocation,
      liter: literValue,
      latitude: latitude || 0,
      longitude: longitude || 0,
      watertype: waterTypeValue?.value || WATER_TYPE_ID.NOT_SPECIFIED,
      date: new Date(),
    }
    saveWaterings.mutateAsync(watering)

    setSubmit(true)
    setShowModal && setShowModal(false)
    setEditable && setEditable(false)
  }

  const handleCancel = () => {
    setSubmit(false)
    setShowModal && setShowModal(false)
    setEditable && setEditable(false)
  }

  return (
    <Overlay onClick={() => setShowModal && setShowModal(false)}>
      <Modal onClick={e => e.stopPropagation()}>
        <div className="w-full p-5">
          <div className="text-xl font-bold text-center">Gegossene Liter pro Stadtbaum</div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[max-content_1fr] gap-3 p-5">
              <span>Ort</span>
              <span style={{ height: '70px' }}>{resolvedLocation || '\n\n\n'}</span>
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
            <div className="grid grid-cols-2 gap-3 ml-5 mr-5">
              <Button type="submit">Eintragen</Button>
              <Button type="button" onClick={handleCancel}>
                Abbrechen
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </Overlay>
  )
}
