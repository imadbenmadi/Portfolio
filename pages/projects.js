import NextLink from 'next/link'
import {
  Container,
  Heading,
  SimpleGrid,
  Divider,
  Button,
  useColorModeValue,
  Box,
  Text,
  Center,
  VStack
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { WorkGridItem } from '../components/grid-item'
import { IoLogoGithub } from 'react-icons/io5'

const Projects = ({ mainProjects, oldProjects }) => {
  const colorScheme = useColorModeValue('blue', 'red')

  return (
    <Layout title="Portfolio">
      <Container>
        <Heading as="h3" fontSize={20} my={4}>
          Projects
        </Heading>

        {mainProjects.length === 0 ? (
          <Center py={16}>
            <Text color="gray.500">No projects yet.</Text>
          </Center>
        ) : (
          <SimpleGrid columns={[1, 1, 1]} gap={16}>
            {mainProjects.map((project, i) => (
              <Section key={project.id} delay={0.1 + i * 0.05}>
                <WorkGridItem
                  id={project.slug}
                  title={project.title}
                  thumbnail={project.thumbnail_url || '/images/placeholder.png'}
                >
                  {project.description}
                </WorkGridItem>
              </Section>
            ))}
          </SimpleGrid>
        )}

        {oldProjects.length > 0 && (
          <>
            <Section delay={0.3}>
              <Divider my={6} />
              <Heading as="h3" fontSize={20} mb={4}>
                Old Projects
              </Heading>
            </Section>
            <SimpleGrid columns={[1, 1, 2]} gap={6}>
              {oldProjects.map((project, i) => (
                <Section key={project.id} delay={0.1 + i * 0.05}>
                  <WorkGridItem
                    id={project.slug}
                    title={project.title}
                    thumbnail={
                      project.thumbnail_url || '/images/placeholder.png'
                    }
                  >
                    {project.description}
                  </WorkGridItem>
                </Section>
              ))}
            </SimpleGrid>
          </>
        )}

        <Box textAlign="center" my={6}>
          <Button
            as={NextLink}
            href="https://github.com/imadbenmadi"
            target="_blank"
            scroll={false}
            rightIcon={<IoLogoGithub />}
            colorScheme={colorScheme}
          >
            View All on GitHub
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}

export default Projects

export async function getServerSideProps() {
  try {
    const { getAllProjects } = await import('../lib/db')
    const all = await getAllProjects()

    const serialize = p => ({
      ...p,
      created_at: p.created_at?.toISOString?.() || null,
      updated_at: p.updated_at?.toISOString?.() || null
    })

    return {
      props: {
        mainProjects: all.filter(p => p.category === 'main').map(serialize),
        oldProjects: all.filter(p => p.category === 'old').map(serialize)
      }
    }
  } catch {
    return { props: { mainProjects: [], oldProjects: [] } }
  }
}
