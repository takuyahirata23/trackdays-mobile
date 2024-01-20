import React from 'react'
import { View } from 'react-native'

import { FacilitySelect } from '../FacilitySelect'
import { TrackSelect } from '../TrackSelect'
import { MotorcycleSelect } from '../MotorcycleSelect'

type Props = {
  currentStep: 'facility' | 'track' | 'motorcycle'
}

export function TrackdayNoteSelect({ currentStep }: Props) {
  return (
    <View>
      {currentStep === 'facility' && <FacilitySelect />}
      {currentStep === 'track' && <TrackSelect />}
      {currentStep === 'motorcycle' && <MotorcycleSelect />}
    </View>
  )
}
