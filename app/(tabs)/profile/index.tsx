import React from 'react'
import { StyleSheet, View, Pressable, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { useQuery } from '@apollo/client'
import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import { isEmpty, not } from 'ramda'
import { Toast } from 'toastify-react-native'

import { useTheme } from '@hooks/useTheme'
import { USER_QUERY, BEST_LAP_FOR_EACH_TRACK } from '@graphql/queries'
import {
  ActivityIndicator,
  Card,
  Text,
  Container,
  TrackdayNoteLinkCard,
  IconLabel,
  UpcomingTrackdays,
  Motorcycles
} from '@components'
import {updateProfileImage } from '@rest/images'

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

const uploadImageFromUri = (uri: string) => {
  const formData = new FormData()
    // @ts-ignore: not sure why warning for append
  formData.append('image', {
    uri,
    name: 'profile.jpg',
    type: 'image/jpeg'
  })

  return updateProfileImage(formData)
}

export default function ProfileIndex() {
  const [profileImage, setProfileImage] = React.useState('')
    React.useState(false)
  const { loading, data, error } = useQuery(USER_QUERY)
  const bestLapsRes = useQuery(BEST_LAP_FOR_EACH_TRACK)
  const {
    colors: { bgSecondary, primary }
  } = useTheme()

  const handleImageUploadError = () => {
    setProfileImage('')
    Toast.error('Sorry! Something went wrong.', 'bottom')
  }

  React.useEffect(() => {
    if (profileImage) {
      uploadImageFromUri(profileImage)
        .then(x => {
          if (x.error) {
            handleImageUploadError()
          }
          Image.clearDiskCache()
          Toast.success('Profile picture updated', 'bottom')
        })
        .catch(handleImageUploadError)
    }
  }, [profileImage])

  if (error || bestLapsRes.error) {
    Toast.error('Error. Please try it later', 'bottom')
    return null
  }

  if (loading || bestLapsRes.loading) {
    return <ActivityIndicator />
  }

  const { name, imageUrl, group } = data.user

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Card>
          <View style={styles.profileWrapper}>
            <Pressable
              onPress={pickImage(setProfileImage)}
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
    padding: 16,
    rowGap: 32,
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
