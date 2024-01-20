import React from 'react'
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'
import {  useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'

import {
  MotorcycleFormContext,
  Motorcycle,
  Field
} from '@context/MotorcycleForm'
import { MAKES_QUERY, MODELS_QUERY } from '@graphql/queries'

import { Text } from '../Text'

const headers = {
  make: 'Pick your motorcycle make',
  model: 'Pick your motorcycle model'
}

type Props = {
  handleOnChange: (field: Field) => (value: string) => void
  setMotorcycle: (_motorcycle: any) => void
}

function MakeSelection({ handleOnChange, setMotorcycle }: Props) {
  const { loading, error, data } = useQuery(MAKES_QUERY)
  const { back } = useRouter()

  if (loading) {
    return <Text>loading...</Text>
  }

  if (error) {
    return null
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('make')(id)
    setMotorcycle({ make: name, model: '' })
    back()
  }
  return (
    <FlatList
      data={data.makes}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => onPress(item.id, item.name)}
        >
          <Text style={styles.optionText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  )
}

function ModelSelection({
  handleOnChange,
  setMotorcycle,
  makeId
}: Props & { makeId: string }) {
  const { data, loading, error } = useQuery(MODELS_QUERY, {
    variables: {
      makeId
    }
  })
  const { back } = useRouter()

  if (loading) {
    return <Text>loading...</Text>
  }

  if (error) {
    return null
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('model')(id)
    setMotorcycle((prev: Motorcycle) => ({ ...prev, model: name }))
    back()
  }
  return (
    <FlatList
      data={data.models}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => onPress(item.id, item.name)}
        >
          <Text style={styles.optionText}>{item.name}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
    />
  )
}

type P = {
  currentStep: 'make' | 'model'
}

export function MotorcycleRegistrationSelect({ currentStep }: P) {
  const { handleOnChange, setMotorcycle, fields } = React.useContext(
    MotorcycleFormContext
  )

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headers[currentStep]}</Text>
      {currentStep === 'make' && (
        <MakeSelection
          handleOnChange={handleOnChange}
          setMotorcycle={setMotorcycle}
        />
      )}
      {currentStep === 'model' && (
        <ModelSelection
          handleOnChange={handleOnChange}
          setMotorcycle={setMotorcycle}
          makeId={fields.make}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 20
  },
  header: {
    fontWeight: '600',
    fontSize: 18
  },
  optionContainer: {
    paddingVertical: 16
  },
  optionText: {
    fontSize: 18
  }
})
