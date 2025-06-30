import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      navigate("/dashboard");
    } catch (error) {}
  };
  return (
    <div>
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <div className=" p-5 rounded shadow">
          <h2 className="text-center mb-4 text-white">
            <span className="text-primary">Welcome</span> back!
          </h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-dark" controlId="formEmail">
              <Form.Label>Your e-mail</Form.Label>
              <Form.Control type="email" placeholder="E.g. info@example.com" />
            </Form.Group>

            <Form.Group className="mb-3 text-dark" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="******" />
            </Form.Group>

            <div className="d-grid mb-3">
              <Button variant="primary" size="lg" type="submit">
                Log in
              </Button>
            </div>

            <div className="text-center">
              <a href="#" className="text-primary text-decoration-none">
                Forgot your password?
              </a>
            </div>
          </Form>

          <div className="text-center text-muted mt-4">
            Don't have an account yet?{" "}
            <Link to={"/signup"} className="text-primary text-decoration-none">
              Create your Free account now
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
