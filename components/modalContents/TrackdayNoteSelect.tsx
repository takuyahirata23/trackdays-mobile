import React from 'react'
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from '../Text'
import { FacilitySelect } from '../FacilitySelect'

type Props = {
  currentStep: 'facility' | 'track' | 'motorcycle'
}

export function TrackdayNoteSelect({ currentStep }: Props) {
  return <View>{currentStep === 'facility' && <FacilitySelect />}</View>
}
