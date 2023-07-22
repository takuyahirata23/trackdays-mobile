import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native'
import { useSearchParams, useNavigation } from 'expo-router'

import { Text } from '@components'

const titleMap: { [key: string]: string } = {
  registerMotorcycle: 'Add Motorcycle'
}

export default function ModalScreen() {
  const { name } = useSearchParams()
  const { setOptions } = useNavigation()

  React.useEffect(() => {
    setOptions({
      title: titleMap[String(name)]
    })
  }, [name, setOptions])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal!</Text>
      <View style={styles.separator} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
})
