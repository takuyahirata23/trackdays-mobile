import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import BSComp, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { Ionicons } from '@expo/vector-icons'

import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'

import type { BottomSheetProps } from '@gorhom/bottom-sheet'

type Ref = BSComp

type Props = {} & BottomSheetProps

export const BottomSheet = React.forwardRef<Ref, Props>(
  ({ children, ...rest }, ref) => {
    return (
      <BSComp
        ref={ref}
        backgroundStyle={styles.bottomSheet}
        snapPoints={['40%']}
        {...rest}
      >
        {children}
      </BSComp>
    )
  }
)

export function BoomSheetItemList({ data, onChange, currentValue }: any) {
  const{ colors: { accent }} = useTheme()
  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={(item: { id: string; name: string }) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onChange(item.id)}>
          <View style={styles.itemWrapper}>
            {currentValue === item.id ? (
              <Ionicons name="radio-button-on" size={22} color={accent}/>
            ) : (
              <Ionicons name="radio-button-off" size={22} color={accent}/>
            )}
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12
  },
  itemWrapper: {
    flexDirection: 'row',
    columnGap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  itemText: {
    fontSize: 20
  }
})
