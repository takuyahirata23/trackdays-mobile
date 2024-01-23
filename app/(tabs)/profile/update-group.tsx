import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import Toast from 'toastify-react-native'

import { USER_QUERY } from '@graphql/queries'
import { UPDATE_GROUP } from '@graphql/mutations'
import { Container, Button, GroupSelect } from '@components'

export default function UpdateGroup() {
  const { push } = useRouter()
  const {
    data: { user }
  } = useQuery(USER_QUERY, {
    fetchPolicy: 'cache-only'
  })
  const [groupId, setGroupId] = React.useState(user.group.id)

  const [updateGroup, { loading }] = useMutation(UPDATE_GROUP, {
    onError() {
      Toast.error('Error. Please try it later', 'bottom')
    },
    onCompleted() {
      push('/profile')
    }
  })

  const handleSubmit = () => updateGroup({ variables: { groupId } })

  return (
    <Container style={styles.container}>
      <GroupSelect onChange={setGroupId} selected={groupId} titleStyle={styles.group} />
      <View style={styles.button}>
        <Button onPress={handleSubmit} disabled={!groupId || loading}>
          Save new group
        </Button>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  groupContainer: {
    marginTop: 24,
    alignItems: 'center',
    rowGap: 8
  },
  group: {
    fontSize: 22,
    fontWeight: '600'
  },
  button: {
    marginTop: 48
  }
})
