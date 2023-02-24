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
          Enable {colorMode === 'dark' ? 'Light' : 'Dark'} Theme
        </FormLabel>
      )}
      <Switch
        id="theme-toggler"
        size="md"
        isChecked={colorMode === 'dark'}
        isDisabled={false}
        value={colorMode}
        colorScheme="yellow"
        mr={2}
        onChange={toggleColorMode}
        {...rest}
      />
    </>
  )
}
