import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import { Form, Row, Col, Button, Badge, Accordion } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { authOptions, intervalOptions, timeoutOptions, methods } from "../data";
import { IoIosClose } from "react-icons/io";
import { addMonitor, editMonitor, getMonitorDetails } from "../services/operations/monitor";
import Loader from "../components/Loader/Loader";
import { getGroups } from "../services/operations/groups";
import type { Group } from "./EmailGroup/EmailGroup";

interface Settings {
    name: string;
    url: string;
    emailNotify: boolean;
    group_ids: string[];
    interval: number;
    timeout: number;
    statusCodes: number[];
    authType: string;
    token: string;
    httpMethod: "HEAD" | "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
    requestBody: string;
}

const allowedRequestBody = ["POST", "PUT", "PATCH"];

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(4, 'Must be atleast 4 characters').max(15, 'Name cannot exceed 15 char.'),
    url: Yup.string().url("Invalid URL").required("URL is required"),
    token: Yup.string(),
    requestBody: Yup.string(),
});

function HttpRequestTemplate({ type }: { type: "new" | "edit" }) {
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState<Group[] | []>([])
    const { id } = useParams();
    const navigate = useNavigate();
    const [tag, setTag] = useState("");
    const [monitor, setMonitor] = useState<any>([])
    const ids = monitor?.monitor?.group_ids?.map((g: Group) => g.id.toString()) ?? []
    const initialValues: Settings = {
        name: type === "new" ? "" : monitor?.monitor?.name || "",
        url: type === "new" ? "" : monitor?.monitor?.url || "",
        emailNotify: type === "new" ? false : !!monitor?.monitor?.email_notify,
        group_ids: type === "new" ? [] : ids,
        interval: type === "new" ? 5 : monitor?.monitor?.check_interval ?? 5,
        timeout: type === "new" ? 15 : monitor?.monitor?.timeout ?? 15,
        statusCodes: type === "new" ? [] : monitor?.monitor?.http_incidents_code ?? [],
        authType: type === "new" ? "None" : monitor?.monitor?.auth_type ?? "None",
        token: type === "new" ? "" : monitor?.monitor?.auth_token ?? "",
        httpMethod: type === "new" ? "HEAD" : monitor?.monitor?.http_method ?? "HEAD",
        requestBody: type === "new" ? "" : monitor?.monitor?.request_body ?? "",
    };

    const handleBack = () => {
        navigate("/dashboard/monitors");
    };

    const handleSubmit = async (values: Settings) => {
        const data = {
            name: values.name,
            url: values.url,
            email_notify: !!values.emailNotify,
            group_ids: values.group_ids,
            check_interval: values.interval,
            timeout: values.timeout,
            http_incidents_code: values.statusCodes,
            auth_type: values.authType,
            auth_token: values.token,
            http_method: values.httpMethod,
            request_body: values.requestBody,
        }
        if (type == "new") {
            await addMonitor(data, navigate)
        }
        else await editMonitor(id!, data, navigate)
    }

    useEffect(() => {
        if (type != "new") {
            (async function () {
                setLoading(true)
                const res = await getMonitorDetails(Number(id))
                setMonitor(res)
                setLoading(false)
            })()
        }
    }, [])
    useEffect(() => {
        (async () => {
            const res = await getGroups();

            if (res?.success) {
                setGroups(res?.data || [])
            }
        })()
    }, [])
    return (
        <div>
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
                <div className="p-4 text-dark bg-white shadow-sm rounded ">
                    <h3>
                        <strong>{type == "new" ? "Add single monitor" : "Edit Monitor"}</strong>
                        <span className="text-primary">.</span>
                    </h3>

                    {loading ? <Loader /> : <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        {({
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            values,
                            setFieldValue,
                            touched,
                            errors,
                            isSubmitting
                        }) => {
                            useEffect(() => {
                                if (isSubmitting && errors.url) {
                                    const errField = document.getElementById("url");
                                    errField?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                            }, [isSubmitting, errors]);

                            return < Form className="mt-4" noValidate onSubmit={handleSubmit} >
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

                                <Form.Group className="mb-4" id="name">
                                    <Form.Label className="fw-bold">Monitor Name</Form.Label>
                                    <Form.Control
                                        name="name"
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Enter monitor name "
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.name && !!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4" id="url">
                                    <Form.Label className="fw-bold">URL to monitor</Form.Label>
                                    <Form.Control
                                        name="url"
                                        type="text"
                                        placeholder="https://"
                                        value={values.url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.url && !!errors.url}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.url}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">How will we notify you?</Form.Label>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Check
                                                name="emailNotify"
                                                type="checkbox"
                                                label="E-mail"
                                                checked={values.emailNotify}
                                                onChange={handleChange}
                                                className="text-dark"
                                            />
                                            <div className="small text-muted">Send email to selected groups</div>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {values.emailNotify && (
                                    <Form.Group className="mb-4" controlId="group_ids">
                                        <Form.Label className="fw-bold">Select Groups</Form.Label>
                                        <div className="text-muted mb-2 small">
                                            Click to select or unselect groups for email notifications.
                                        </div>

                                        <div className="d-flex flex-wrap gap-2">
                                            {groups?.map((group) => {
                                                const isSelected = values?.group_ids?.includes(group.id.toString());
                                                return (
                                                    <Button
                                                        key={group?.id}
                                                        variant={isSelected ? "success" : "outline-secondary"}
                                                        className="px-3 py-1 rounded-pill"
                                                        style={{ fontSize: "0.85rem" }}
                                                        onClick={() => {
                                                            const selected = values.group_ids?.includes(group.id.toString());
                                                            const updated = selected
                                                                ? values.group_ids?.filter((id) => id !== group?.id?.toString())
                                                                : [...values.group_ids, group?.id?.toString()];
                                                            setFieldValue("group_ids", updated);
                                                        }}
                                                    >
                                                        {group?.name}
                                                    </Button>
                                                );
                                            })}
                                        </div>

                                        {touched?.group_ids && errors?.group_ids && (
                                            <div className="text-danger mt-2 small">{errors?.group_ids as string}</div>
                                        )}
                                    </Form.Group>
                                )}

                                {/* Interval Slider */}
                                <div className="mt-5">
                                    <Form.Label className="fw-bold">Monitor interval</Form.Label>
                                    <p className="text-muted mb-2">
                                        Your monitor will be checked every{" "}
                                        <span className="fw-bold text-dark">
                                            {values.interval > 59
                                                ? values.interval / 60
                                                : values.interval}{" "}
                                            {values.interval > 59 ? "hour" : "minutes"}
                                        </span>
                                        . We recommend at least 1-minute checks.
                                    </p>
                                    <input
                                        type="range"
                                        className="w-100"
                                        min={0}
                                        max={intervalOptions.length - 1}
                                        value={intervalOptions.findIndex(
                                            (opt) => opt.value === values.interval
                                        )}
                                        onChange={(e) =>
                                            setFieldValue(
                                                "interval",
                                                intervalOptions[Number(e.target.value)].value
                                            )
                                        }
                                    />
                                    <Row className="justify-content-between d-flex px-1 text-muted mt-2">
                                        {intervalOptions?.map((opt) => (
                                            <small style={{ width: "fit-content" }} key={opt?.value}>{opt?.label}</small>
                                        ))}
                                    </Row>
                                </div>

                                <Accordion defaultActiveKey="null" className="mt-4">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Advanced Settings</Accordion.Header>
                                        <Accordion.Body>
                                            {/* Timeout Slider */}
                                            <Form.Label className="fw-bold">Request Timeout</Form.Label>
                                            <p className="text-muted mb-2">
                                                The request timeout is{" "}
                                                <span className="fw-bold text-dark">
                                                    {values.timeout} seconds
                                                </span>
                                                .
                                            </p>
                                            <input
                                                type="range"
                                                className="w-100"
                                                min={0}
                                                max={timeoutOptions.length - 1}
                                                value={timeoutOptions.findIndex(
                                                    (opt) => opt.value === values.timeout
                                                )}
                                                onChange={(e) =>
                                                    setFieldValue(
                                                        "timeout",
                                                        timeoutOptions[Number(e.target.value)].value
                                                    )
                                                }
                                            />
                                            <Row className="justify-content-between px-1 text-muted mt-2">
                                                {timeoutOptions?.map((opt) => (
                                                    <small style={{ width: "fit-content" }} key={opt.value}>{opt.label}</small>
                                                ))}
                                            </Row>
                                            <hr />

                                            {/* Status Code Input + Tags */}
                                            <Form.Label className="fw-bold">Up HTTP Status Codes</Form.Label>
                                            <p className="text-muted mb-2">
                                                We will create incident when we receive HTTP status code other
                                                than defined below.
                                            </p>
                                            <Form.Control
                                                type="number"
                                                value={tag}
                                                min={100}
                                                max={599}
                                                onKeyDown={(e) => {
                                                    if (e.key === " ") {
                                                        const parsed = Number(tag.trim());
                                                        if (
                                                            !isNaN(parsed) &&
                                                            parsed >= 100 &&
                                                            parsed <= 599 &&
                                                            !values.statusCodes.includes(parsed)
                                                        ) {
                                                            setFieldValue("statusCodes", [
                                                                ...values.statusCodes,
                                                                parsed,
                                                            ]);
                                                        }
                                                        setTag("");
                                                    }
                                                }}
                                                onChange={(e) => setTag(e.target.value)}
                                            />
                                            <div className="mt-4 d-flex gap-1 overflow-x-auto">
                                                {values.statusCodes?.map((code) => (
                                                    <Badge key={code} className="d-flex align-items-center">
                                                        {code}
                                                        <IoIosClose
                                                            style={{ cursor: "pointer" }}
                                                            size={20}
                                                            onClick={() =>
                                                                setFieldValue(
                                                                    "statusCodes",
                                                                    values.statusCodes.filter((c) => c !== code)
                                                                )
                                                            }
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                            <hr />

                                            {/* Auth + Token */}
                                            <div className="d-flex justify-content-between">
                                                <Form.Group className="col-3">
                                                    <Form.Label className="fw-bold">Auth. type</Form.Label>
                                                    <Form.Select
                                                        name="authType"
                                                        value={values.authType}
                                                        onChange={handleChange}
                                                    >
                                                        {authOptions?.map((opt) => (
                                                            <option key={opt}>{opt}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group className="col-8">
                                                    <Form.Label className="fw-bold">Token</Form.Label>
                                                    <Form.Control
                                                        name="token"
                                                        type="text"
                                                        value={values.token}
                                                        onChange={handleChange}
                                                        disabled={values.authType === "None"}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <hr />

                                            {/* HTTP Method */}
                                            <Form.Group>
                                                <Form.Label className="fw-bold my-3">HTTP method</Form.Label>
                                                <div className="">
                                                    {methods?.map((method) => (
                                                        <Form.Check
                                                            key={method}
                                                            type="radio"
                                                            name="httpMethod"
                                                            id={`method-${method}`}
                                                            label={method}
                                                            value={method}
                                                            checked={values.httpMethod === method}
                                                            onChange={handleChange}
                                                            inline
                                                        />
                                                    ))}
                                                </div>
                                                <Form.Text className="text-muted mt-2 d-block">
                                                    We suggest using HEAD as it is lighter unless necessary.
                                                </Form.Text>
                                            </Form.Group>


                                            {/* Request Body */}
                                            {allowedRequestBody.includes(values?.httpMethod) && (
                                                <>
                                                    <hr />
                                                    <Form.Label className="fw-bold">Request Body</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="requestBody"
                                                        rows={3}
                                                        value={values.requestBody}
                                                        onChange={handleChange}
                                                        placeholder='{"key":"value"}'
                                                    />
                                                </>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>

                                {/* Submit Button */}
                                <Button className="mt-4" disabled={isSubmitting} type="submit">
                                    {type == "new" ? "Create Monitor" : "Save Changes"}
                                </Button>
                            </Form>
                        }}
                    </Formik>}
                </div>
            </div>
        </div >
    );
}

export default HttpRequestTemplate;
