import {
  Container,
  Heading,
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Image,
  HStack,
  SimpleGrid
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'

const CATEGORIES = [
  { value: 'languages', label: 'Programming Languages', color: 'yellow' },
  { value: 'frontend', label: 'Frontend', color: 'blue' },
  { value: 'backend', label: 'Backend', color: 'green' },
  { value: 'databases', label: 'Databases', color: 'orange' },
  { value: 'hosting', label: 'Hosting / DevOps', color: 'purple' },
  { value: 'other', label: 'Other', color: 'gray' }
]

function SkillPill({ skill }) {
  const bg = useColorModeValue('whiteAlpha.800', 'whiteAlpha.100')
  const border = useColorModeValue('gray.200', 'gray.600')

  return (
    <HStack
      bg={bg}
      border="1px"
      borderColor={border}
      borderRadius="lg"
      px={4}
      py={2}
      spacing={2}
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s'
      }}
      transition="all 0.2s"
    >
      {skill.icon_url && (
        <Image
          src={skill.icon_url}
          alt={skill.name}
          boxSize="22px"
          objectFit="contain"
        />
      )}
      <Text fontSize="sm" fontWeight="medium">
        {skill.name}
      </Text>
    </HStack>
  )
}

export default function Skills({ skills }) {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')

  // Filter categories that have at least one skill
  const groups = CATEGORIES.filter(cat =>
    skills.some(s => s.category === cat.value)
  )

  return (
    <Layout title="Skills">
      <Container>
        <Heading as="h3" fontSize={20} my={4}>
          Skills
        </Heading>

        {skills.length === 0 ? (
          <Text color="gray.500" py={8} textAlign="center">
            No skills added yet.
          </Text>
        ) : (
          <Box>
            {groups.map((cat, i) => {
              const catSkills = skills.filter(s => s.category === cat.value)
              return (
                <Section key={cat.value} delay={0.1 + i * 0.05}>
                  <Box bg={cardBg} borderRadius="xl" p={5} mb={4}>
                    <Heading as="h4" size="md" mb={4}>
                      <Badge
                        colorScheme={cat.color}
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="md"
                        variant="subtle"
                      >
                        {cat.label}
                      </Badge>
                    </Heading>
                    <Wrap spacing={3}>
                      {catSkills.map(skill => (
                        <WrapItem key={skill.id}>
                          <SkillPill skill={skill} />
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                </Section>
              )
            })}
          </Box>
        )}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const { getAllSkills } = await import('../lib/db')
    const skills = await getAllSkills()
    const serialize = s => ({
      ...s,
      created_at: s.created_at?.toISOString?.() || null
    })
    return { props: { skills: skills.map(serialize) } }
  } catch {
    return { props: { skills: [] } }
  }
}
