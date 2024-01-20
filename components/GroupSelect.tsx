import React from 'react'
import { View, StyleSheet,  StyleProp, TextStyle } from 'react-native'

import { GROUPS_DEV, GROUPS_PROD } from '@constants/groups'
import { Text } from './Text'
import { RadioOption } from './RadioOption'
import { useTheme } from '@hooks/useTheme'

const groups = process.env.NODE_ENV === 'development' ? GROUPS_DEV : GROUPS_PROD

type Props = {
  selected?: string
  onChange: (_id: string) => void
  error?: string
  titleStyle?: StyleProp<TextStyle>
}

export function GroupSelect({ selected, onChange, error, titleStyle }: Props) {
  const {
    colors: { error: errorColor }
  } = useTheme()
  return (
    <View>
      <Text style={titleStyle}>Riding group</Text>
      {error && (
        <Text style={{ color: errorColor, marginTop: 8, fontSize: 14 }}>
          {error}
        </Text>
      )}
      <View style={styles.groupWrapper}>
        {groups.map(({ id, name }) => (
          <RadioOption
            onPress={() => onChange(id)}
            label={name}
            isSelected={selected === id}
            key={id}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  groupWrapper: {
    marginTop: 20,
    rowGap: 12
  },
  option: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8
  }
})
