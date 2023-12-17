import React from 'react'
import { View, ViewProps, StyleSheet } from 'react-native'

import { Text } from './Text'
import { useTheme } from '@hooks/useTheme'

export type Props = {
  variant?: 'primary' | 'secondary'
  heading?: string
  sidebarVariant?: 'primary' | 'secondary'
} & ViewProps

export function Card({
  children,
  style,
  variant = 'primary',
  heading,
  sidebarVariant
}: Props) {
  const {
    colors: { card, subcard, primary, accent, tertiary }
  } = useTheme()

  const isPrimary = variant === 'primary'

  return (
    <View
      style={[styles.wrapper, { backgroundColor: isPrimary ? card : subcard }]}
    >
      <View
        style={[
          { backgroundColor: isPrimary ? card : subcard, shadowColor: primary },
          styles.card,
          isPrimary ? styles.primary : styles.secondary,
          isPrimary && sidebarVariant ? styles.paddingWidthSidebar : {},
          style
        ]}
      >
        {sidebarVariant && (
          <View
            style={[
              styles.sidebar,
              {
                backgroundColor:
                  sidebarVariant === 'primary' ? accent : tertiary
              }
            ]}
          />
        )}
        {heading && <Text style={styles.heading}>{heading}</Text>}
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.15
  },
  paddingWidthSidebar: {
    paddingLeft: 24,
    paddingRight: 16,
    paddingHorizontal: 16
  },
  card: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 8
  },
  primary: {
    padding: 16
  },
  secondary: {
    padding: 8
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    bottom: 0
  }
})
