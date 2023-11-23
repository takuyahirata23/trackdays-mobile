import React from 'react'
import { StyleSheet, View, Pressable, Image } from 'react-native'
import { useQuery } from '@apollo/client'
import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'

import { AuthContext } from '@context/Auth'
import { getToken } from '@utils/secureStore'
import { useTheme } from '@hooks/useTheme'
import { USER_QUERY, BEST_LAP_FOR_EACH_TRACK } from '@graphql/queries'
import {
  Card,
  Text,
  Container,
  TrackdayNoteLinkCard,
  Button
} from '@components'

import type { TrackdayNote } from '@type/event'

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

const uploadImageFromUri = async (uri: string) => {
  const formData = new FormData()
  const token = await getToken()

  formData.append('image', {
    // @ts-ignore: not sure why warning for append
    uri,
    name: 'profile.jpg',
    type: 'jpg'
  })

  const base = `${process.env.DOMAIN_URL}/images/profile`

  return fetch(base, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      authorization: token ? `Bearer ${token}` : ''
    }
  }).then(x => x.json())
}

export default function ProfileIndex() {
  const { signOut, deleteAccount } = React.useContext(AuthContext)
  const [profileImage, setProfileImage] = React.useState('')
  const [profileImageUploadError, setProfileImageUploadError] =
    React.useState(false)
  const { loading, data, error, client } = useQuery(USER_QUERY)
  const bestLapsRes = useQuery(BEST_LAP_FOR_EACH_TRACK)
  const {
    colors: { bgSecondary }
  } = useTheme()

  const handleImageUploadError = () => {
    setProfileImage('')
    setProfileImageUploadError(true)
  }

  React.useEffect(() => {
    if (profileImage) {
      uploadImageFromUri(profileImage)
        .then(x => {
          if (x.error) {
            handleImageUploadError()
          }
        })
        .catch(handleImageUploadError)
    }
  }, [profileImage])

  React.useEffect(() => {
    setTimeout(() => {
      setProfileImageUploadError(false)
    }, 5000)
  }, [profileImageUploadError])

  if (error || bestLapsRes.error) {
    console.error(error)
    return null
  }

  if (loading || bestLapsRes.loading) {
    return null
  }

  const { name, imageUrl } = data.user

  const handleSignOut = () => {
    client.clearStore()
    signOut()
  }

  const handleDeleteAccount = () => {
    client.clearStore()
    deleteAccount()
  }

  return (
    <Container style={styles.container}>
      <Card>
        <View style={styles.profileWrapper}>
          <Pressable
            onLongPress={pickImage(setProfileImage)}
            style={[styles.profileImageWrapper, { borderColor: bgSecondary }]}
          >
            {imageUrl || profileImage ? (
              <Image
                source={{ uri: profileImage || imageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <Feather size={80} name="user" color={bgSecondary} />
            )}
          </Pressable>
          <Text style={styles.heading}>{name}</Text>
        </View>
        {profileImageUploadError && (
          <Text color="tertiary" style={styles.errorText}>
            Something went wrong. Please try it later.
          </Text>
        )}
      </Card>
      <Card heading="Personal Bests">
        <View style={styles.personalBestWrapper}>
          {bestLapsRes.data?.bestLapForEachTrack.map(
            (trackday: TrackdayNote) => (
              <TrackdayNoteLinkCard key={trackday.id} {...trackday} />
            )
          )}
        </View>
      </Card>
      <Button onPress={handleSignOut}>Sign Out</Button>
      <Button onPress={handleDeleteAccount}>Delete Account</Button>
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
    borderRadius: 40,
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
  errorText: {
    marginTop: 8
  }
})
