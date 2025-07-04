import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { addMember, createGroup, deleteGroup, deleteMember, editGroup, getGroups } from "../services/operations/groups";
import { AgGridReact } from 'ag-grid-react';
import { formatDate } from "../utils/date";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Group {
  id: number;
  name: string;
  group_members: User[];
  created_at:string
}

const groupSchema = Yup.object({
  name: Yup.string().required("Group name is required"),
});

const userSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

function GroupUserCrudPage() {
  const { token } = useSelector((state: any) => state.auth)
  const [groups, setGroups] = useState<Group[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{ groupId: number; user: User | null } | null>(null);

  //ag grid 
  const [rowData, setRowData] = useState([
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'group_name', headerName: "Group Name", editable: true },
    { field: 'member_count', headerName: "Group Members" },
    { field: 'created_at', headerName: "Created At"},
  ]);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    const res = await getGroups(token);
    if (res?.success) setGroups(res?.data);
  }

  async function handleGroupSubmit(values: { name: string }) {
    if (editingGroup) {
      const res = await editGroup(token, editingGroup?.id, values)
      setGroups(groups.map((g) => (g.id === res.data.id ? res.data : g)));
    } else {
      const res = await createGroup(token, values);
      if (res?.success) {
        setGroups([...groups, res?.data]);
      }
    }
    setShowGroupModal(false);
    setEditingGroup(null);
  }

  async function handleUserSubmit(values: { name: string; email: string }) {
    if (!editingUser) return;
    const groupId = editingUser.groupId;
    if (editingUser.user) {
      const res = await axios.put(`/api/groups/${groupId}/users/${editingUser.user.id}`, values);
      setGroups(
        groups.map((g) =>
          g.id === groupId ? { ...g, users: g.group_members.map((u) => (u.id === res.data.id ? res.data : u)) } : g
        )
      );
    } else {
      const res = await addMember(token, groupId, values)
      // const res = await axios.post(`/api/groups/${groupId}/users`, values);
      setGroups(
        groups.map((g) => (g.id === groupId ? { ...g, group_members: [...g.group_members, res.data] } : g))
      );
    }
    setShowUserModal(false);
    setEditingUser(null);
  }

  async function delGroup(id: number) {
    await deleteGroup(token, id);
    setGroups(groups.filter((g) => g.id !== id));
  }

  async function deleteUser(groupId: number, memberId: number) {
    await deleteMember(token, groupId, memberId)
    setGroups(
      groups.map((g) =>
        g.id === groupId ? { ...g, group_members: g.group_members.filter((u) => u.id !== memberId) } : g
      )
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Groups</h3>
        <Button onClick={() => setShowGroupModal(true)}>Add Group</Button>
      </div>

      {groups?.map((group) => {
        console.log(group)
        // return <Card className="mb-4 shadow-sm" key={group?.id}>
        //   <Card.Body>
        //     <div className="d-flex justify-content-between align-items-center">
        //       <h5>{group?.name}</h5>
        //       <div>
        //         <Button
        //           variant="outline-primary"
        //           size="sm"
        //           className="me-2"
        //           onClick={() => {
        //             setEditingGroup(group);
        //             setShowGroupModal(true);
        //           }}
        //         >
        //           Edit
        //         </Button>
        //         <Button variant="outline-danger" size="sm" onClick={() => delGroup(group.id)}>
        //           Delete
        //         </Button>
        //       </div>
        //     </div>

        //     <hr />

        //     <div className="d-flex justify-content-between align-items-center">
        //       <h6>Members</h6>
        //       <Button
        //         size="sm"
        //         onClick={() => {
        //           setEditingUser({ groupId: group?.id, user: null });
        //           setShowUserModal(true);
        //         }}
        //       >
        //         Add Members
        //       </Button>
        //     </div>
        //     <Table striped bordered hover className="mt-3">
        //       <thead>
        //         <tr>
        //           <th>Name</th>
        //           <th>Email</th>
        //           <th>Actions</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //         {group?.group_members?.map((user) => (
        //           <tr key={user.id}>
        //             <td>{user.name}</td>
        //             <td>{user.email}</td>
        //             <td>
        //               <Button
        //                 variant="outline-primary"
        //                 size="sm"
        //                 className="me-2"
        //                 onClick={() => {
        //                   setEditingUser({ groupId: group.id, user });
        //                   setShowUserModal(true);
        //                 }}
        //               >
        //                 Edit
        //               </Button>
        //               <Button
        //                 variant="outline-danger"
        //                 size="sm"
        //                 onClick={() => deleteUser(group.id, user.id)}
        //               >
        //                 Delete
        //               </Button>
        //             </td>
        //           </tr>
        //         ))}
        //       </tbody>
        //     </Table>

        //   </Card.Body>
        // </Card>
        return <div style={{ width: "full", height: "250px" }}>
          <AgGridReact columnDefs={colDefs} rowData={[{ group_name: group?.name, member_count: group?.group_members?.length,created_at:formatDate(group?.created_at) }]} />
        </div>
      })}

      {/* Group Modal */}
      <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingGroup ? "Edit Group" : "Add Group"}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: editingGroup?.name || "" }}
          validationSchema={groupSchema}
          onSubmit={handleGroupSubmit}
          enableReinitialize
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form onSubmit={handleSubmit} className="p-3">
              <Form.Group className="mb-3">
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={!!touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowGroupModal(false)} className="me-2">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser?.user ? "Edit Member" : "Add Member"}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: editingUser?.user?.name || "",
            email: editingUser?.user?.email || "",
          }}
          validationSchema={userSchema}
          onSubmit={handleUserSubmit}
          enableReinitialize
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form onSubmit={handleSubmit} className="p-3">
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  isInvalid={!!touched.name && !!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowUserModal(false)} className="me-2">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default GroupUserCrudPage;