import { useState, useEffect } from "react";
import type { NextPage, GetStaticProps } from "next";
import Api from "../services/api";
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
  visible?: boolean;
}

const Home: NextPage<HomeProps> = ({ users }) => {
  const [numberUsers, setNumberUsers] = useState<number>(3);
  const [show, setShow] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<Post[]>();

  const handleClose = () => {
    setShow(false);
  };

  const handlerModal = (author: User) => {
    setUser(author);
    setShow(!show);
  };

  const handlerNumberUsers = () => {
    setNumberUsers(numberUsers + 3);
  };

  useEffect(() => {
    Api
      .get(`/posts?userId=${user?.id}`)
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{user?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {posts?.map((post, index) => (index < 3 ? (
              <ListGroup key={post.id}>
                <h5>{post.title}</h5>
                <p>{post.body}</p>
              </ListGroup>
            ) : (
              ''
            )))}
        </Modal.Body>
      </Modal>
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
