import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/project'
import Paragraph from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Project = () => (
  <Layout title="AOS">
    <Container my={6}>
      <Title>
        Info Solutions <Badge>2024</Badge>
      </Title>
      <Paragraph>
        Developed within the Cntic club, our aim was to compile all the
        mathematical modules studied at the university and create a website
        capable of solving equations and other problems specific to each module.
        Our initiative seeks to facilitate learning and understanding of
        mathematical concepts for students.
      </Paragraph>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Stream :</Meta>
          <Link href="https://info-solutions.vercel.app/">
            link
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Github Repo : </Meta>
          <Link href="https://github.com/imadbenmadi/InfoSolutions">
            https://github.com/imadbenmadi/InfoSolutions
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Coded by :</Meta>
          <span>Reactjs</span>
        </ListItem>
      </List>

      <WorkImage src="/images/projects/Infosolutions.png" alt="Infosolutions" />
    </Container>
  </Layout>
)

export default Project
