import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import { login } from "../services/operations/auth";
import { Formik } from "formik";
import * as Yup from "yup"
import { useDispatch } from "react-redux";
import { BASE_URL } from "../services/axiosInstance";
import { useEffect } from "react";
import { showError } from "../utils/Toast";

export interface LoginData {
  email: string,
  password: string
}
const Login = () => {
  const [searchParams] = useSearchParams();

  const error = searchParams.get('error')
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValues: LoginData = {
    email: "",
    password: ""
  }
  const validationSchema = Yup.object({
    email: Yup.string().email("E-mail is invalid").required("E-mail is required"),
    password: Yup.string().min(5, 'Password must be 5 characters long').max(20, 'Password cannot be greater than 20 characters').required('Password cannot be empty')
  })


  const handleSubmit = async (values: LoginData) => {
    await login(values, navigate, dispatch)
  };

  const handleGoogleLogin = () => {
    const URL = BASE_URL + '/auth/google/redirect'
    location.href = URL
  };
  useEffect(() => {
    if (error) {
      showError('Only Visdum emails are allowed')
      navigate(window.location.pathname, { replace: true })
    }
  }, [error])

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
                  <Form.Control
                    autoComplete="off"
                    isInvalid={!!touched.email && !!errors.email}
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="email"
                    type="email"
                    placeholder="E.g. info@example.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {touched.email && errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 text-dark" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    isInvalid={!!touched.password && !!errors.password}
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name="password"
                    type="password"
                    placeholder="******"
                  />
                  <Form.Control.Feedback type="invalid">
                    {touched.email && errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button disabled={isSubmitting} variant="primary" size="lg" type="submit">
                    {isSubmitting ? "Logging in.." : "Log in"}
                  </Button>
                </div>

                <div className="d-flex align-items-center justify-content-center my-3">
                  <hr className="flex-grow-1" />
                  <span className="mx-2 text-muted ">OR</span>
                  <hr className="flex-grow-1" />
                </div>

                {/* Google Login Button */}
                <div className="text-center mt-3">
                  <Button
                    variant="outline-success"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleGoogleLogin}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    <span>Continue with Google</span>
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
