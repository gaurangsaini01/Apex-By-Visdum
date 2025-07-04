import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import { login } from "../services/operations/auth";
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
    <div className="login-backdrop ">
      <Container
        className="vh-100 w-100 d-flex justify-content-center align-items-center"
      >
        <div className=" p-5 rounded shadow">
          <h2 className="text-center mb-4 text-white">
            <span className="text-primary text-center">Welcome Back !</span>
          </h2>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, values, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
              return <Form noValidate onSubmit={handleSubmit} style={{ width: "350px" }}>
                <Form.Group className="mb-3 text-dark" controlId="formEmail">
                  <Form.Label>Your e-mail</Form.Label>
                  <Form.Control autoComplete="off" isInvalid={!!touched.email && !!errors.email} value={values.email} onBlur={handleBlur} onChange={handleChange} name="email" type="email" placeholder="E.g. info@example.com" />
                  <Form.Control.Feedback type="invalid">{touched.email && errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 text-dark" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control isInvalid={!!touched.password && !!errors.password} value={values.password} onBlur={handleBlur} onChange={handleChange} name="password" type="password" placeholder="******" />
                  <Form.Control.Feedback type="invalid">{touched.email && errors.password}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button disabled={isSubmitting} variant="primary" size="lg" type="submit">
                    {isSubmitting ? "Logging in.." : "Log in"}
                  </Button>
                </div>
              </Form>
            }}
          </Formik>
        </div>
      </Container >
    </div >
  );
};

export default Login;
