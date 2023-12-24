import React from 'react'
import { Link } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  href: {
    pathname: string
    params?: { [key: string]: string }
  }
}

export function HeaderLeft({ href }: Props) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="chevron-back" size={18} />
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 4
  }
})
