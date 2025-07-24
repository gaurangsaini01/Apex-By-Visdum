import { Form, Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import { login } from "../../services/operations/auth";
import { Formik } from "formik";
import * as Yup from "yup"
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../services/axiosInstance";
import { useEffect } from "react";
import { showError } from "../../utils/Toast";
import "./Login.css";
import LoginPageImg from "../../images/LoginPageImg.svg"
import visdum_logo from '../../images/visdum_logo.jpg'

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
      showError(error)
      navigate(window.location.pathname, { replace: true })
    }
  }, [error])

  return (
    <div className="login-backdrop">
      <div className="login-card">
        <div className="login-left">
          <div className="login-illustration">
            <img src={LoginPageImg} alt="Login Illustration" className="illustration-image" />
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="mb-5">
              <div className="d-flex align-items-center w-100 gap-1">
                <img width={70} src={visdum_logo} alt="" />
                <h2 className="login-title text-primary fw-semibold">Visdum Watch!</h2>
              </div>
              <p className="login-subtitle subheading">
                Monitor your servers, from a single place.
              </p>
            </div>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, values, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
                return (
                  <Form noValidate onSubmit={handleSubmit} className="w-100">
                    <Form.Group className="form-group" controlId="formEmail">
                      <Form.Control
                        autoComplete="off"
                        isInvalid={!!touched.email && !!errors.email}
                        value={values.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {touched.email && errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="form-group" controlId="formPassword">
                      <Form.Control
                        isInvalid={!!touched.password && !!errors.password}
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {touched.email && errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>


                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-100 btn-primary"
                    >
                      {isSubmitting ? "LOGGING IN..." : "Login"}
                    </Button>

                    <div className="d-flex align-items-center justify-content-center my-3">
                      <hr className="flex-grow-1" />
                      <span className="mx-2 text-muted ">OR</span>
                      <hr className="flex-grow-1" />
                    </div>

                    <Button
                      variant="outline-primary"
                      className="w-100 d-flex align-items-center gap-2"
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
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;