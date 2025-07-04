import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { addMember, createGroup, deleteGroup, deleteMember, editGroup, editMember, getGroups } from "../services/operations/groups";
import { AgGridReact } from 'ag-grid-react';
import { formatDate } from "../utils/date";
import { themeAlpine } from 'ag-grid-community';
import { MdOutlineDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
interface User {
    id: number;
    name: string;
    email: string;
    group_id:number
}

interface Group {
    id: number;
    name: string;
    group_members: User[];
    created_at: string
}

const ActionsRendered = (props: any) => {
    const { data, onDelete, onView } = props;
    const handleClick = () => {
        if (window.confirm('Are you sure you want to delete this group?')) {
            onDelete(data.id);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center mt-1">
            <div onClick={() => onView(data)} className="text-primary" style={{ cursor: "pointer" }}>View Members</div>
            <MdOutlineDelete onClick={handleClick} style={{ cursor: "pointer" }} color="red" size={20} />
        </div>
    );
}

const groupSchema = Yup.object({
    name: Yup.string().required("Group name is required"),
});

const userSchema = Yup.object({
    name: Yup.string().required("Name is required").min(3, 'Name must be 3 char'),
    email: Yup.string().email("Invalid email").required("Email is required"),
});

function EmailGroup() {
    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const { token } = useSelector((state: any) => state.auth)
    const [groups, setGroups] = useState<Group[]>([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [editingUser, setEditingUser] = useState<{user:User,groupId:number} | null>(null);
    console.log(viewingGroup)

    async function delGroup(id: number) {
        await deleteGroup(token, id);
        setGroups(prev => prev.filter((g) => g.id !== id));
    }

    const [colDefs] = useState([
        { field: 'name', headerName: "Group Name", editable: true },
        { field: 'group_members', headerName: "Group Members", valueGetter: (p: any) => p.data.group_members?.length || 0 },
        { field: 'created_at', headerName: "Created At", valueGetter: (p: any) => formatDate(p.data.created_at) },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRendered,
            cellRendererParams: {
                onDelete: (id: number) => delGroup(id),
                onView: (group: Group) => setViewingGroup(group)
            },
            width: 120
        },
    ]);
    const autoSizeStrategy = useMemo(() => {
        return {
            type: 'fitCellContents',
            defaultMinWidth: 310,
        };
    }, []);

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
                setGroups(prev => [res?.data, ...prev]);
            }
        }
        setShowGroupModal(false);
        setEditingGroup(null);
    }

    async function handleUserSubmit(values: { name: string; email: string }) {
        const groupId = viewingGroup?.id
        if (editingUser?.user) {
            const res = await editMember(groupId, editingUser.user.id, values, token);
            console.log(res)
            setGroups(
                groups.map((g) =>
                    g.id === groupId ? { ...g, users: g.group_members.map((u) => (u.id === res.data.id ? res.data : u)) } : g
                )
            );
            setViewingGroup((prev: Group | null) => {
                if (!prev) return prev;
                return { ...prev, group_members: prev.group_members.map((member) => member.id == editingUser.user.id ? res.data : member) }
            })
        } else {
            const res = await addMember(token, groupId!, values)
            setGroups(
                groups.map((g) => (g.id === groupId ? { ...g, group_members: [...g.group_members, res.data] } : g))
            );
            setViewingGroup((prev: Group | null) => {
                if (!prev) return null;
                return { ...prev, group_members: [...prev.group_members, res.data] };
            })
        }
        setEditingUser(null);
    }



    async function deleteUser(groupId: number, memberId: number) {
        const res = await deleteMember(token, groupId, memberId)
        if (res && res?.success) {
            setGroups(prev =>
                prev.map((g) =>
                    g.id === groupId ? { ...g, group_members: g.group_members.filter((u) => u.id !== memberId) } : g
                )
            );
            setViewingGroup((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    group_members: prev.group_members.filter((u) => u.id !== memberId),
                };
            });
        }

    }
    async function handleCellEdit(event: any) {
        const { data, newValue, oldValue, colDef } = event;
        if (newValue === oldValue) return;
        const res = await editGroup(token, data?.id, { [colDef.field]: newValue })
        setGroups(groups.map((g) => (g.id === res.data.id ? res.data : g)));
    }
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="text-primary">Groups</h3>
                <Button onClick={() => setShowGroupModal(true)}>Add Group</Button>
            </div>

            <div className="ag-grid-wrapper" >
                <AgGridReact theme={themeAlpine} columnDefs={colDefs} rowData={groups} onCellValueChanged={handleCellEdit} autoSizeStrategy={autoSizeStrategy} />
            </div>

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

            <Modal show={!!viewingGroup} onHide={() => setViewingGroup(null)} size="lg" centered scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>{viewingGroup?.name} Members</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik enableReinitialize
                        initialValues={{
                            name: editingUser?.user?.name || "",
                            email: editingUser?.user?.email || "",
                        }}
                        onSubmit={handleUserSubmit}
                        validationSchema={userSchema}
                    >
                        {({ values, touched, errors, handleChange, isSubmitting, handleSubmit, handleBlur }) => (
                            <div>
                                <div className="mb-3">
                                    <input autoComplete="form"
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name or email..."
                                    />
                                </div>
                                <form noValidate onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
                                    <div className="flex-fill">
                                        <input
                                            name="name"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Full Name"
                                            className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                        />
                                        {touched.name && errors.name && (
                                            <div className="invalid-feedback">{errors.name}</div>
                                        )}
                                    </div>
                                    <div className="flex-fill">
                                        <input
                                            name="email"
                                            autoComplete="off"
                                            type="email"
                                            placeholder="Email Address"
                                            className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                        />
                                        {touched.email && errors.email && (
                                            <div className="invalid-feedback">{errors.email}</div>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            {editingUser?.user ? "Save" : "+ Add New"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Formik>

                    {/* Existing Members List */}
                    {viewingGroup?.group_members.map((user) => (
                        <div key={user.id} className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded">
                            <div>
                                <div className="fw-bold">{user.name}</div>
                                <div className="text-muted">{user.email}</div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                                < MdModeEditOutline size={20} color="black" style={{ cursor: "pointer" }} onClick={() => setEditingUser({ user, groupId: viewingGroup?.id })} />
                                <MdOutlineDelete onClick={() => deleteUser(viewingGroup.id, user.id)} size={25} style={{ cursor: "pointer" }} color="red" />
                            </div>
                        </div>
                    ))}
                </Modal.Body>
            </Modal>


        </div>
    );
}

export default EmailGroup;