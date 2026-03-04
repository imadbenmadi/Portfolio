import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Text,
  SimpleGrid
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { IoLogoGithub } from 'react-icons/io5'
import { Title, WorkImage, Meta } from '../../components/project'
import RichTextDisplay from '../../components/editor/RichTextDisplay'
import Layout from '../../components/layouts/article'

export default function DynamicProject({ project }) {
  if (!project) {
    return (
      <Layout title="Not Found">
        <Container my={6}>
          <Text>Project not found.</Text>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout title={project.title}>
      <Container my={6}>
        <Title>
          {project.title}
          {project.year && <Badge ml={2}>{project.year}</Badge>}
        </Title>

        {project.description && (
          <RichTextDisplay content={project.description} />
        )}

        <List ml={4} my={4}>
          {project.live_url && (
            <ListItem>
              <Meta>Live:</Meta>
              <Link href={project.live_url} target="_blank">
                {project.live_url} <ExternalLinkIcon mx="2px" />
              </Link>
            </ListItem>
          )}
          {project.github_url && (
            <ListItem>
              <Meta>GitHub:</Meta>
              <Link href={project.github_url} target="_blank">
                {project.github_url} <ExternalLinkIcon mx="2px" />
              </Link>
            </ListItem>
          )}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <ListItem>
              <Meta>Stack:</Meta>
              <span>{project.tech_stack.join(', ')}</span>
            </ListItem>
          )}
        </List>

        {project.thumbnail_url && (
          <WorkImage src={project.thumbnail_url} alt={project.title} />
        )}

        {Array.isArray(project.images) &&
          project.images.map((img, i) => (
            <WorkImage
              key={i}
              src={img}
              alt={`${project.title} screenshot ${i + 1}`}
            />
          ))}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const { slug } = params
  try {
    const { getProjectBySlug } = await import('../../lib/db')
    const project = await getProjectBySlug(slug)
    if (!project) return { notFound: true }
    return {
      props: {
        project: {
          ...project,
          created_at: project.created_at?.toISOString?.() || null,
          updated_at: project.updated_at?.toISOString?.() || null
        }
      }
    }
  } catch {
    return { notFound: true }
  }
}
