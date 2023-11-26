import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from './Text'

type Props = {
  onPressRight: () => void
  onPressLeft?: () => void
  rightText: string
  leftText?: string
}

export function BottomSheetHandle({
  rightText,
  onPressRight,
  leftText,
  onPressLeft
}: Props) {
  return (
    <View style={styles.wrapper}>
      {leftText && onPressLeft && (
        <TouchableOpacity onPress={onPressLeft} style={styles.btn}>
          <Text style={styles.text}>{leftText}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onPressRight} style={[styles.btn, styles.rightBtn]}>
        <Text style={styles.text}>{rightText}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  text: {
    fontWeight: '500'
  },
  btn: {
    padding: 4
  },
  rightBtn: {
    marginLeft: 'auto'
  }
})
