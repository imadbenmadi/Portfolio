import NextLink from 'next/link'
import {
  Container,
  Heading,
  Box,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Image,
  Link,
  Center,
  Button
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { ChevronRightIcon } from '@chakra-ui/icons'
import PdfThumbnail from '../components/PdfThumbnail'

function isPdf(mimeOrUrl) {
  if (!mimeOrUrl) return false
  if (mimeOrUrl === 'application/pdf') return true
  return String(mimeOrUrl).toLowerCase().includes('.pdf')
}

export default function CertificatesPage({ certificates }) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Layout title="Certificates">
      <Container maxW="container.md">
        <Heading as="h3" fontSize={20} my={4}>
          Certificates
        </Heading>

        <Section delay={0.1}>
          {!certificates || certificates.length === 0 ? (
            <Center py={10}>
              <VStack>
                <Text color="gray.500">No certificates added yet.</Text>
                <Button
                  as={NextLink}
                  href="/dashboard/admin/certificates"
                  variant="outline"
                  rightIcon={<ChevronRightIcon />}
                >
                  Add certificates in dashboard
                </Button>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={4} align="stretch">
              {certificates.map(item => {
                const pdf = isPdf(item.file_type || item.file_url)
                return (
                  <Box
                    key={item.id}
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    p={5}
                    shadow="sm"
                  >
                    <HStack align="flex-start" spacing={4}>
                      {pdf ? (
                        <PdfThumbnail
                          url={item.file_url}
                          alt={item.title}
                          boxSize="72px"
                          borderRadius="lg"
                          borderColor={borderColor}
                        />
                      ) : (
                        <Image
                          src={item.file_url}
                          alt={item.title}
                          w="72px"
                          h="72px"
                          objectFit="cover"
                          borderRadius="lg"
                          border="1px"
                          borderColor={borderColor}
                          flexShrink={0}
                        />
                      )}

                      <Box flex={1}>
                        <HStack mb={1} flexWrap="wrap">
                          <Heading size="sm">{item.title}</Heading>
                          {item.issue_date && (
                            <Badge colorScheme="purple">
                              {item.issue_date}
                            </Badge>
                          )}
                        </HStack>

                        {item.issuer && (
                          <Text
                            fontWeight="medium"
                            color="teal.500"
                            fontSize="sm"
                          >
                            {item.issuer}
                          </Text>
                        )}

                        <HStack mt={3} spacing={4} flexWrap="wrap">
                          <Link
                            href={item.file_url}
                            isExternal
                            color="teal.500"
                          >
                            Open certificate
                          </Link>
                          <Text fontSize="sm" color="gray.500">
                            {pdf ? 'PDF' : 'PNG'}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                )
              })}
            </VStack>
          )}
        </Section>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const { getAllCertificates } = await import('../lib/db')
    const items = await getAllCertificates()
    const serialize = row => ({
      ...row,
      created_at: row.created_at?.toISOString?.() || null,
      updated_at: row.updated_at?.toISOString?.() || null
    })
    return { props: { certificates: (items || []).map(serialize) } }
  } catch {
    return { props: { certificates: [] } }
  }
}
