import { useState, useEffect } from "react";
import { NextPage, GetStaticProps } from "next";
import Api from "../services/api";

import css from 'styled-jsx/css';
import { Container, Row, Col, ListGroup, Modal, Button } from "react-bootstrap";

interface HomeProps {
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

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Home: NextPage<HomeProps> = ({ users }) => {
  const [numberUsers, setNumberUsers] = useState<number>(3);
  const [numbersPosts, setNumbersPosts] = useState<number>(3);
  const [show, setShow] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>();

  const { className, styles } = css.resolve`
  .modal-body {
    max-height: 50vh;
    overflow: overlay;
  }
`;

  const handleClose = () => {
    setShow(false);
    setNumbersPosts(3);
  };

  const handlerModal = (author: User) => {
    setUser(author);
    setShow(!show);
  };

  const handlerNumberUsers = () => {
    setNumberUsers(numberUsers + 3);
  };

  const handlerNumberPosts = () => {
    setNumbersPosts(numbersPosts + 3);
  };

  useEffect(() => {
    Api.get(`/posts?userId=${user?.id}`)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => console.log(error));
  }, [user]);
  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            {users.map((user, index) =>
              index < numberUsers ? (
                <ListGroup.Item key={user.id}>
                  <Button variant="link" onClick={() => handlerModal(user)}>
                    {user.name}
                  </Button>
                </ListGroup.Item>
              ) : (
                ""
              )
            )}
          </ListGroup>
          <Button onClick={handlerNumberUsers}>mostrar mais</Button>
        </Col>
      </Row>
      <Modal className={className} show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{user?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={className}>
          <ListGroup>
            {posts?.map((post, index) =>
              index < numbersPosts ? (
                <ListGroup.Item key={post.id}>
                  <h5>{post.title}</h5>
                  <p>{post.body}</p>
                </ListGroup.Item>
              ) : (
                ""
              )
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlerNumberPosts}>mostrar mais</Button>
        </Modal.Footer>
      </Modal>
      {styles}
    </Container>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await Api.get("/users");
  const users = data;

  return {
    props: {
      users,
    },
  };
};
