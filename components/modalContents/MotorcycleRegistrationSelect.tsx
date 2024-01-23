import React from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useQuery } from '@apollo/client'
import Toast from 'toastify-react-native'

import {
  MotorcycleFormContext,
  Motorcycle,
  Field
} from '@context/MotorcycleForm'
import { MAKES_QUERY, MODELS_QUERY } from '@graphql/queries'

import { ActivityIndicator } from '../ActivityIndicator'
import { RadioOption } from '../RadioOption'
import { Text } from '../Text'

type Props = {
  handleOnChange: (field: Field) => (value: string) => void
  setMotorcycle: (_motorcycle: any) => void
  selected: string
}

function MakeSelection({ handleOnChange, setMotorcycle, selected }: Props) {
  const { loading, error, data } = useQuery(MAKES_QUERY)
  const { back } = useRouter()

  if (loading) {
    return <ActivityIndicator />
  }

  if (error) {
    Toast.error('Error. Please try it later', 'bottom')
    return null
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('make')(id)
    setMotorcycle({ make: name, model: '' })
    back()
  }
  return (
    <>
      <Text style={styles.header}>Choose model</Text>
      <FlatList
        data={data.makes}
        renderItem={({ item, index }) => (
          <RadioOption
            onPress={() => onPress(item.id, item.name)}
            label={item.name}
            isSelected={selected === item.id}
            style={{
              paddingHorizontal: 16,
              paddingBottom: 8,
              paddingTop: index ? 8 : 16
            }}
          />
        )}
        keyExtractor={item => item.id}
      />
    </>
  )
}

function ModelSelection({
  handleOnChange,
  setMotorcycle,
  makeId,
  selected
}: Props & { makeId: string }) {
  const { data, loading, error } = useQuery(MODELS_QUERY, {
    variables: {
      makeId
    }
  })
  const { back } = useRouter()

  if (loading) {
    return <ActivityIndicator />
  }

  if (error) {
    Toast.error('Error. Please try it later', 'bottom')
    return null
  }

  const onPress = (id: string, name: string) => {
    handleOnChange('model')(id)
    setMotorcycle((prev: Motorcycle) => ({ ...prev, model: name }))
    back()
  }
  return (
    <View>
      <Text style={styles.header}>Choose model</Text>
      <FlatList
        data={data.models}
        renderItem={({ item, index }) => (
          <RadioOption
            onPress={() => onPress(item.id, item.name)}
            isSelected={selected === item.id}
            label={item.name}
            style={{
              paddingHorizontal: 16,
              paddingBottom: 8,
              paddingTop: index ? 8 : 16
            }}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
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
    <View>
      {currentStep === 'make' && (
        <MakeSelection
          handleOnChange={handleOnChange}
          setMotorcycle={setMotorcycle}
          selected={fields.make}
        />
      )}
      {currentStep === 'model' && (
        <ModelSelection
          handleOnChange={handleOnChange}
          setMotorcycle={setMotorcycle}
          makeId={fields.make}
          selected={fields.model}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontWeight: '600',
    fontSize: 18,
    paddingHorizontal: 16,
    marginTop: 16
  }
})
