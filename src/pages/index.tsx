import { useState } from 'react';
import type { NextPage, GetStaticProps } from 'next'
import Api from '../services/api';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Button,
} from 'react-bootstrap';

interface HomeProps{
  users: Array<User>;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

const Home: NextPage <HomeProps> = ({users}) => {
  const [numberUsers, setNumberUsers] = useState<number>(3);

  const handlerNumberUsers = () => {
    setNumberUsers(numberUsers + 3);
  };
  
  return (
    <Container>
    <Row>
      <Col>
        <ListGroup>
          {users.map((user, index) => (index < numberUsers ? (
            <ListGroup.Item key={user.id}>
                {user.name}
            </ListGroup.Item>
          ) : (
            ''
          )))}
        </ListGroup>

        <Button onClick={handlerNumberUsers}>mostrar mais</Button>
      </Col>
    </Row>
  </Container>
  )
}

export default Home


export const getStaticProps: GetStaticProps = async (context) => {
  const { data } = await Api.get('/users');
  const users = data;

  return {
    props: {
      users,
    },
  };
};