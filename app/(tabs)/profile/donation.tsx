import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'
import { Container, Text, ExternalLink } from '@components'

export default function Donation() {
  const {
    colors: { btnPrimary, btnBgPrimary }
  } = useTheme()
  return (
    <Container style={{ padding: 16 }}>
      <Text style={styles.title}>Thanks for supporting us!</Text>
      <View style={styles.faqContainer}>
        <View>
          <Text style={styles.question}>Find our app valuable?</Text>
          <Text style={styles.paragraph}>
            Your support keeps our free app running and improving. If you find
            it valuable, please consider donating. Every contribution helps us
            sustain and enhance our service. Thank you for being part of our
            community!
          </Text>
        </View>
        <View style={styles.privacyPolicy}>
          <ExternalLink href="https://buy.stripe.com/28o5kY1tKaL29bO9AA">
            <View
              style={[
                {
                  backgroundColor: btnBgPrimary
                },
                styles.buttonStyle
              ]}
            >
              <Text
                style={{ color: btnPrimary, fontSize: 18, fontWeight: 500 }}
              >
                Support Motorcycle Trackdays
              </Text>
            </View>
          </ExternalLink>
        </View>
      </View>
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
  paragraph: {
    lineHeight: 24
  },
  privacyPolicy: {
    marginTop: 20,
    alignItems: 'center'
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4
  }
})
