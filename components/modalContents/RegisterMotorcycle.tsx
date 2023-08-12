import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { useNavigation } from 'expo-router'
import { Picker } from '@react-native-picker/picker'

import { MAKES_QUERY, MODELS_QUERY } from '@graphql/queries'
import { REGISTER_MOTORCYCLE } from '@graphql/mutations'
import { MOTORCYCLE } from 'graphql/fragments'
import { motorcycleValidations } from 'functions/validations'
import { Button, Card, Field, LableView } from '@components'

import type { Make, Model } from '@type/vehicle'

const currentYear = new Date().getFullYear().toString()

export function RegisterMotorcycle() {
  const { goBack } = useNavigation()
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

  const [registerMotorcycle] = useMutation(REGISTER_MOTORCYCLE, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          motorcycles(existingMotorcycles = []) {
            const newMotorcycleRef = cache.writeFragment({
              data: data.registerMotorcycle,
              fragment: MOTORCYCLE
            })
            return [newMotorcycleRef, ...existingMotorcycles]
          }
        }
      })
    },
    onCompleted() {
      goBack()
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
    },
    () =>
      registerMotorcycle({
        variables: {
          registerMotorcycleInput: {
            modelId: model,
            year: Number(year)
          }
        }
      })
  ]

  React.useEffect(() => {
    if (!modelRes.loading && modelRes.data && make) {
      setPhase(2)
    }
  }, [modelRes.loading, modelRes.data, make])

  const getName = (data: Make[] | Model[]) => (id: string) =>
    data.find((x: Make | Model) => x.id === id)?.name || ''

  return (
    <>
      <Card>
        <View>
          <LableView label="Year" value={year} />
          <LableView
            label="Make"
            value={getName(makeRes?.data?.makes || [])(make)}
            style={styles.divider}
          />
          <LableView
            label="Model"
            value={getName(modelRes?.data?.models || [])(model)}
            style={styles.divider}
          />
        </View>
      </Card>
      {phase <= 2 && (
        <Card style={styles.fieldWrapper}>
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
        </Card>
      )}
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
    </>
  )
}

const styles = StyleSheet.create({
  divider: {
    marginTop: 8
  },
  fieldWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 24
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
