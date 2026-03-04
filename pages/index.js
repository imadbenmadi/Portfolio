import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Button,
  useColorModeValue,
  List,
  ListItem,
  Wrap,
  WrapItem,
  HStack,
  Text,
  Image,
  Badge
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import RichTextDisplay from '../components/editor/RichTextDisplay'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { IoLogoInstagram, IoLogoGithub, IoLogoLinkedin } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import NextImage from 'next/image'

const CATEGORY_COLORS = {
  languages: 'yellow',
  frontend: 'blue',
  backend: 'green',
  databases: 'orange',
  hosting: 'purple',
  other: 'gray'
}

const CATEGORY_LABELS = {
  languages: 'Programming Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  databases: 'Databases',
  hosting: 'Hosting / DevOps',
  other: 'Other'
}

const CATEGORY_ORDER = [
  'languages',
  'frontend',
  'backend',
  'databases',
  'hosting',
  'other'
]

function SkillsPreview({ skills }) {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const pillBg = useColorModeValue('white', 'gray.700')
  const pillBorder = useColorModeValue('gray.200', 'gray.600')

  if (!skills || skills.length === 0) return null

  const groups = CATEGORY_ORDER.map(cat => ({
    cat,
    items: skills.filter(s => s.category === cat)
  })).filter(g => g.items.length > 0)

  return (
    <Section delay={0.2}>
      <Heading as="h3" variant="section-title">
        Skills
      </Heading>
      <Box>
        {groups.map(({ cat, items }) => (
          <Box
            key={cat}
            bg={cardBg}
            borderRadius="xl"
            p={4}
            mb={4}
            textAlign="center"
          >
            <Heading as="h4" size="sm" mb={3}>
              <Badge
                colorScheme={CATEGORY_COLORS[cat]}
                fontSize="sm"
                px={2}
                py={0.5}
                borderRadius="md"
                variant="subtle"
              >
                {CATEGORY_LABELS[cat]}
              </Badge>
            </Heading>
            <Wrap justify="center" spacing={2}>
              {items.map(skill => (
                <WrapItem key={skill.id}>
                  <HStack
                    bg={pillBg}
                    border="1px"
                    borderColor={pillBorder}
                    borderRadius="lg"
                    px={3}
                    py={1.5}
                    spacing={2}
                  >
                    {skill.icon_url && (
                      <Image
                        src={skill.icon_url}
                        alt={skill.name}
                        boxSize="18px"
                        objectFit="contain"
                      />
                    )}
                    <Text fontSize="sm">{skill.name}</Text>
                  </HStack>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        ))}
        <Box textAlign="center" mt={2}>
          <Button
            as={NextLink}
            href="/skills"
            size="sm"
            variant="ghost"
            rightIcon={<ChevronRightIcon />}
          >
            View all skills
          </Button>
        </Box>
      </Box>
    </Section>
  )
}

const Page = ({ homepage, skills }) => {
  const hp = homepage || {}
  const colorScheme = useColorModeValue('blue', 'red')
  const borderColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  return (
    <Layout>
      <Container>
        <Box display={{ md: 'flex' }} mt={6}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              {hp.name || 'Benmadi imed eddine'}
            </Heading>
            <p>{hp.title || 'Full Stack web developer'}</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor={borderColor}
              borderWidth={2}
              borderStyle="solid"
              w="200px"
              h="200px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <NextImage
                src={hp.profile_image_url || '/images/imad.jpg'}
                alt="profile pic"
                width="200"
                height="200"
                priority={true}
              />
            </Box>
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as="h3" variant="section-title">
            About Me
          </Heading>
          <RichTextDisplay
            content={
              hp.bio ||
              "<p>I'm Benmadi Imed-Eddine, a computer science graduate currently specializing in data science for my master's degree. Residing in Budapest, Hungary, I work as a full-stack web developer, creating robust websites and Platforms for startups, small businesses, and large enterprises. I am passionate about continuous learning and thrive on tackling new challenges and devising innovative solutions.</p>"
            }
          />

          <RichTextDisplay
            content={
              hp.bio2 ||
              '<p>Let\u2019s chat and see how we can create something awesome together!</p>'
            }
          />

          <Button variant="ghost" colorScheme={colorScheme}>
            <a
              href={`mailto:${hp.email || 'benmadi.imadeedin@univ-ouargla.dz'}`}
            >
              {hp.email || 'benmadi.imadeedin@univ-ouargla.dz'}
            </a>
          </Button>
          <Section
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="center"
            gap={4}
            my={6}
          >
            <Box textAlign="center" my={6} ml={0}>
              <Button
                as="a"
                href={hp.cv_url || '/CV.pdf'}
                download
                colorScheme={colorScheme}
              >
                Download CV
              </Button>
            </Box>
            <Box textAlign="center" my={6} ml={0}>
              <Button
                as={NextLink}
                href="/projects"
                scroll={false}
                rightIcon={<ChevronRightIcon />}
                colorScheme={colorScheme}
              >
                My Protfolio
              </Button>
            </Box>
          </Section>
        </Section>

        <SkillsPreview skills={skills} />

        <Section delay={0.3}>
          <Heading as="h3" variant="section-title">
            Contact Me
          </Heading>
          <List spacing={4} fontSize="20px">
            <ListItem>
              <Link
                href={`mailto:${hp.email || 'benmadi.imed@gmail.com'}`}
                target="_blank"
              >
                <Button
                  variant="ghost"
                  colorScheme={colorScheme}
                  leftIcon={<MdEmail />}
                >
                  {hp.email || 'benmadi.imed@gmail.com'}
                </Button>
              </Link>
            </ListItem>
            {(hp.github_url || true) && (
              <ListItem>
                <Link
                  href={hp.github_url || 'https://github.com/imadbenmadi'}
                  target="_blank"
                >
                  <Button
                    variant="ghost"
                    colorScheme={colorScheme}
                    leftIcon={<IoLogoGithub />}
                  >
                    @imadbenmadi
                  </Button>
                </Link>
              </ListItem>
            )}
            {(hp.linkedin_url || true) && (
              <ListItem>
                <Link
                  href={
                    hp.linkedin_url ||
                    'https://www.linkedin.com/in/imad-benmadi-4b5a72236/'
                  }
                  target="_blank"
                >
                  <Button
                    variant="ghost"
                    colorScheme={colorScheme}
                    leftIcon={<IoLogoLinkedin />}
                  >
                    @imadbenmadi
                  </Button>
                </Link>
              </ListItem>
            )}
            {(hp.instagram_url || true) && (
              <ListItem>
                <Link
                  href={
                    hp.instagram_url ||
                    'https://www.instagram.com/imed.benmadi/'
                  }
                  target="_blank"
                >
                  <Button
                    variant="ghost"
                    colorScheme={colorScheme}
                    leftIcon={<IoLogoInstagram />}
                  >
                    @imed.benmadi
                  </Button>
                </Link>
              </ListItem>
            )}
          </List>
        </Section>

        {/* <ContactForm /> */}
      </Container>
    </Layout>
  )
}

export default Page
export async function getServerSideProps() {
  try {
    const { getHomepage, getAllSkills } = await import('../lib/db')
    const [homepage, skills] = await Promise.all([
      getHomepage(),
      getAllSkills()
    ])
    const serializeSkill = s => ({
      ...s,
      created_at: s.created_at?.toISOString?.() || null
    })
    return {
      props: {
        homepage: homepage || null,
        skills: (skills || []).map(serializeSkill)
      }
    }
  } catch {
    // DB not configured yet — return empty props, static defaults apply
    return { props: { homepage: null, skills: [] } }
  }
}
