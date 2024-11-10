import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, WorkImage, Meta } from '../../components/project'
import Paragraph from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Project = () => (
  <Layout title="FlexEdu">
    <Container my={6}>
      <Title>
        FlexEdu<Badge>2024</Badge>
      </Title>
      <Paragraph>
        
      </Paragraph>
      <List ml={4} my={4}>
        <ListItem>
          <Meta>Live Stream :</Meta>
          <Link href="https://FlexEdu-dz.com/" target="_black">
            Link <ExternalLinkIcon mx="2px" />
          </Link>
        </ListItem>
        <ListItem>
          <Meta>Coded by :</Meta>
          <span>
            Reactjs, TaillwinddCss, ReactRouter, ExpressJs, JWT Authenthication,
            MySql and Sequelize
          </span>
        </ListItem>
      </List>

      <WorkImage src="/images/projects/FlexEdu/1.jpg" alt="FlexEdu" />
      <WorkImage src="/images/projects/FlexEdu/4.png" alt="FlexEdu" />
      
    </Container>
  </Layout>
)

export default Project
