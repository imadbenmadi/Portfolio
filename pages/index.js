import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Button,
  useColorModeValue,
  List,
  ListItem
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { IoLogoInstagram, IoLogoGithub, IoLogoLinkedin } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import StackSection from '../components/stack'
import Image from 'next/image'
import ContactForm from '../components/contact'

const Page = () => {
  return (
    <Layout>
      <Container>
        <Box display={{ md: 'flex' }} mt={6}>
          <Box flexGrow={1}>
            <Heading as="h2" variant="page-title">
              Benmadi imed eddine
            </Heading>
            <p>Full Stack web developer</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
            <Box
              borderColor={useColorModeValue('gray.800', 'whiteAlpha.900')}
              borderWidth={2}
              borderStyle="solid"
              w="200px"
              h="200px"
              display="inline-block"
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                src="/images/imad.jpg"
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
          <Paragraph>
            Hey there! I'm imed eddine, a budding web developer fueled by
            curiosity and a love for coding. Currently studying computer
            science, I'm on a mission to land my first programming gig.
          </Paragraph>
          <Paragraph>
            I'm all about diving into new challenges and learning as I go. When
            I'm not coding, you'll find me buried in books or brainstorming new
            project ideas.
          </Paragraph>
          <Paragraph>
            Let's chat and see how we can create something awesome together!
          </Paragraph>
          <Button
            variant="ghost"
            colorScheme={useColorModeValue('blue', 'red')}
          >
            <a href="mailto:benmadi.imadeedin@univ-ouargla.dz">
              benmadi.imadeedin@univ-ouargla.dz
            </a>
          </Button>
          <Box textAlign="center" my={6} ml={0}>
            <Button
              as={NextLink}
              href="/projects"
              scroll={false}
              rightIcon={<ChevronRightIcon />}
              colorScheme={useColorModeValue('blue', 'red')}
            >
              My Protfolio
            </Button>
          </Box>
        </Section>

        <StackSection />

        <Section delay={0.3}>
          <Heading as="h3" variant="section-title">
            Contact Me
          </Heading>
          <List spacing={4} fontSize="20px">
            <ListItem>
              <Link
                href="mailto:benmadi.imadeedin@univ-ouargla.dz"
                target="_blank"
              >
                <Button
                  variant="ghost"
                  colorScheme={useColorModeValue('blue', 'red')}
                  leftIcon={<MdEmail />}
                >
                  benmadi.imadeedin@univ-ouargla.dz
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://github.com/imadbenmadi" target="_blank">
                <Button
                  variant="ghost"
                  colorScheme={useColorModeValue('blue', 'red')}
                  leftIcon={<IoLogoGithub />}
                >
                  @imadbenmadi
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://www.linkedin.com/in/imad-benmadi-4b5a72236/"
                target="_blank"
              >
                <Button
                  variant="ghost"
                  colorScheme={useColorModeValue('blue', 'red')}
                  leftIcon={<IoLogoLinkedin />}
                >
                  @imadbenmadi
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="https://www.instagram.com/_imad_benmadi_/"
                target="_blank"
              >
                <Button
                  variant="ghost"
                  colorScheme={useColorModeValue('blue', 'red')}
                  leftIcon={<IoLogoInstagram />}
                >
                  @_imad_benmadi_
                </Button>
              </Link>
            </ListItem>
          </List>
        </Section>

        {/* <ContactForm /> */}
      </Container>
    </Layout>
  )
}

export default Page
export { getServerSideProps } from '../components/chakra'
