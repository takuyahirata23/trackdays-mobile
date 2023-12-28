import React from 'react'
import { StyleSheet, View, Pressable, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { useQuery } from '@apollo/client'
import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import { isEmpty, not } from 'ramda'

import { getToken } from '@utils/secureStore'
import { useTheme } from '@hooks/useTheme'
import { USER_QUERY, BEST_LAP_FOR_EACH_TRACK } from '@graphql/queries'
import {
  Card,
  Text,
  Container,
  TrackdayNoteLinkCard,
  IconLabel,
  UpcomingTrackdays,
  Motorcycles
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

  const base = `${process.env.EXPO_PUBLIC_DOMAIN_URL}/images/profile`

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
  const [profileImage, setProfileImage] = React.useState('')
  const [profileImageUploadError, setProfileImageUploadError] =
    React.useState(false)
  const { loading, data, error } = useQuery(USER_QUERY)
  const bestLapsRes = useQuery(BEST_LAP_FOR_EACH_TRACK)
  const {
    colors: { bgSecondary, primary }
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

  const { name, imageUrl, group } = data.user

  return (
    <Container style={{ paddingTop: 0 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Card>
          <View style={styles.profileWrapper}>
            <Pressable
              onLongPress={pickImage(setProfileImage)}
              style={[styles.profileImageWrapper, { borderColor: bgSecondary }]}
            >
              {imageUrl || profileImage ? (
                <Image
                  source={profileImage || imageUrl}
                  style={styles.profileImage}
                  transition={300}
                />
              ) : (
                <Feather size={80} name="user" color={bgSecondary} />
              )}
            </Pressable>
            <View style={styles.profileTextWrapper}>
              <Text style={styles.heading}>{name}</Text>
              <View style={styles.group}>
                <IconLabel
                  variant="secondary"
                  icon={<Feather name="flag" size={18} color={primary} />}
                  label={group.name}
                />
              </View>
            </View>
          </View>
          {profileImageUploadError && (
            <Text color="tertiary" style={styles.errorText}>
              Something went wrong. Please try it later.
            </Text>
          )}
        </Card>
        {not(isEmpty(bestLapsRes.data?.bestLapForEachTrack)) && (
          <View style={styles.personalBestWrapper}>
            <Text style={styles.sectionHeading}>Personal Bests</Text>
            <View style={styles.personalBestWrapper}>
              {bestLapsRes.data.bestLapForEachTrack.map(
                (trackday: TrackdayNote) => (
                  <TrackdayNoteLinkCard
                    key={trackday.id}
                    {...trackday}
                    showSubtitle
                  />
                )
              )}
            </View>
          </View>
        )}
        <UpcomingTrackdays />
        <Motorcycles />
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    rowGap: 32
  },
  profileTextWrapper: {
    flex: 1,
    rowGap: 4
  },
  heading: {
    fontSize: 18,
    fontWeight: '600'
  },
  group: {
    alignSelf: 'flex-start'
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
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '500'
  }
})
