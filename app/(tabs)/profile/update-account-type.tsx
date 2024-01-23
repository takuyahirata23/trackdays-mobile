import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useQuery, useMutation } from '@apollo/client'
import { Ionicons } from '@expo/vector-icons'
import { Toast } from 'toastify-react-native'

import { USER_QUERY } from '@graphql/queries'
import { UPDATE_ACCOUNT_TYPE } from '@graphql/mutations'
import { Text, Container, Button, Card } from '@components'
import { useTheme } from '@hooks/useTheme'

const getIconName = (predicate: boolean) =>
  predicate ? 'radio-button-on' : 'radio-button-off'

export default function UpdateAccountType() {
  const { loading, error, data } = useQuery(USER_QUERY)
  const [isPrivate, setIsPrivate] = React.useState(data?.user.isPrivate)
  const {
    colors: { accent }
  } = useTheme()

  const [updateAccountType] = useMutation(UPDATE_ACCOUNT_TYPE)

  if (loading || error) {
    return null
  }

  const handleSubmit = () =>
    updateAccountType({
      variables: {
        isPrivate
      },
      onError() {
        Toast.error('There was a problem updating account type', 'bottom')
      },
      onCompleted() {
        Toast.success('Account type updated', 'bottom')
      }
    })

  return (
    <Container style={styles.container}>
      <Text style={styles.heading}>Account Type</Text>
      <View>
        <Text style={styles.description}>
          Your lap time records are hidden when your account type is PRIVATE
        </Text>
        <TouchableOpacity onPress={() => setIsPrivate(true)}>
          <Card style={styles.option}>
            <Ionicons name={getIconName(isPrivate)} size={24} color={accent} />
            <Text style={styles.optionText}>Private</Text>
          </Card>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.description}>
          Your lap time record for each track shows up when your account type is
          PUBLIC
        </Text>
        <TouchableOpacity onPress={() => setIsPrivate(false)}>
          <Card style={styles.option}>
            <Ionicons name={getIconName(!isPrivate)} size={24} color={accent} />
            <Text style={styles.optionText}>Public</Text>
          </Card>
        </TouchableOpacity>
      </View>
      <View style={styles.btnWrapper}>
        <Button
          disabled={data.user.isPrivate === isPrivate}
          onPress={handleSubmit}
        >
          Save
        </Button>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    rowGap: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: '500'
  },
  description: {
    fontWeight: '500',
    marginBottom: 8
  },
  option: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center'
  },
  optionText: {
    fontSize: 20
  },
  btnWrapper: {
    marginTop: 'auto'
  }
})
