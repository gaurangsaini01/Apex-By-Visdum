import { useEffect, useMemo, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { addMembers, createGroup, deleteGroup, editGroup, getGroups, getMembers } from "../../services/operations/groups";
import { AgGridReact } from 'ag-grid-react';
import { formatDate } from "../../utils/date";
import { MdOutlineDelete } from "react-icons/md";
import { IoIosCheckmark, IoIosClose } from "react-icons/io";
import './EmailGroup.css'
import { FaSearch } from "react-icons/fa";
import { getInitials } from "../../utils/getInitial";
import ConfirmationModal from "../../components/Reusable/ConfirmationModal";
import { IoAddOutline } from "react-icons/io5";
import Loader from "../../components/Loader/Loader";

interface User {
    id: number;
    name: string;
    email: string;
}
export interface Group {
    id: number;
    name: string;
    group_members: User[];
    created_at: string
}
const groupSchema = Yup.object({
    name: Yup.string().required("Group name is required"),
});

const ActionsRendered = (props: any) => {
    const { data, onDelete, onView } = props;
    return (
        <div className="d-flex justify-content-between align-items-center mt-1">
            <div onClick={() => onView(data)} className="text-primary" style={{ cursor: "pointer" }}>View Members</div>
            <MdOutlineDelete onClick={() => {
                onDelete(data?.id)
            }} className="hover-icon-group" style={{ cursor: "pointer",padding:"4px" }} color="red" size={25} />
        </div>
    );
}


function EmailGroup() {
    //Local states
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<User[] | []>([]);
    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedUsersIds, setSelectedUsersIds] = useState<number[]>([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [addingMembers, setAddingMembers] = useState(false);


    useEffect(() => {
        fetchGroups();
        fetchMembers();
    }, []);

    useEffect(() => {
        setSelectedUsers(viewingGroup?.group_members || [])
    }, [viewingGroup])
    useEffect(() => {
        setSelectedUsersIds(selectedUsers?.map((user) => user.id))
    }, [selectedUsers])
    const defaultColDef: ColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 100,
        flex: 1
    }), []);


    const colDefs = useMemo(() => [
        { field: 'name', headerName: "Group Name", editable: true, flex: 1 },
        { field: 'group_members', headerName: "Group Members", valueGetter: (p: any) => p.data.group_members?.length || 0, flex: 1 },
        { field: 'created_at', headerName: "Created At", valueGetter: (p: any) => formatDate(p.data.created_at), flex: 1 },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRendered,
            cellRendererParams: {
                onDelete: (id: number) => {
                    const group = groups.find((g) => g.id === id);
                    if (group) setGroupToDelete(group);
                },
                onView: (group: Group) => setViewingGroup(group)
            },
            width: 120, flex: 1
        }
    ], [groups]);

    // Filter users based on search term
    const filteredUsers = allUsers.filter((user: User) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Handle user selection
    const toggleUserSelection = (user: User) => {
        setSelectedUsers((prev: User[]) => {
            const isSelected = prev?.find(u => u.id === user.id);
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
    const addMembersToGroup = async () => {
        setAddingMembers(true)
        const res = await addMembers(viewingGroup?.id!, selectedUsersIds)
        if (res?.success) {
            if (!viewingGroup) return null
            setGroups(prev => prev?.map((group) => {
                if (group.id === viewingGroup.id) {
                    return { ...group, group_members: [...selectedUsers] }
                }
                return group
            }))
            setViewingGroup(null);
            setSelectedUsers([])
        }
        setAddingMembers(false)
    };

    async function delGroup(id: number) {
        await deleteGroup(id);
        setGroups(prev => prev.filter((g) => g.id !== id));
        setGroupToDelete(null)
    }

    const gridOptions = useMemo(() => ({
        pagination: true,
        paginationPageSize: 20,
        rowHeight: 45,
        headerHeight: 55
    }), []);

    async function fetchGroups() {
        setLoading(true)
        const res = await getGroups();
        if (res?.success) setGroups(res?.data);
        setLoading(false)
    }
    async function fetchMembers() {
        const res = await getMembers()
        if (res?.success) {
            setAllUsers(res?.data);
        }
    }
    async function handleGroupSubmit(values: { name: string }) {
        const res = await createGroup(values);
        if (res?.success) {
            setGroups(prev => [res?.data, ...prev]);
            setShowGroupModal(false);
        }
    }
    async function handleCellEdit(event: any) {
        const { data, newValue, oldValue, colDef } = event;
        if (newValue === oldValue) return;
        const res = await editGroup(data?.id, { [colDef.field]: newValue })
        console.log(res)
        setGroups(groups?.map((group) => (group.id === res.data.id ? res.data : group)));
    }
    return (
        <div className="container p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-dark mb-0 d-flex">
                    <div>Groups</div>
                    <strong className="text-primary">.</strong>
                </h3>
                <div>
                    <Button type="submit" onClick={() => setShowGroupModal(true)} variant="primary" className="align-items-center"><IoAddOutline size={20} /><span>Add Group</span></Button>
                </div>
            </div>

            {loading ? <Loader /> : <div className="ag-theme-material mt-4"
                style={{
                    width: "100%",
                    height: "calc(87vh - 50px)",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px"
                }} >
                <AgGridReact defaultColDef={defaultColDef} key={groups.length} columnDefs={colDefs} rowData={groups} onCellValueChanged={handleCellEdit} {...gridOptions} />
            </div>}

            {/* Group Creation Modal */}
            <Modal show={showGroupModal} centered onHide={() => setShowGroupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> Add Group</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{ name: "" }}
                    validationSchema={groupSchema}
                    onSubmit={handleGroupSubmit}
                    enableReinitialize
                >
                    {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => (
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
                                <Button disabled={isSubmitting} type="submit">Save</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Modal for user addition */}

            <Modal show={!!viewingGroup} centered onHide={() => { setViewingGroup(null); setSelectedUsers([]) }} scrollable>
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
                            <Button size="sm" onClick={selectAll}>Select All ({allUsers?.length})</Button>
                            {selectedUsers?.length > 0 && <Button size="sm" variant="light" onClick={clearSelection}>Clear All</Button>}
                        </div>
                        <div className="sma">{selectedUsers?.length} selected</div>
                    </div>
                    <div className="list-outer-div">
                        {filteredUsers?.map((user: User) => {
                            const isSelected = selectedUsers?.find((u: User) => u.id === user.id);
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
                    {selectedUsers?.length > 0 && <div className="mt-4">
                        <span className="fw-medium">Selected Users:</span>
                        <div className="mt-2 d-flex gap-1 flex-wrap overflow-y-auto h-50 ">
                            {selectedUsers?.map((user: User) => {
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
                            <Button disabled={addingMembers} onClick={addMembersToGroup} variant="success">Add Members to {viewingGroup?.name} ({selectedUsers?.length})</Button></div>
                    </div>
                </Modal.Body>
            </Modal>
            <ConfirmationModal title={"Delete Group ?"} desc={"This action is irreversible , group will be permanently deleted ."} closeText={"Cancel"} submitText={"Delete"} onClose={() => setGroupToDelete(null)} show={!!groupToDelete} onSubmit={() => delGroup(groupToDelete?.id!)} />

        </div>
    );
}

export default EmailGroup;