import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'

import { Container, Text, ExternalLink } from '@components'

export default function FAQ() {
  return (
    <Container style={{ padding: 16 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>FAQ</Text>
        <View style={styles.faqContainer}>
          <View>
            <Text style={styles.question}>What is Private/Public account?</Text>
            <Text>
              Each track shows top 3 riders who have a public account. Your lap
              time will not show up anywhere when you have a private account.
            </Text>
          </View>
          <View>
            <Text style={styles.question}>
              Does Motorcycle Trackdays collect calendar data?
            </Text>
            <Text>
              NO! We only write/delete trackdays schedule in your calendar. We
              do not read or modify any other data in your calendar. You can
              deny the request if you do not want to see your trackday schedule
              in your calendar.
            </Text>
          </View>
          <View>
            <Text style={styles.question}>
              Why do I not see my motorcycle to register?
            </Text>
            <Text>
              Oh no! We can add your make or model. Please email to
              support@motorcycle-trackdays.com or DM on our instagram account.
            </Text>
          </View>
          <View style={styles.privacyPolicy}>
            <ExternalLink href="https://www.termsfeed.com/live/507d39e0-3d9b-4728-a9e5-38a151096bdf">
             <Text style={styles.question}>Privacy Policy</Text>
            </ExternalLink>
          </View>
        </View>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600'
  },
  faqContainer: {
    marginTop: 24,
    rowGap: 32
  },
  question: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 16
  },
  privacyPolicy: {
    marginTop: 20,
    alignItems: 'center'
  }
})
