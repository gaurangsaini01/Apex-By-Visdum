import { useEffect, useMemo, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { createGroup, deleteGroup, editGroup, getGroups, getMembers } from "../../services/operations/groups";
import { AgGridReact } from 'ag-grid-react';
import { formatDate } from "../../utils/date";
import { themeAlpine } from 'ag-grid-community';
import { MdOutlineDelete } from "react-icons/md";
import { IoIosCheckmark, IoIosClose } from "react-icons/io";
import './EmailGroup.css'
import { FaSearch } from "react-icons/fa";
import { getInitials } from "../../utils/getInitial";


interface User {
    id: number;
    name: string;
    email: string;
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


function EmailGroup() {

    const [allUsers, setAllUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[] | []>([]);

    // Filter users based on search term
    const filteredUsers = allUsers.filter((user: User) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Handle user selection
    const toggleUserSelection = (user: User) => {
        setSelectedUsers((prev: User[]) => {
            const isSelected = prev.find(u => u.id === user.id);
            if (isSelected) {
                return prev.filter(u => u.id !== user.id);
            } else {
                return [...prev, user];
            }
        });
    };

    // Handle select all
    const selectAll = () => {
        setSelectedUsers(filteredUsers);
    };

    // Handle clear selection
    const clearSelection = () => {
        setSelectedUsers([]);
    };

    // Handle add to group
    const addToGroup = () => {
        if (selectedUsers.length > 0) {
            alert(`Adding ${selectedUsers.length} users to Tech Team:\n${selectedUsers.map(u => u.name).join(', ')}`);
            // Here you would make API call to add users to group
            // addUsersToGroup(selectedUsers);
        }
    };

    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const { token } = useSelector((state: any) => state.auth)
    const [groups, setGroups] = useState<Group[]>([]);
    const [showGroupModal, setShowGroupModal] = useState(false);

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
        fetchMembers();
    }, []);


    async function fetchGroups() {
        const res = await getGroups(token);
        if (res?.success) setGroups(res?.data);
    }
    async function fetchMembers() {
        const res = await getMembers(token)
        if (res?.success) {
            setAllUsers(res?.data);
        }
    }
    async function handleGroupSubmit(values: { name: string }) {
        const res = await createGroup(token, values);
        if (res?.success) {
            setGroups(prev => [res?.data, ...prev]);
            setShowGroupModal(false);
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

            {/* Group Creation Modal */}
            <Modal show={showGroupModal} onHide={() => setShowGroupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> "Add Group</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{ name: "" }}
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
                                <Button variant="outline-secondary" onClick={() => setShowGroupModal(false)} className="me-2">
                                    Cancel
                                </Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Modal for user addition */}

            <Modal show={!!viewingGroup} onHide={() => { setViewingGroup(null); setSelectedUsers([]) }} scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>{viewingGroup?.name} Members</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
                        <InputGroup.Text>
                            <FaSearch style={{ color: '#999' }} />
                        </InputGroup.Text>
                        <FormControl
                            placeholder="Search by name or email..."
                            aria-label="Search"
                            className="shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                    </InputGroup>
                    <div className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button size="sm" onClick={selectAll}>Select All ({allUsers.length})</Button>
                            <Button size="sm" variant="light" onClick={clearSelection}>Clear All</Button>
                        </div>
                        <div className="sma">{selectedUsers?.length} selected</div>
                    </div>
                    <div className="list-outer-div">
                        {filteredUsers.map((user: User) => {
                            const isSelected = selectedUsers.find((u: User) => u.id === user.id);
                            return <div key={user.id} onClick={() => toggleUserSelection(user)} className={`d-flex align-items-center justify-content-between gap-2 mb-2 member-card ${isSelected ? 'selected-card' : ""}`}>
                                <div className="d-flex align-items-center justify-content-between p-1 gap-2">
                                    <div className="avatar-circle">{getInitials(user)}
                                        {isSelected && <div className={`tick d-flex align-items-center justify-content-center`}><IoIosCheckmark /></div>}
                                    </div>
                                    <div>
                                        <div className="text-dark fw-semibold">{user?.name}</div>
                                        <div className="text-dark small color text-muted">{user?.email}</div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                    {selectedUsers.length > 0 && <div className="mt-4">
                        <span className="fw-medium">Selected Users:</span>
                        <div className="mt-2 d-flex gap-1 flex-wrap overflow-y-auto h-50 ">
                            {selectedUsers.map((user: User) => {
                                return <span key={user.id} className="d-flex badge-color align-items-center px-2 rounded-pill">
                                    {user.name}
                                    <IoIosClose
                                        style={{ cursor: "pointer" }}
                                        size={20}
                                        onClick={() =>
                                            setSelectedUsers((prev) => {
                                                return prev.filter((u) => u.id !== user.id)
                                            })
                                        }
                                    />
                                </span>
                            })}
                        </div>
                    </div>}
                    <div className="mt-4 d-flex justify-content-end">
                        <div className="gap-2 d-flex">
                            <Button variant="outline-secondary" onClick={() => { setViewingGroup(null); setSelectedUsers([]) }}>Cancel</Button>
                            <Button disabled={selectedUsers?.length == 0} variant="success">Add Members to {viewingGroup?.name} ({selectedUsers.length})</Button></div>
                    </div>
                </Modal.Body>
            </Modal>


        </div>
    );
}

export default EmailGroup;