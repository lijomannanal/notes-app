import { Link } from "react-router-dom";
import "./style.css";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import type { RegisterInput } from "../models/auth";
import { Toastvariants } from "../models/common";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/api-client";
import { AxiosError } from "axios";
import { useLayoutContext } from "../../context/LayoutContext";
const passwordReg = new RegExp("^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{6,10}$");

function RegisterForm() {
  const navigate = useNavigate();
  const { setToastInfo } = useLayoutContext();

  const { Formik } = formik;
  const schema = yup.object().shape({
    name: yup.string().min(3).max(30).required(),
    username: yup.string().min(3).max(30).required(),
    password: yup
      .string()
      .required()
      .matches(
        passwordReg,
        "Password must contain least one upper case letter, one special character and should be between 6 to 10 characters"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords don't match."),
  });

  const onSubmit = async (
    values: RegisterInput,
    { setSubmitting, resetForm }: formik.FormikHelpers<RegisterInput>
  ) => {
    try {
      await apiClient.post("/auth/register", values);
      setToastInfo({
        title: "Success",
        message: "Registration has been completed successfully",
        show: true,
        variant: Toastvariants.Success,
      });
      resetForm();
      navigate("/login");
    } catch (error) {
      let message = error;
      if (error instanceof AxiosError) {
        message = error.response?.data?.error;
      }

      setToastInfo({
        title: "Error",
        message: `Registration failed! ${message}`,
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
                  onSubmit={onSubmit}
                  initialValues={{
                    name: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
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
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label className="text-center">Name</Form.Label>
                        <Form.Control
                          name="name"
                          type="text"
                          onChange={handleChange}
                          value={values.name}
                          isInvalid={!!errors.name}
                          placeholder="Enter name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
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
                      <Form.Group className="mb-3" controlId="confirmPasssword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          name="confirmPassword"
                          type="password"
                          onChange={handleChange}
                          value={values.confirmPassword}
                          isInvalid={!!errors.confirmPassword}
                          placeholder="Repeat password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Register
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>

                <div className="mt-3">
                  <p className="mb-0 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold">
                      Login
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

export default RegisterForm;
