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
  Badge,
  Center
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import RichTextDisplay from '../components/editor/RichTextDisplay'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { IoLogoInstagram, IoLogoGithub, IoLogoLinkedin } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import NextImage from 'next/image'
import PdfThumbnail from '../components/PdfThumbnail'

import {
  SKILL_CATEGORIES,
  CATEGORY_BY_VALUE,
  BUILTIN_ICON_BY_VALUE
} from '../lib/skillsMeta'

function SkillsPreview({ skills }) {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const pillBg = useColorModeValue('white', 'gray.700')
  const pillBorder = useColorModeValue('gray.200', 'gray.600')

  if (!skills || skills.length === 0) return null

  const PRIORITY_CATEGORIES = ['data', 'cloud', 'devops']

  const groups = SKILL_CATEGORIES.map(cat => ({
    cat,
    items: skills.filter(s => s.category === cat.value)
  }))
    .filter(g => g.items.length > 0)
    .sort((a, b) => {
      const ai = PRIORITY_CATEGORIES.indexOf(a.cat.value)
      const bi = PRIORITY_CATEGORIES.indexOf(b.cat.value)
      const ap = ai === -1 ? Infinity : ai
      const bp = bi === -1 ? Infinity : bi
      return ap - bp
    })

  return (
    <Section delay={0.2}>
      <Heading as="h3" variant="section-title">
        Skills
      </Heading>
      <Box>
        {groups.map(({ cat, items }) => (
          <Box
            key={cat.value}
            bg={cardBg}
            borderRadius="xl"
            p={4}
            mb={4}
            textAlign="center"
          >
            <Heading as="h4" size="sm" mb={3}>
              <Badge
                colorScheme={
                  (CATEGORY_BY_VALUE[cat.value] || cat).color || 'gray'
                }
                fontSize="sm"
                px={2}
                py={0.5}
                borderRadius="md"
                variant="subtle"
              >
                {(CATEGORY_BY_VALUE[cat.value] || cat).label || cat.label}
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
                    {skill.icon_name &&
                    BUILTIN_ICON_BY_VALUE[skill.icon_name] ? (
                      <Box
                        as={BUILTIN_ICON_BY_VALUE[skill.icon_name].Icon}
                        boxSize="18px"
                      />
                    ) : (
                      skill.icon_url && (
                        <Image
                          src={skill.icon_url}
                          alt={skill.name}
                          boxSize="18px"
                          objectFit="contain"
                        />
                      )
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

const Page = ({ homepage, skills, experiences, education, certificates }) => {
  const hp = homepage || {}
  const colorScheme = useColorModeValue('blue', 'red')
  const borderColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  const certCardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
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

        <Section delay={0.25}>
          <Heading as="h3" variant="section-title">
            Experience
          </Heading>

          {!experiences || experiences.length === 0 ? (
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

        {education && education.length > 0 && (
          <Section delay={0.3}>
            <Heading as="h3" variant="section-title" mt={8}>
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
        <SkillsPreview skills={skills} />

        {certificates && certificates.length > 0 && (
          <Section delay={0.35}>
            <Heading as="h3" variant="section-title" mt={8}>
              Certificates
            </Heading>
            <Box>
              <Wrap spacing={{ base: 3, md: 5, lg: 6 }} justify="center">
                {certificates.map(c => {
                  const isPdf =
                    c.file_type === 'application/pdf' ||
                    String(c.file_url || '')
                      .toLowerCase()
                      .includes('.pdf')
                  return (
                    <WrapItem key={c.id}>
                      <Box
                        bg={certCardBg}
                        borderRadius="2xl"
                        p={{ base: 3, md: 5 }}
                        w={{
                          base: '160px',
                          sm: '200px',
                          md: '280px',
                          lg: '50vw'
                        }}
                        shadow="sm"
                        _hover={{
                          shadow: 'md',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s'
                        }}
                        transition="all 0.2s"
                      >
                        <Center mb={3}>
                          {isPdf ? (
                            <PdfThumbnail
                              url={c.file_url}
                              alt={c.title}
                              boxSize={{
                                base: '120px',
                                sm: '160px',
                                md: '220px',
                                lg: '80%'
                              }}
                              borderRadius="xl"
                              borderWidth="0px"
                            />
                          ) : (
                            <Image
                              src={c.file_url}
                              alt={c.title}
                              w={{
                                base: '120px',
                                sm: '160px',
                                md: '220px',
                                lg: '80%'
                              }}
                              h={{
                                base: '120px',
                                sm: '160px',
                                md: '220px',
                                lg: '260px'
                              }}
                              objectFit="cover"
                              borderRadius="xl"
                            />
                          )}
                        </Center>

                        <Text
                          fontWeight="bold"
                          noOfLines={2}
                          mb={1}
                          fontSize={{ base: 'sm', md: 'md' }}
                        >
                          {c.title}
                        </Text>

                        {[c.issuer, c.issue_date].filter(Boolean).length >
                          0 && (
                          <Text
                            fontSize={{ base: 'xs', md: 'sm' }}
                            color="gray.500"
                            noOfLines={1}
                            mb={3}
                          >
                            {[c.issuer, c.issue_date]
                              .filter(Boolean)
                              .join(' • ')}
                          </Text>
                        )}

                        <Button
                          as={Link}
                          href={c.file_url}
                          isExternal
                          w="full"
                          size={{ base: 'xs', md: 'sm' }}
                          colorScheme="teal"
                          variant="solid"
                        >
                          Open
                        </Button>
                      </Box>
                    </WrapItem>
                  )
                })}
              </Wrap>
              <Box textAlign="center" mt={2}>
                <Button
                  as={NextLink}
                  href="/certificates"
                  size="sm"
                  variant="ghost"
                  rightIcon={<ChevronRightIcon />}
                >
                  View all certificates
                </Button>
              </Box>
            </Box>
          </Section>
        )}

        <Section delay={0.4}>
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
    const {
      getHomepage,
      getAllSkills,
      getAllExperiences,
      getAllEducation,
      getAllCertificates
    } = await import('../lib/db')
    const [homepage, skills, experiences, education, certificates] =
      await Promise.all([
        getHomepage(),
        getAllSkills(),
        getAllExperiences(),
        getAllEducation(),
        getAllCertificates()
      ])
    const serializeHomepage = h =>
      h
        ? {
            ...h,
            updated_at: h.updated_at?.toISOString?.() || null
          }
        : null
    const serializeTimelineRow = row => ({
      ...row,
      created_at: row.created_at?.toISOString?.() || null
    })
    const serializeSkill = s => ({
      ...s,
      created_at: s.created_at?.toISOString?.() || null
    })
    const serializeCertificate = c => ({
      ...c,
      created_at: c.created_at?.toISOString?.() || null,
      updated_at: c.updated_at?.toISOString?.() || null
    })
    return {
      props: {
        homepage: serializeHomepage(homepage),
        skills: (skills || []).map(serializeSkill),
        experiences: (experiences || []).map(serializeTimelineRow),
        education: (education || []).map(serializeTimelineRow),
        certificates: (certificates || []).map(serializeCertificate)
      }
    }
  } catch {
    // DB not configured yet — return empty props, static defaults apply
    return {
      props: {
        homepage: null,
        skills: [],
        experiences: [],
        education: [],
        certificates: []
      }
    }
  }
}
