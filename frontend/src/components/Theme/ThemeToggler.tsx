import { FormLabel, Switch, useColorMode } from '@chakra-ui/react'

type ThemeTogglerType = {
  showLabel?: boolean
  size?: string
}

export const ThemeToggler = ({
  showLabel = false,
  ...rest
}: ThemeTogglerType) => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <>
      {showLabel && (
        <FormLabel htmlFor="theme-toggler" mb={0}>
          Enable Dark Theme
        </FormLabel>
      )}
      <Switch
        id="theme-toggler"
        size="sm"
        isChecked={colorMode === 'dark'}
        isDisabled={false}
        value={colorMode}
        colorScheme="orange"
        mr={2}
        onChange={toggleColorMode}
        {...rest}
      />
    </>
  )
}
