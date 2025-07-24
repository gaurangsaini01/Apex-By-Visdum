import { Formik } from "formik"
import { useEffect, useState } from "react"
import { getUsers } from "../services/operations/users"
import { Button, Form } from "react-bootstrap"
import * as Yup from "yup"
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[] | null>(null)
  const initialValues = {
    "name": edit ? selectedUser?.name : "",
    "email": edit ? selectedUser?.email : "",
    "password": edit ? selectedUser?.password : "",
    "login_status": edit ? selectedUser?.login_status : false,
    "email_status": edit ? selectedUser?.email_status : false,
  }
  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Name is required"),
    email: Yup.string().trim().email("Invalid Email Format").required("Email is required"),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must not exceed 128 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .required('Password is required'),
  })
  const handleSubmit = async (values: User) => {
    console.log(values)
    if (!edit) {
      // await addUser(data, navigate)
    }
    // else await editUser(id!, data, navigate)
  }

  useEffect(() => {
    (async () => {
      const res = await getUsers()
      if (res?.success) {
        setUsers(res?.data)
      }
    })()
  }, [])
  return (
    <div>
      <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} >
        {({ handleChange,
          handleSubmit,
          handleBlur,
          values,
          setFieldValue,
          touched,
          errors,
          isSubmitting }) => {
          return <Form className="mt-4" onSubmit={handleSubmit}>
            <Form.Group className="mb-4" id="name">
              <Form.Label className="fw-bold">User Name</Form.Label>
              <Form.Control
                name="name"
                autoComplete="off"
                type="text"
                placeholder="Enter name "
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" id="name">
              <Form.Label className="fw-bold">User Email</Form.Label>
              <Form.Control
                name="email"
                autoComplete="off"
                type="email"
                placeholder="Enter email "
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" id="name">
              <Form.Label className="fw-bold">User Password</Form.Label>
              <Form.Control
                name="password"
                autoComplete="off"
                type="password"
                placeholder="Enter password "
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && !!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Add</Button>
          </Form>
        }}
      </Formik>
      <div>
        {users?.map((user) => {
          return <div className="p-4 border d-flex justify-content-between" key={user?.id}>
            <div>
              <div>{user?.name}</div>
              <div>{user?.email}</div>
            </div>
            <div className="d-flex align-items-center">
              <Button>Edit</Button>
              <Button>Delete</Button>
            </div>
          </div>
        })}
      </div>
    </div>
  )
}

export default UserManager