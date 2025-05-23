import "./style.css";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as formik from "formik";
import * as yup from "yup";
import type { LoginInput } from "../models/auth";
import { useAuthContext } from "../../context/AuthContext";
import apiClient from "../../utils/api-client";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useLayoutContext } from "../../context/LayoutContext";
import { Toastvariants } from "../models/common";
import { AxiosError } from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [, setRefreshToken] = useLocalStorage("refreshToken");
  const { setToastInfo } = useLayoutContext();

  const { Formik } = formik;
  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const handleLogin = async (
    values: LoginInput,
    { setSubmitting }: formik.FormikHelpers<LoginInput>
  ) => {
    try {
      const { data } = await apiClient.post("/auth/login", values);
      setRefreshToken(data.refreshToken);
      login(data.token);
      navigate("/home");
    } catch (error) {
      console.log(error);
      let message = error;
      if (error instanceof AxiosError) {
        message = error.response?.data?.error;
      }

      setToastInfo({
        title: "Error",
        message: `Login failed! ${message}`,
        show: true,
        variant: Toastvariants.Danger,
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col md={8} lg={6} xs={12}>
          <div className="border-3 border-primary border"></div>
          <Card className="shadow">
            <Card.Body>
              <div className="mb-3 mt-4">
                <h2 className="fw-bold text-uppercase mb-2">Notes App</h2>
                <Formik
                  validationSchema={schema}
                  onSubmit={handleLogin}
                  initialValues={{
                    username: "",
                    password: "",
                  }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    isSubmitting,
                  }) => (
                    <Form noValidate onSubmit={handleSubmit} className="mb-3">
                      <Form.Group className="mb-3" controlId="username">
                        <Form.Label className="text-center">
                          Username
                        </Form.Label>
                        <Form.Control
                          name="username"
                          type="text"
                          onChange={handleChange}
                          value={values.username}
                          isInvalid={!!errors.username}
                          placeholder="Enter username"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          onChange={handleChange}
                          value={values.password}
                          isInvalid={!!errors.password}
                          placeholder="Enter password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-grid">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Login
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="mt-3">
                  <p className="mb-0 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary fw-bold">
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
