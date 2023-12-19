import React from 'react'
import { Link } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { Platform, View } from 'react-native'

import { Button } from './Button'

export function ExternalLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      hrefAttrs={{
        // On web, launch the link in a new tab.
        target: '_blank'
      }}
      {...props}
      onPress={e => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault()
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string)
        }
      }}
    >
      <View>
        <Button>{props.children}</Button>
      </View>
    </Link>
  )
}
