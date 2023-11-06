import React from 'react'
import { StyleSheet, View, Pressable, Image } from 'react-native'
import { useQuery } from '@apollo/client'
import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'

//import { AuthContext } from '@context/Auth'
import { useTheme } from '@hooks/useTheme'
import { USER_QUERY, BEST_LAP_FOR_EACH_TRACK } from '@graphql/queries'
import { Card, Text, Container, TrackdayLinkCard } from '@components'

import type { Trackday } from '@type/event'

const pickImage = (callback: (_x: string) => void) => () => {
  ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [1, 1],
    quality: 1
  }).then(res => {
    if (!res.canceled) {
      callback(res.assets[0].uri)
    }
  })
}

export default function ProfileIndex() {
  //const { signOut } = React.useContext(AuthContext)
  const [profileImage, setProfileImage] = React.useState('')
  const { loading, data, error } = useQuery(USER_QUERY)
  const bestLapsRes = useQuery(BEST_LAP_FOR_EACH_TRACK)
  const { colors: { bgSecondary } } = useTheme()

  if (error || bestLapsRes.error) {
    console.error(error)
    return null
  }

  if (loading || bestLapsRes.loading) {
    return null
  }

  const { name } = data.user

  return (
    <Container style={styles.container}>
      <Card style={styles.profileWrapper}>
        <Pressable
          onPress={pickImage(setProfileImage)}
          style={[styles.profileImageWrapper,{ borderColor: bgSecondary}]}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Feather size={80} name="user" color={bgSecondary} />
          )}
        </Pressable>
        <Text style={styles.heading}>{name}</Text>
      </Card>
      <Card>
        <Text style={[styles.heading, styles.headingMarginBottom]}>
          Personal Bests
        </Text>
        <View style={styles.personalBestWrapper}>
          {bestLapsRes.data?.bestLapForEachTrack.map((trackday: Trackday) => (
            <TrackdayLinkCard key={trackday.id} {...trackday} />
          ))}
        </View>
      </Card>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 24
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImageWrapper: {
    borderRadius: 50,
    borderWidth: 2,
    marginRight: 20,
    overflow: 'hidden'
  },
  profileImage: {
    height: 80,
    width: 80
  },
  personalBestWrapper: {
    rowGap: 8
  },
  headingMarginBottom: {
    marginBottom: 8
  }
})
