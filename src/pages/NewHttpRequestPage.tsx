import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useState } from "react";
import { authOptions, intervalOptions, timeoutOptions, methods } from "../data";
import Accordion from "react-bootstrap/Accordion";
import { IoIosClose } from "react-icons/io";

interface Settings {
  url: string;
  emailNotify: boolean;
  interval: number;
  timeout: number;
  statusCodes: number[];
  authType: string;
  token: string;
  httpMethod: "HEAD" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  requestBody: string
}

function NewHttpRequestPage() {
  const navigate = useNavigate();
  const [tag, setTag] = useState("");
  const allowedRequestBody = ["POST", "PUT", "PATCH"]

  const [settings, setSettings] = useState<Settings>({
    url: "",
    emailNotify: false,
    interval: 5, //minutes
    timeout: 15, //seconds,
    statusCodes: [],
    authType: "None",
    token: "",
    httpMethod: "HEAD",
    requestBody: ""
  });

  const handleBack = () => {
    navigate("/dashboard/monitors");
  };

  const handleRangeChanges = (
    e: React.ChangeEvent<HTMLInputElement>,
    property: "interval" | "timeout",
    options: Array<{ label: string; value: number }>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [property]: options[Number(e.target.value)].value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, checked, type } = e.target;
    setSettings((prev) => {
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  const handleRemoveTag = (code: number) => {
    setSettings((prev) => {
      return {
        ...prev,
        statusCodes: prev.statusCodes.filter((s) => s != code),
      };
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(settings);
  };

  const handleTagMaker = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      const parsed = Number(tag.trim());
      if (!isNaN(parsed) && parsed >= 100 && parsed <= 599) {
        setSettings((prev) => {
          if (!prev.statusCodes.includes(parsed)) {
            return { ...prev, statusCodes: [...prev.statusCodes, parsed] };
          }
          return prev;
        });
      }
      setTag("");
    }
  };

  return (
    <div className="">
      <header className="sticky-top back-header px-3">
        <button
          onClick={handleBack}
          className="d-flex align-items-center gap-1 btn btn-primary"
        >
          <IoChevronBackOutline />
          Monitoring
        </button>
      </header>

      <div className="p-3">
        <div className="p-4 text-dark bg-white shadow-sm rounded mt-3">
          <h3>
            <strong>Add single monitor</strong>
            <span className="text-primary">.</span>
          </h3>

          <Form className="mt-4">
            <Form.Group className="mb-4 ">
              <Form.Label className="fw-bold">Monitor type</Form.Label>
              <div className="p-3 bg-white rounded shadow-sm">
                <div>
                  <div className="text-primary fw-bold">
                    HTTP / website monitoring
                  </div>
                  <div className="text-muted small">
                    Use HTTP(S) monitor to monitor your website, API endpoint, or
                    anything running on HTTP.
                  </div>
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">URL to monitor</Form.Label>
              <Form.Control
                name="url"
                type="text"
                placeholder="https://"
                value={settings.url}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">How will we notify you?</Form.Label>
              <Row>
                <Col md={3}>
                  <Form.Check
                    name="emailNotify"
                    type="checkbox"
                    label="E-mail"
                    id="E-mail"
                    checked={settings.emailNotify}
                    onChange={handleChange}
                    className="text-dark"
                  />
                  <div className="small text-muted">your@email.com</div>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </div>

        <div className="p-4 text-dark bg-white shadow-sm rounded mt-3">
          <Form.Label className="fw-bold">Monitor interval</Form.Label>
          <p className="text-muted mb-2">
            Your monitor will be checked every{" "}
            <span className="fw-bold text-dark">
              {settings.interval > 59
                ? settings.interval / 60
                : settings.interval}{" "}
              {settings.interval > 59 ? "hour" : "minutes"}
            </span>
            . We recommend to use at least 1-minute checks .
          </p>

          {/* Slider */}
          <input
            type="range"
            className="w-100"
            min={0}
            max={intervalOptions.length - 1}
            value={intervalOptions.findIndex(
              (opt) => opt.value === settings.interval
            )}
            onChange={(e) => handleRangeChanges(e, "interval", intervalOptions)}
          />

          {/* Ticks */}
          <Row className="justify-content-between px-1 text-muted mt-2">
            {intervalOptions.map((opt) => (
              <small key={opt.value} style={{ width: "fit-content" }}>
                {opt.label}
              </small>
            ))}
          </Row>
        </div>
        <Accordion defaultActiveKey="null" className="mt-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Advanced Settings</Accordion.Header>
            <Accordion.Body>
              <div className=" text-dark mt-3">
                <Form.Label className="fw-bold">Request Timeout</Form.Label>
                <p className="text-muted mb-2">
                  The request timeout is{" "}
                  <span className="fw-bold text-dark">
                    {settings.timeout} seconds
                  </span>
                  . The shorter the timeout the earlier we mark website as down.
                </p>

                {/* Slider */}
                <input
                  type="range"
                  className="w-100"
                  min={0}
                  max={timeoutOptions.length - 1}
                  value={timeoutOptions.findIndex(
                    (opt) => opt.value === settings.timeout
                  )}
                  onChange={(e) =>
                    handleRangeChanges(e, "timeout", timeoutOptions)
                  }
                />

                {/* Ticks */}
                <Row className="justify-content-between px-1 text-muted mt-2">
                  {timeoutOptions.map((opt) => (
                    <small key={opt.value} style={{ width: "fit-content" }}>
                      {opt.label}
                    </small>
                  ))}
                </Row>
              </div>
              <hr />
              <div className="text-dark mt-3">
                <Form.Label className="fw-bold">Up HTTP Status Codes</Form.Label>
                <p className="text-muted mb-2">
                  We will create incident when we receive HTTP status code other
                  than defined below.
                </p>
                <Form.Control
                  type="number"
                  onKeyDown={handleTagMaker}
                  value={tag}
                  min={100}
                  max={599}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTag(e.target.value)
                  }
                ></Form.Control>
                <div className="mt-4 d-flex gap-1 overflow-x-auto">
                  {settings.statusCodes?.map((code) => {
                    return (
                      <Badge key={code} className="d-flex align-items-center">
                        {code}
                        <IoIosClose
                          style={{ cursor: "pointer" }}
                          size={20}
                          onClick={() => handleRemoveTag(code)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
              <hr />
              <div className="text-dark mt-3">
                <div className="d-flex justify-content-between">
                  <Form.Group className="col-3">
                    <Form.Label className="fw-bold">Auth. type</Form.Label>
                    <Form.Select name="authType" onChange={handleChange}>
                      {authOptions.map((opt) => {
                        return <option key={opt}>{opt}</option>;
                      })}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="col-8">
                    <Form.Label className="fw-bold">Token</Form.Label>
                    <Form.Control
                      disabled={settings.authType === "None"}
                      value={settings.token}
                      name="token"
                      onChange={handleChange}
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                </div>
              </div>
              <hr />
              <Form.Group>
                <Form.Label className=" fw-bold mt-3">HTTP method</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {methods.map((method) => (
                    <Form.Check
                      key={method}
                      type="radio"
                      id={`method-${method}`}
                      name="httpMethod"
                      label={method}
                      value={method}
                      checked={settings.httpMethod === method}
                      onChange={handleChange}
                      className="me-3"
                      inline
                    />
                  ))}
                </div>
                <Form.Text className="text-muted mt-2 d-block">
                  We suggest using HEAD as it is lighter unless there is a reason
                  to use any specific method.
                </Form.Text>
              </Form.Group>
              <hr />
              {allowedRequestBody.includes(settings.httpMethod) && <div className="d-flex flex-column justify-content-between">
                <Form.Label className="fw-bold">Request Body</Form.Label>
                <Form.Control name="requestBody" value={settings.requestBody} onChange={handleChange} placeholder='{"key":"value"}' as="textarea" rows={3} type="text"></Form.Control>
                <hr />
              </div>}
              <div>

              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Button className="mt-4" type="submit" onClick={handleSubmit}>
          Create Monitor
        </Button>
      </div>
    </div>
  );
}

export default NewHttpRequestPage;
