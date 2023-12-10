import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import BottomSheet from '@gorhom/bottom-sheet'
import { Picker } from '@react-native-picker/picker'
import { useNavigation } from 'expo-router'

import { Card, Container, Text, Button, BottomSheetHandle } from '@components'
import { MOTORCYCLE } from 'graphql/fragments'
import { REGISTER_MOTORCYCLE } from '@graphql/mutations'
import { MAKES_QUERY, MODELS_QUERY } from '@graphql/queries'
import { motorcycleValidations } from 'functions/validations'

import type { Make, Model } from '@type/vehicle'

type Fields = 'make' | 'model' | 'year' | null

const thisYear = new Date().getFullYear()

const getYears = () => {
  const arr = []
  for (let i = thisYear; i >= 1960; i--) {
    arr.push(String(i))
  }
  return arr
}

const years = getYears()

export default function RegisterMotorcycle() {
  const ref = React.useRef<BottomSheet>(null)
  const { goBack } = useNavigation()
  const [fields, setFields] = React.useState({
    year: '',
    make: '',
    model: ''
  })
  const [getModels, { data: modelData = {} }] = useLazyQuery(MODELS_QUERY, {
    variables: {
      makeId: fields.make
    }
  })
  const makeRes = useQuery(MAKES_QUERY)

  const [bottomSheetField, setBottomSheetField] = React.useState<Fields>('year')

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

  React.useEffect(() => {
    if (bottomSheetField && ref.current) {
      ref.current.expand()
    } else {
      ref.current?.close()
    }
  }, [bottomSheetField])

  const handleBottomSheetField = (field: Fields) => () =>
    setBottomSheetField(field)

  const handleFieldOnChange = (field: string) => (value: string) => {
    if (bottomSheetField === 'make') {
      setFields(prev => ({ ...prev, model: '' }))
    }
    setFields(prev => ({ ...prev, [field]: value }))
  }

  const handlers = {
    year: () => {
      if (motorcycleValidations.year.run(fields.year)) {
        setBottomSheetField('make')
      } else {
        console.log('year required')
      }
    },
    make: () => {
      if (!fields.make) {
        setFields(prev => ({ ...prev, make: makeRes?.data?.makes?.[0].id }))
      }
      getModels()
      setBottomSheetField('model')
    },
    model: () => {
      if (!fields.model) {
        setFields(prev => ({ ...prev, model: modelData?.models?.[0].id }))
      }
      setBottomSheetField(null)
      ref.current?.close()
    }
  }

  const getName = (data: Make[] | Model[]) => (id: string) =>
    data.find((x: Make | Model) => x.id === id)?.name || ''

  const onSubmit = () =>
    registerMotorcycle({
      variables: {
        registerMotorcycleInput: {
          modelId: fields.model,
          year: Number(fields.year)
        }
      }
    })

  const filled = Boolean(fields.year && fields.make && fields.model)

  return (
    <Container style={styles.container}>
      <TouchableOpacity onPress={handleBottomSheetField('year')}>
        <Card style={styles.fieldWrapper}>
          <Text>Year: </Text>
          <Text>{fields.year}</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBottomSheetField('make')}>
        <Card style={styles.fieldWrapper}>
          <Text>Make: </Text>
          <Text>{getName(makeRes?.data?.makes || [])(fields.make)}</Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleBottomSheetField('model')}
        disabled={!fields.make}
      >
        <Card style={styles.fieldWrapper}>
          <Text>Model: </Text>
          <Text>{getName(modelData?.models || [])(fields.model)}</Text>
        </Card>
      </TouchableOpacity>
      <View style={styles.btnWrapper}>
        <Button onPress={onSubmit} disabled={!filled}>
          Register
        </Button>
      </View>
      <BottomSheet
        ref={ref}
        snapPoints={['40%']}
        handleComponent={() => (
          <BottomSheetHandle
            onPressRight={
              bottomSheetField ? handlers[bottomSheetField] : () => undefined
            }
            rightText="Next"
          />
        )}
      >
        {bottomSheetField === 'year' && (
          <View>
            <Picker
              selectedValue={fields.year}
              onValueChange={handleFieldOnChange('year')}
            >
              {years.map((year: string) => (
                <Picker.Item value={year} label={year} key={year} />
              ))}
            </Picker>
          </View>
        )}
        {bottomSheetField === 'make' && (
          <View>
            <Picker
              selectedValue={fields.make}
              onValueChange={handleFieldOnChange('make')}
            >
              {makeRes?.data?.makes.map((m: Make) => (
                <Picker.Item value={m.id} label={m.name} key={m.id} />
              ))}
            </Picker>
          </View>
        )}
        {bottomSheetField === 'model' && modelData.models && (
          <View>
            <Picker
              selectedValue={fields.model}
              onValueChange={handleFieldOnChange('model')}
            >
              {modelData.models?.map((m: Model) => (
                <Picker.Item value={m.id} label={m.name} key={m.id} />
              ))}
            </Picker>
          </View>
        )}
      </BottomSheet>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
    paddingBottom: 20
  },
  fieldWrapper: {
    flexDirection: 'row',
    columnGap: 8
  },
  btnWrapper: {
    marginTop: 'auto'
  }
})
