import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { login } from "../services/operations/monitor";
import { Formik } from "formik";
import * as Yup from "yup"
import { useDispatch } from "react-redux";

export interface LoginData {
  email: string,
  password: string
}
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValues: LoginData = {
    email: "",
    password: ""
  }
  const validationSchema = Yup.object({
    email: Yup.string().email("E-mail is invalid").required("E-mail is required"),
    password: Yup.string().min(5, 'Password must be 5 character long').max(20, 'Password cannot be greater than 20 characters').required('Password cannot be empty')
  })


  const handleSubmit = async (values: LoginData) => {
    await login(values, navigate, dispatch)
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

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, values, touched, handleChange, handleBlur, handleSubmit }) => {
              return <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-dark" controlId="formEmail">
                  <Form.Label>Your e-mail</Form.Label>
                  <Form.Control isInvalid={!!touched.email && !!errors.email} value={values.email} onBlur={handleBlur} onChange={handleChange} name="email" type="email" placeholder="E.g. info@example.com" />
                  <Form.Control.Feedback type="invalid">{touched.email && errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 text-dark" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control isInvalid={!!touched.password && !!errors.password} value={values.password} onBlur={handleBlur} onChange={handleChange} name="password" type="password" placeholder="******" />
                  <Form.Control.Feedback type="invalid">{touched.email && errors.password}</Form.Control.Feedback>
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
            }}
          </Formik>

          <div className="text-center text-muted mt-4">
            Don't have an account yet?{" "}
            <Link to={"/signup"} className="text-primary text-decoration-none">
              Create your Free account now
            </Link>
          </div>
        </div>
      </Container >
    </div >
  );
};

export default Login;
