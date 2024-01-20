import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useMutation } from '@apollo/client'
import { useRouter } from 'expo-router'

import { validateMotorcycleForm } from '@functions/validations'
import {  Container, Button, Field } from '@components'
import { MotorcycleFormContext } from '@context/MotorcycleForm'
import { MOTORCYCLE } from 'graphql/fragments'
import { REGISTER_MOTORCYCLE } from '@graphql/mutations'
import { Toast } from 'toastify-react-native'

const formErrorsInitialValue = {
  isValid: false,
  year: '',
  make: '',
  model: ''
}

export default function RegisterMotorcycle() {
  const { push } = useRouter()
  const { fields, handleOnChange, motorcycle, reset } = React.useContext(
    MotorcycleFormContext
  )
  const [formErrors, setFormErrors] = React.useState<{
    isValid: boolean
    year?: string
    make?: string
    model?: string
  }>(formErrorsInitialValue)

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
    onError() {
      Toast.error('Something went wrong. Please try later.', 'bottom')
    },
    onCompleted() {
      setFormErrors(formErrorsInitialValue)
      reset()
      push('/profile')
    }
  })

  const onSubmit = () => setFormErrors(validateMotorcycleForm(fields))

  React.useEffect(() => {
    if (formErrors.isValid) {
      registerMotorcycle({
        variables: {
          registerMotorcycleInput: {
            modelId: fields.model,
            year: Number(fields.year)
          }
        }
      })
    }
  }, [formErrors.isValid, fields])

  const filled = Boolean(fields.year && fields.make && fields.model)

  return (
    <Container style={styles.container}>
      <Field
        label="Year"
        value={fields.year}
        keyboardType="numeric"
        onChangeText={handleOnChange('year')}
        error={formErrors.year}
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={() =>
          push({
            pathname: '/modal',
            params: {
              name: 'motorcycleRegistrationSelect',
              currentStep: 'make'
            }
          })
        }
      >
        <Field
          label="Make"
          value={motorcycle.make}
          editable={false}
          pointerEvents="none"
          error={formErrors.make}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          push({
            pathname: '/modal',
            params: {
              name: 'motorcycleRegistrationSelect',
              currentStep: 'model'
            }
          })
        }
        disabled={!fields.make}
      >
        <Field
          label="Model"
          value={motorcycle.model}
          editable={false}
          pointerEvents="none"
          error={formErrors.model}
        />
      </TouchableOpacity>
      <View style={styles.btnWrapper}>
        <Button onPress={onSubmit} disabled={!filled}>
          Register
        </Button>
      </View>
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
