import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router";
const Signup: React.FC = () => {
  return (
    <div>
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <div className="p-5 rounded shadow">
          <h2 className="text-center mb-4 ">
            <span className="text-primary">Register</span> your FREE account.
          </h2>

          <Form>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Your e-mail</Form.Label>
              <Form.Control type="email" placeholder="E.g. info@example.com" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Your full name</Form.Label>
              <Form.Control type="text" placeholder="E.g. John Doe" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>
                Password <span className="text-muted">(min. 6 characters)</span>
              </Form.Label>
              <Form.Control type="password" placeholder="******" />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="primary" size="lg" type="submit">
                Register now
              </Button>
            </div>

            <div className="text-center text-success">
              <Link to="/" className="text-primary text-decoration-none">
                Already have an account?
              </Link>
            </div>
          </Form>

          <div
            className="text-center text-muted mt-3"
            style={{ fontSize: "0.85rem" }}
          >
            By creating account you agree to our{" "}
            <span
              role="button"
              className="text-decoration-none cursor-pointer text-primary"
            >
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span
              role="button"
              className="text-decoration-none cursor-pointer text-primary"
            >
              Privacy Policy
            </span>
            .
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
