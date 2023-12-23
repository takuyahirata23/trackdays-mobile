import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'expo-router'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import BottomSheetType from '@gorhom/bottom-sheet'
import { Picker } from '@react-native-picker/picker'

import { USER_QUERY } from '@graphql/queries'
import { UPDATE_GROUP } from '@graphql/mutations'
import { Text, Container, Button, BottomSheetHandle, BottomSheet } from '@components'
import { GROUPS_DEV, GROUPS_PROD } from '@constants/groups'
import { useTheme } from '@hooks/useTheme'

const groups = process.env.NODE_ENV === 'development' ? GROUPS_DEV : GROUPS_PROD

const getOptions = (current: string) =>
  groups.filter(({ id }) => id !== current)
const getName = (selectedId: string) =>
  groups.find(({ id }) => id === selectedId)?.name

export default function UpdateGroup() {
  const ref = React.useRef<BottomSheetType>(null)
  const { push } = useRouter()
  const [groupId, setGroupId] = React.useState('')
  const [mutationError, setMutationError] = React.useState(false)
  const { data, loading, error } = useQuery(USER_QUERY)
  const [updateGroup, { loading: isLoading }] = useMutation(UPDATE_GROUP, {
    onError() {
      setMutationError(true)
    },
    onCompleted() {
      setMutationError(false)
      push('/profile')
    }
  })
  const {
    colors: { tertiary }
  } = useTheme()

  if (loading || error) {
    return null
  }

  const { group } = data.user
  const options = getOptions(group.id)
  const openBottomSheet = () => ref.current?.expand()

  const handleSubmit = () => updateGroup({ variables: { groupId } })

  return (
    <Container style={styles.container}>
      <View style={styles.groupContainer}>
        <Text style={styles.group}>{group.name}</Text>
        <FontAwesome name="long-arrow-down" size={24} />
        <TouchableOpacity onPress={openBottomSheet}>
          <Text style={[styles.group, { color: tertiary }]}>
            {groupId ? getName(groupId) : ''}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.button}>
        <Button onPress={handleSubmit} disabled={!groupId || isLoading}>
          Save new group
        </Button>
        {mutationError && (
          <Text>There was a problem updating group. Please try it later.</Text>
        )}
      </View>
      <BottomSheet
        ref={ref}
        handleComponent={() => (
          <BottomSheetHandle
            onPressRight={() => {
              if (!groupId) {
                setGroupId(options[0].id)
              }
              ref.current?.close()
            }}
            rightText="Done"
          />
        )}
      >
        <View>
          <Picker selectedValue={groupId} onValueChange={setGroupId}>
            {options.map(({ id, name }: { id: string; name: string }) => (
              <Picker.Item value={id} label={name} key={id} />
            ))}
          </Picker>
        </View>
      </BottomSheet>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  groupContainer: {
    marginTop: 24,
    alignItems: 'center',
    rowGap: 8
  },
  group: {
    fontSize: 24,
    fontWeight: '600'
  },
  button: {
    marginTop: 48
  }
})
