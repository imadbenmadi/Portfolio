import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../../components/project'
import Paragraph from '../../../components/paragraph'
import Layout from '../../../components/layouts/article'

const Project = () => (
  <Layout title="AOS">
    <Container my={6}>
      <Title>
        the Algerian Online Store <Badge>2023</Badge>
      </Title>
      <Paragraph>
        An Algerian e-commerce platform that brings together sellers (store
        owners) and buyers, specializing in ease of use, cash transactions, and
        transportation. The project utilizes enhanced learning algorithms to
        display suggested products according to user preferences. I was the
        back-end developer for this project. We delved deep into real complex
        problems and solved them. I built it with my friend Salah.
      </Paragraph>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Stream :</Meta>
          <Link href="https://l3-front-end-ei2b.vercel.app/">
            link
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Backend Github Repo : </Meta>
          <Link href="https://github.com/imadbenmadi/AOS">
            https://github.com/imadbenmadi/AOS
            <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>NodeJS, MongoDB</span>
        </ListItem>
      </List>

      <WorkImage src="/images/projects/My/AOS2.png" alt="AOS" />
      <WorkImage src="/images/projects/My/AOS.png" alt="AOS" />
    </Container>
  </Layout>
)

export default Project
