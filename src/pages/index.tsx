import { useState } from "react";
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

const Home: NextPage<HomeProps> = ({ users }) => {
  const [numberUsers, setNumberUsers] = useState<number>(3);
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => {
    setShow(false);
  };

  const handlerModal = () => {
    setShow(!show);
  };

  const handlerNumberUsers = () => {
    setNumberUsers(numberUsers + 3);
  };

  return (
    <Container>
      <Row>
        <Col>
          <ListGroup>
            {users.map((user, index) =>
              index < numberUsers ? (
                <ListGroup.Item key={user.id}>
                  <Button variant="link" onClick={handlerModal}>
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
          <Modal.Title>Lorem ipsum dolor sit amet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer quis
          tortor sit amet ipsum imperdiet accumsan a nec nunc. Vestibulum ac
          arcu id eros laoreet molestie nec nec mi.
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
