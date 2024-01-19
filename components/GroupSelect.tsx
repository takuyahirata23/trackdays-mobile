import React from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { GROUPS_DEV, GROUPS_PROD } from '@constants/groups'
import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'

const groups = process.env.NODE_ENV === 'development' ? GROUPS_DEV : GROUPS_PROD

type Props = {
  selected?: string
  onChange: (_id: string) => void
  error?: string
}

export function GroupSelect({ selected, onChange, error }: Props) {
  const {
    colors: { error: errorColor }
  } = useTheme()
  return (
    <View>
      <Text>Riding group</Text>
      {error && (
        <Text style={{ color: errorColor, marginTop: 8, fontSize: 14 }}>
          {error}
        </Text>
      )}
      <View style={styles.groupWrapper}>
        {groups.map(({ id, name }) => (
          <Pressable
            key={id}
            style={styles.option}
            onPress={() => onChange(id)}
          >
            {id === selected ? (
              <MaterialIcons name="radio-button-on" size={20} />
            ) : (
              <MaterialIcons name="radio-button-off" size={20} />
            )}
            <Text>{name}</Text>
          </Pressable>
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
