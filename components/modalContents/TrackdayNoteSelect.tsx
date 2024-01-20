import React from 'react'
import { View } from 'react-native'

import { FacilitySelect } from '../FacilitySelect'
import { TrackSelect } from '../TrackSelect'

type Props = {
  currentStep: 'facility' | 'track' | 'motorcycle'
}

export function TrackdayNoteSelect({ currentStep }: Props) {
  return (
    <View>
      {currentStep === 'facility' && <FacilitySelect />}
      {currentStep === 'track' && <TrackSelect />}
    </View>
  )
}
