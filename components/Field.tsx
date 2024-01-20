import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  TouchableOpacity
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { useTheme } from '@hooks/useTheme'
import { Text } from '@components/Text'

type Props = {
  label: string
  error?: string | string[]
  inputStyle?: ViewStyle
} & TextInputProps

type Ref = TextInput

const PasswordVisibilityHandler = ({
  shouldHidePassword,
  onToggle
}: {
  shouldHidePassword: boolean
  onToggle: () => void
}) => {
  const {
    colors: { primary }
  } = useTheme()
  return (
    <TouchableOpacity onPress={onToggle}>
      {shouldHidePassword ? (
        <MaterialIcons name="visibility" size={28} color={primary} />
      ) : (
        <MaterialIcons name="visibility-off" size={28} color={primary} />
      )}
    </TouchableOpacity>
  )
}

export const Field = React.forwardRef<Ref, Props>(
  (
    { label, error, style, secureTextEntry = false, inputStyle = {}, ...rest },
    ref
  ) => {
    const { colors } = useTheme()
    const isPassword = secureTextEntry
    const [shouldHidePassword, setShouldHidePassword] =
      React.useState(secureTextEntry)

    return (
      <View style={style}>
        <Text style={styles.label}>{label}</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            ref={ref}
            style={[
              {
                backgroundColor: colors.bgSecondary,
                borderColor: error ? colors.error : colors.bgSecondary,
                color: colors.primary
              },
              styles.input,
              inputStyle
            ]}
            secureTextEntry={shouldHidePassword}
            {...rest}
          />
          {isPassword && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 16,
                bottom: 0,
                justifyContent: 'center'
              }}
            >
              <PasswordVisibilityHandler
                shouldHidePassword={shouldHidePassword}
                onToggle={() => setShouldHidePassword(prev => !prev)}
              />
            </View>
          )}
        </View>
        {error && typeof error === 'string' && (
          <Text color="error" style={styles.label}>
            {error}
          </Text>
        )}
        {error &&
          Array.isArray(error) &&
          error.map((e: string, i: number) => (
            <Text color="error" style={styles.label} key={i}>
              {e}
            </Text>
          ))}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  label: {
    fontSize: 14
  },
  input: {
    height: 46,
    fontSize: 18,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1.5
  }
})
