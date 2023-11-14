import React from 'react'
import { StyleSheet, View, Pressable, Image } from 'react-native'
import { useQuery, useApolloClient  } from '@apollo/client'
import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'

import { AuthContext } from '@context/Auth'
import { getToken } from '@utils/secureStore'
import { useTheme } from '@hooks/useTheme'
import { USER_QUERY, BEST_LAP_FOR_EACH_TRACK } from '@graphql/queries'
import { Card, Text, Container, TrackdayLinkCard, Button } from '@components'

import type { Trackday } from '@type/event'

const pickImage = (callback: (_x: string) => void) => () => {
  ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.2
  }).then(res => {
    if (!res.canceled) {
      callback(res.assets[0].uri)
    }
  })
}

export default function ProfileIndex() {
  const { signOut, deleteAccount } = React.useContext(AuthContext)
  const [profileImage, setProfileImage] = React.useState('')
  const { loading, data, error } = useQuery(USER_QUERY)
  const { resetStore, clearStore } = useApolloClient() 
  const bestLapsRes = useQuery(BEST_LAP_FOR_EACH_TRACK)
  const {
    colors: { bgSecondary }
  } = useTheme()

  const fetchImageFromUri = async (uri: string) => {
    const formData = new FormData()
    const token = await getToken()

    const { id } = data?.user || {}

    formData.append('image', {
      // @ts-ignore: not sure why warning for append
      uri,
      name: `${id}-profile.jpg`,
      type: 'jpg'
    })

    const base = `${process.env.DOMAIN_URL}/images/profile`
    fetch(base, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then(x => x.json())
      .then(x => console.log('success', x))
      .catch(e => console.log('error', e))
  }

  React.useEffect(() => {
    if (profileImage) {
      fetchImageFromUri(profileImage)
    }
  }, [profileImage])

  if (error || bestLapsRes.error) {
    console.error(error)
    return null
  }

  if (loading || bestLapsRes.loading) {
    return null
  }

  const { name, imageUrl } = data.user

  return (
    <Container style={styles.container}>
      <Card style={styles.profileWrapper}>
        <Pressable
          onPress={pickImage(setProfileImage)}
          style={[styles.profileImageWrapper, { borderColor: bgSecondary }]}
        >
          {imageUrl || profileImage ? (
            <Image
              source={{ uri: imageUrl || profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <Feather size={80} name="user" color={bgSecondary} />
          )}
        </Pressable>
        <Text style={styles.heading}>{name}</Text>
      </Card>
      <Card heading="Personal Bests">
        <View style={styles.personalBestWrapper}>
          {bestLapsRes.data?.bestLapForEachTrack.map((trackday: Trackday) => (
            <TrackdayLinkCard key={trackday.id} {...trackday} />
          ))}
        </View>
      </Card>
      <Button onPress={signOut}>
      Sign Out
      </Button>
      <Button onPress={deleteAccount}>
      Delete Account
      </Button>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    rowGap: 24
  },
  heading: {
    fontSize: 18,
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
  }
})
