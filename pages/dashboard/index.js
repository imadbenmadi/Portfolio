import { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Alert,
  AlertIcon,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import Head from 'next/head'

export default function DashboardLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const pageBg = useColorModeValue('#f0e7db', '#202023')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      const redirect = router.query.redirect || '/dashboard/admin'
      router.push(redirect)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login — Portfolio</title>
      </Head>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={pageBg}
      >
        <Container maxW="sm">
          <Box
            bg={cardBg}
            border="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={8}
            shadow="md"
          >
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Heading size="lg" mb={1}>
                  Admin Login
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Portfolio Dashboard
                </Text>
              </Box>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="admin"
                      autoComplete="username"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    isLoading={loading}
                    loadingText="Signing in…"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export async function getServerSideProps({ req }) {
  // If already logged in, redirect to admin
  const { getAuthPayload } = await import('../../lib/auth')
  const payload = getAuthPayload(req)
  if (payload) {
    return { redirect: { destination: '/dashboard/admin', permanent: false } }
  }
  return { props: {} }
}
