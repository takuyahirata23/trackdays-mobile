import React from 'react'
import { StyleSheet } from 'react-native'
import BSComp from '@gorhom/bottom-sheet'

import type { BottomSheetProps } from '@gorhom/bottom-sheet'

type Ref = BSComp

type Props = {} & BottomSheetProps

export const BottomSheet = React.forwardRef<Ref, Props>(({ children, ...rest }, ref) => {
  return (
    <BSComp ref={ref} backgroundStyle={styles.bottomSheet} 
        snapPoints={['40%']}
        {...rest}
    >
      {children}
    </BSComp>
  )
})

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
  }
})
