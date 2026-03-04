import {
  Container,
  Heading,
  Box,
  Text,
  useColorModeValue,
  Badge,
  VStack
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import RichTextDisplay from '../components/editor/RichTextDisplay'

function TimelineItem({ item, isLast }) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const dotBg = useColorModeValue('teal.400', 'teal.300')
  const lineBg = useColorModeValue('gray.200', 'gray.600')
  const companyColor = useColorModeValue('teal.600', 'teal.300')

  return (
    <Box display="flex" gap={0}>
      {/* Timeline axis */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mr={5}
        flexShrink={0}
      >
        {/* Dot */}
        <Box
          w="14px"
          h="14px"
          borderRadius="full"
          bg={dotBg}
          mt="6px"
          flexShrink={0}
          zIndex={1}
          boxShadow={`0 0 0 3px ${useColorModeValue('#e2e8f0', '#4a5568')}`}
        />
        {/* Line */}
        {!isLast && <Box w="2px" flex={1} bg={lineBg} mt={1} />}
      </Box>

      {/* Card */}
      <Box
        flex={1}
        bg={cardBg}
        border="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={5}
        mb={isLast ? 0 : 6}
        shadow="sm"
        _hover={{
          shadow: 'md',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s'
        }}
        transition="all 0.2s"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Heading size="sm" mb={1}>
              {item.role}
            </Heading>
            <Text fontWeight="semibold" color={companyColor} fontSize="sm">
              {item.company}
            </Text>
            {item.location && (
              <Text fontSize="xs" color="gray.500" mt={0.5}>
                {item.location}
              </Text>
            )}
          </Box>
          <Badge
            colorScheme="teal"
            variant="subtle"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="md"
            flexShrink={0}
          >
            {item.start_date}
            {item.end_date ? ` – ${item.end_date}` : ' – Present'}
          </Badge>
        </Box>

        {item.description && (
          <Box mt={3}>
            <RichTextDisplay content={item.description} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function Experience({ experiences, education }) {
  return (
    <Layout title="Experience">
      <Container maxW="container.md">
        <Heading as="h3" fontSize={20} my={4}>
          Experience
        </Heading>

        <Section delay={0.1}>
          {experiences.length === 0 ? (
            <Text color="gray.500" py={8} textAlign="center">
              No experiences added yet.
            </Text>
          ) : (
            <Box>
              {experiences.map((item, i) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  isLast={i === experiences.length - 1}
                />
              ))}
            </Box>
          )}
        </Section>

        {education.length > 0 && (
          <Section delay={0.2}>
            <Heading as="h3" fontSize={20} mb={4} mt={8}>
              Education
            </Heading>
            <Box>
              {education.map((item, i) => (
                <TimelineItem
                  key={item.id}
                  item={{
                    role: item.degree + (item.field ? ` in ${item.field}` : ''),
                    company: item.institution,
                    location: null,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    description: item.description
                  }}
                  isLast={i === education.length - 1}
                />
              ))}
            </Box>
          </Section>
        )}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const { getAllExperiences, getAllEducation } = await import('../lib/db')
    const serialize = row => ({
      ...row,
      created_at: row.created_at?.toISOString?.() || null
    })
    const [experiences, education] = await Promise.all([
      getAllExperiences(),
      getAllEducation()
    ])
    return {
      props: {
        experiences: experiences.map(serialize),
        education: education.map(serialize)
      }
    }
  } catch {
    return { props: { experiences: [], education: [] } }
  }
}
