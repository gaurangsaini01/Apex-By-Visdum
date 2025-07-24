import { Formik } from "formik"
import { useEffect, useState } from "react"
import { addUsers, deleteUser, editUser, getUsers } from "../services/operations/users"
import { Button, Form, Modal, Badge, Card } from "react-bootstrap"
import * as Yup from "yup"
import ConfirmationModal from "../components/Reusable/ConfirmationModal"
import { showSuccess } from "../utils/Toast"
import Loader from "../components/Loader/Loader"
import { IoAddOutline } from "react-icons/io5"

interface User {
  "id": number
  "name": string
  "email": string,
  "password": string,
  "login_status": boolean,
  "email_status": boolean
}

function UserManager() {
  const [edit, setEdit] = useState(false)
  const [loading,setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[] | null>(null)
  const [userToBeDeleted, setUserToBeDeleted] = useState<User | null>(null)

  const initialValues = {
    "name": edit ? selectedUser?.name || "" : "",
    "email": edit ? selectedUser?.email || "" : "",
    "password": "",
    "login_status": edit ? selectedUser?.login_status || false : false,
    "email_status": edit ? selectedUser?.email_status || false : false,
  }

  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string().trim().email("Invalid Email Format").required("Email is required"),
    password: edit
      ? Yup.string()
        .test('password-check', function (value) {
          if (!value || value.length === 0) {
            return true; // Allow empty password in edit mode
          }
          // If password is provided, validate it
          const errors = [];
          if (value.length < 5) errors.push('Password must be at least 5 characters long');
          if (value.length > 128) errors.push('Password must not exceed 128 characters');
          if (!/[a-z]/.test(value)) errors.push('Password must contain at least one lowercase letter');
          if (!/[A-Z]/.test(value)) errors.push('Password must contain at least one uppercase letter');
          if (!/[0-9]/.test(value)) errors.push('Password must contain at least one number');
          if (!/[^a-zA-Z0-9]/.test(value)) errors.push('Password must contain at least one special character');
          if (/\s/.test(value)) errors.push('Password must not contain spaces');

          if (errors.length > 0) {
            return this.createError({ message: errors[0] });
          }
          return true;
        })
      : Yup.string()
        .min(5, 'Password must be at least 5 characters long')
        .max(128, 'Password must not exceed 128 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
        .matches(/^\S*$/, 'Password must not contain spaces')
        .required('Password is required'),
  })

  const handleSubmit = async (values: User) => {
    if (!edit) {
      const res = await addUsers(values);
      if (res?.success) {
        setUsers((prev) => {
          return [...(prev || []), res?.data]
        })
        setShowModal(false)
      }
    }
    else {
      console.log(values)
      const res = await editUser(values, selectedUser?.id);
      console.log(res)
      if (res?.success) {
        showSuccess('Updated user')
        setUsers((prev) => {
          return prev?.map(user =>
            user.id === selectedUser?.id ? { ...user, ...values } : user
          ) || []
        })
      }
      setShowModal(false)
    }
  }

  const handleDelete = async (id: number) => {
    const res = await deleteUser(id)
    if (res?.success) {
      setUsers((prev) => {
        return prev?.filter((user) => user.id !== id) || []
      })
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEdit(true)
    setShowModal(true)
  }

  const handleAddNew = () => {
    setSelectedUser(null)
    setEdit(false)
    setShowModal(true)
  }

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await getUsers()
      if (res?.success) {
        setUsers(res?.data)
      }
      setLoading(false)
    })()
  }, [])

  return (
    <div className="container min-vh-100">
      <div className="container py-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <h2 className="text-dark mb-0 me-2">Users</h2>
            <Badge bg="primary" className="fs-6">{users?.length || 0}</Badge>
          </div>
          <Button
            variant="primary"
            className="d-flex align-items-center px-4"
            onClick={handleAddNew}
          >
            <IoAddOutline size={20} />
            Add User
          </Button>
        </div>

        {/* Users Grid */}
       {loading ? <Loader/> :  <div className="row g-4">
          {users?.map((user) => (
            <div className="col-12 col-md-6 col-lg-4" key={user?.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px' }}>
                        <span className="text-white fw-bold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h5 className="mb-1 text-dark">{user?.name}</h5>
                        <p className="text-muted mb-0 small">{user?.email}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted">Login Status:</span>
                        <Badge bg={user?.login_status ? "success" : "secondary"}>
                          {user?.login_status ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">Email Status:</span>
                        <Badge bg={user?.email_status ? "success" : "warning"}>
                          {user?.email_status ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-fill"
                      onClick={() => handleEdit(user)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="flex-fill"
                      onClick={() => setUserToBeDeleted(user)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>}

        {users?.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted">
              <i className="bi bi-people display-1"></i>
              <h4 className="mt-3">No users found</h4>
              <p>Get started by adding your first user</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      <Modal show={showModal} centered onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`bi ${edit ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
            {edit ? 'Edit User' : 'Add New User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
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
              return (
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Name Field */}
                    <div className="col-md-6">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold text-dark">
                          <i className="bi bi-person me-2 text-primary"></i>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          name="name"
                          autoComplete="off"
                          type="text"
                          placeholder="Enter full name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.name && !!errors.name}
                          className="form-control"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>

                    {/* Email Field */}
                    <div className="col-md-6">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold text-dark">
                          <i className="bi bi-envelope me-2 text-primary"></i>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          name="email"
                          autoComplete="off"
                          type="email"
                          placeholder="Enter email address"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && !!errors.email}
                          className="form-control"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>

                  {/* Password Field */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">
                      <i className="bi bi-lock me-2 text-primary"></i>
                      Password
                      {edit && <small className="text-muted ms-2">(Leave empty to keep current password)</small>}
                    </Form.Label>
                    <Form.Control
                      name="password"
                      autoComplete="off"
                      type="password"
                      placeholder={edit ? "Enter new password (optional)" : "Enter password"}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                      className="form-control"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                    {edit && (
                      <Form.Text className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Only fill this field if you want to change the password
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Status Toggles */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Form.Label className="fw-bold text-dark mb-1">
                              <i className="bi bi-power me-2 text-success"></i>
                              Login Status
                            </Form.Label>
                            <div className="small text-muted">
                              Allow user to login to the system
                            </div>
                          </div>
                          <Form.Check
                            type="switch"
                            id="login-status-switch"
                            checked={values.login_status}
                            onChange={(e) => setFieldValue('login_status', e.target.checked)}
                            className="ms-3"
                            style={{ transform: 'scale(1.2)' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="bg-light p-3 rounded mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Form.Label className="fw-bold text-dark mb-1">
                              <i className="bi bi-envelope-check me-2 text-info"></i>
                              Email Status
                            </Form.Label>
                            <div className="small text-muted">
                              Allow email to be sent to the user
                            </div>
                          </div>
                          <Form.Check
                            type="switch"
                            id="email-status-switch"
                            checked={values.email_status}
                            onChange={(e) => setFieldValue('email_status', e.target.checked)}
                            className="ms-3"
                            style={{ transform: 'scale(1.2)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowModal(false)}
                      className="px-4"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="primary"
                      className="px-4"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className={`bi ${edit ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                          {edit ? 'Update User' : 'Create User'}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={!!userToBeDeleted}
        title={'Confirm Delete'}
        desc={
          <>
            Are you sure you want to delete <strong>{userToBeDeleted?.name}</strong>? This action cannot be undone.
          </>
        }
        closeText="Cancel"
        submitText="Delete"
        onClose={() => setUserToBeDeleted(null)}
        onSubmit={() => {
          if (userToBeDeleted?.id) {
            handleDelete(userToBeDeleted.id)
          }
          setUserToBeDeleted(null)
        }}
      />
    </div>
  )
}

export default UserManager