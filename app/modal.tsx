import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useSearchParams, useNavigation } from 'expo-router'
import { Picker } from '@react-native-picker/picker'

import { Container, Button, Text, Field } from '@components'
import { MAKES_QUERY, MODELS_QUERY } from '@graphql/queries'
import { motorcycleValidations } from 'functions/validations'

const titleMap: { [key: string]: string } = {
  registerMotorcycle: 'Add Motorcycle'
}

type Make = {
  id: string
  name: string
}

type Model = {
  id: string
  name: string
}

const currentYear = new Date().getFullYear().toString()

export default function ModalScreen() {
  const { name } = useSearchParams()
  const { setOptions, goBack } = useNavigation()
  const [year, setYear] = React.useState('')
  const [yearError, setYearError] = React.useState('')
  const [make, setMake] = React.useState('')
  const [model, setModel] = React.useState('')
  const [phase, setPhase] = React.useState(0)
  const makeRes = useQuery(MAKES_QUERY)
  const [getModels, modelRes] = useLazyQuery(MODELS_QUERY, {
    variables: {
      makeId: make
    }
  })

  const backToPreviousField = () =>
    setPhase(prev => {
      if (prev === 1) {
        setMake('')
      } else {
        setModel('')
      }

      return prev - 1
    })

  const onPressHandlers = [
    () => {
      if (motorcycleValidations.year.run(year)) {
        setPhase(1)
      } else {
        setYearError(`Type full year between 1800 and ${currentYear}`)
      }
    },
    () => {
      if (!make) {
        setMake(makeRes?.data?.makes?.[0].id)
      }
      getModels()
    },
    () => {
      if (!model) {
        setModel(modelRes?.data?.models?.[0].id)
      }
      setPhase(3)
    }
  ]

  React.useEffect(() => {
    setOptions({
      title: titleMap[String(name)]
    })
  }, [name, setOptions])

  React.useEffect(() => {
    if (!modelRes.loading && modelRes.data) {
      setPhase(2)
    }
  }, [modelRes.loading, modelRes.data])

  const getName = (data: Make[] | Model[]) => (id: string) =>
    data.find((x: Make | Model) => x.id === id)?.name || ''

  return (
    <Container>
      <Text>Register Motorcycle</Text>
      <View>
        <Text>Year: {year}</Text>
        <Text>Make: {getName(makeRes?.data?.makes || [])(make)}</Text>
        <Text>Model: {getName(modelRes?.data?.models || [])(model)}</Text>
      </View>
      {phase === 0 && (
        <Field
          returnKeyType="done"
          error={yearError}
          keyboardType="numeric"
          label="Year"
          value={year}
          onChangeText={setYear}
          placeholder={currentYear}
        />
      )}
      {phase === 1 && (
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={make} onValueChange={setMake}>
            {makeRes?.data?.makes.map((m: Make) => (
              <Picker.Item value={m.id} label={m.name} key={m.id} />
            ))}
          </Picker>
        </View>
      )}
      {phase === 2 ? (
        modelRes.loading ? null : (
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={model} onValueChange={setModel}>
              {modelRes?.data?.models?.map((m: Model) => (
                <Picker.Item value={m.id} label={m.name} key={m.id} />
              ))}
            </Picker>
          </View>
        )
      ) : null}
      <View style={styles.btns}>
        <View style={styles.btnWrapper}>
          {phase >= 0 && phase <= 2 && (
            <Button onPress={onPressHandlers[phase]}>Next</Button>
          )}
          {phase > 0 && phase < 3 && (
            <Button onPress={backToPreviousField} variant="secondary">
              Back
            </Button>
          )}
          {phase === 3 && (
            <>
              <Button onPress={onPressHandlers[phase]}>Register</Button>
              <Button onPress={goBack} variant="secondary">
                Cancel
              </Button>
            </>
          )}
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pickerWrapper: {
    width: '100%'
  },
  btns: {
    marginTop: 'auto'
  },
  btnWrapper: {
    rowGap: 16
  }
})
