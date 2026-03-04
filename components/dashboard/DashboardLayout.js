import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  useColorModeValue,
  IconButton,
  Divider,
  Badge
} from '@chakra-ui/react'
import {
  IoLogOut,
  IoHome,
  IoBriefcase,
  IoSchool,
  IoNewspaper,
  IoGrid
} from 'react-icons/io5'

const navItems = [
  { href: '/dashboard/admin', label: 'Overview', icon: IoGrid },
  { href: '/dashboard/admin/projects', label: 'Projects', icon: IoBriefcase },
  {
    href: '/dashboard/admin/experiences',
    label: 'Experiences',
    icon: IoNewspaper
  },
  { href: '/dashboard/admin/education', label: 'Education', icon: IoSchool },
  { href: '/dashboard/admin/homepage', label: 'Homepage', icon: IoHome }
]

export default function DashboardLayout({ children, title }) {
  const router = useRouter()
  const bg = useColorModeValue('gray.50', 'gray.900')
  const sidebarBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const activeColor = useColorModeValue('blue.600', 'blue.300')

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/dashboard')
  }

  return (
    <Flex minH="100vh" bg={bg}>
      {/* Sidebar */}
      <Box
        w="240px"
        flexShrink={0}
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        py={6}
        display="flex"
        flexDirection="column"
      >
        <Box px={4} mb={6}>
          <Heading size="md" color={activeColor}>
            Portfolio
          </Heading>
          <Badge colorScheme="blue" mt={1}>
            Admin Dashboard
          </Badge>
        </Box>

        <Divider mb={4} />

        <VStack spacing={1} align="stretch" flex={1} px={2}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = router.pathname === href
            return (
              <NextLink key={href} href={href} passHref legacyBehavior>
                <Button
                  as="a"
                  variant={isActive ? 'solid' : 'ghost'}
                  colorScheme={isActive ? 'blue' : 'gray'}
                  justifyContent="flex-start"
                  leftIcon={<Icon />}
                  size="sm"
                  h="40px"
                >
                  {label}
                </Button>
              </NextLink>
            )
          })}
        </VStack>

        <Divider mt={4} mb={4} />

        <Box px={2}>
          <NextLink href="/" passHref legacyBehavior>
            <Button
              as="a"
              variant="ghost"
              size="sm"
              w="full"
              justifyContent="flex-start"
              leftIcon={<IoHome />}
            >
              View Site
            </Button>
          </NextLink>
          <Button
            variant="ghost"
            colorScheme="red"
            size="sm"
            w="full"
            justifyContent="flex-start"
            leftIcon={<IoLogOut />}
            mt={1}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box flex={1} overflow="auto">
        {/* Top bar */}
        <Box
          bg={sidebarBg}
          borderBottom="1px"
          borderColor={borderColor}
          px={6}
          py={4}
        >
          <Heading size="md">{title}</Heading>
        </Box>

        <Box p={6}>{children}</Box>
      </Box>
    </Flex>
  )
}
