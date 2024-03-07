import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/project'
import Paragraph from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Project = () => (
  <Layout title="Skate">
    <Container my={6}>
      <Title>
        the Algerian Online Store <Badge>2024</Badge>
      </Title>
      <Paragraph>
        I built the website while working as a web developer at Skate Company.
        My main job was to create and design the company's website, which had
        different parts like Home, Courses, Services, Events, and Blogs. One big
        challenge I faced was putting the Admin Dashboard into the website
        smoothly. To solve this, I used my web development skills and the latest
        technologies to make sure everything worked well.
      </Paragraph>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Stream :</Meta>
          <Link href="https://www.skate-consult.com/">
            https://www.skate-consult.com/
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Coded by :</Meta>
          <span>Reactjs, ExpressJs, JWT Authenthication, MongoDB</span>
        </ListItem>
      </List>

      <WorkImage src="/images/projects/AOS.png" alt="AOS" />
      <WorkImage src="/images/projects/AOS.png" alt="AOS" />
    </Container>
  </Layout>
)

export default Project
