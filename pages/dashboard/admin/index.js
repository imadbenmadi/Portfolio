import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue
} from '@chakra-ui/react'
import NextLink from 'next/link'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getAuthPayload } from '../../../lib/auth'

export default function AdminOverview({ stats, dbReady }) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  async function handleInitDB() {
    const res = await fetch('/api/db/init', { method: 'GET' })
    const data = await res.json()
    alert(res.ok ? 'Database initialized!' : `Error: ${data.error}`)
    window.location.reload()
  }

  return (
    <DashboardLayout title="Overview">
      {!dbReady && (
        <Alert status="warning" mb={6} borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Database not initialized yet.</Text>
            <Text fontSize="sm">
              Click the button below to create all tables.
            </Text>
          </Box>
          <Button ml={4} size="sm" colorScheme="orange" onClick={handleInitDB}>
            Initialize Database
          </Button>
        </Alert>
      )}

      <SimpleGrid columns={[1, 2, 4]} gap={4} mb={8}>
        {[
          {
            label: 'Projects',
            value: stats.projects,
            href: '/dashboard/admin/projects'
          },
          {
            label: 'Experiences',
            value: stats.experiences,
            href: '/dashboard/admin/experiences'
          },
          {
            label: 'Education',
            value: stats.education,
            href: '/dashboard/admin/education'
          }
        ].map(item => (
          <Box
            key={item.label}
            bg={cardBg}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            p={5}
            shadow="sm"
          >
            <Stat>
              <StatLabel color="gray.500">{item.label}</StatLabel>
              <StatNumber fontSize="3xl">{item.value}</StatNumber>
              <StatHelpText>
                <NextLink href={item.href}>Manage →</NextLink>
              </StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      <Heading size="sm" mb={3}>
        Quick Actions
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} gap={3}>
        <NextLink href="/dashboard/admin/projects" passHref legacyBehavior>
          <Button as="a" colorScheme="blue" variant="outline">
            + Add Project
          </Button>
        </NextLink>
        <NextLink href="/dashboard/admin/experiences" passHref legacyBehavior>
          <Button as="a" colorScheme="green" variant="outline">
            + Add Experience
          </Button>
        </NextLink>
        <NextLink href="/dashboard/admin/education" passHref legacyBehavior>
          <Button as="a" colorScheme="purple" variant="outline">
            + Add Education
          </Button>
        </NextLink>
        <NextLink href="/dashboard/admin/homepage" passHref legacyBehavior>
          <Button as="a" colorScheme="orange" variant="outline">
            Edit Homepage
          </Button>
        </NextLink>
        <NextLink href="/" passHref legacyBehavior>
          <Button as="a" variant="outline">
            View Site
          </Button>
        </NextLink>
      </SimpleGrid>
    </DashboardLayout>
  )
}

export async function getServerSideProps({ req }) {
  const { getAuthPayload } = await import('../../../lib/auth')
  const payload = getAuthPayload(req)
  if (!payload) {
    return {
      redirect: {
        destination: '/dashboard?redirect=/dashboard/admin',
        permanent: false
      }
    }
  }

  let stats = { projects: 0, experiences: 0, education: 0 }
  let dbReady = false

  try {
    const { sql } = await import('../../../lib/db')
    const [p, e, ed] = await Promise.all([
      sql`SELECT COUNT(*) FROM projects`,
      sql`SELECT COUNT(*) FROM experiences`,
      sql`SELECT COUNT(*) FROM education`
    ])
    stats = {
      projects: parseInt(p.rows[0].count),
      experiences: parseInt(e.rows[0].count),
      education: parseInt(ed.rows[0].count)
    }
    dbReady = true
  } catch {
    dbReady = false
  }

  return { props: { stats, dbReady } }
}
