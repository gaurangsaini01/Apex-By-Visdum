import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { getAllIncidents, getIncidentData } from "../services/operations/incidents";
import { formatDate } from "../utils/date";
import Loader from "../components/Loader/Loader";
import { Offcanvas } from "react-bootstrap";
import { LuRefreshCw } from "react-icons/lu";
interface Incident {
    status: string;
    monitor: string;
    root_cause: string;
    resolved: string | null;
    duration: number;
    started: string,
    id: number,
    email_notify: boolean;
    http_response:string;
}

const Incidents = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)
    const [incidentData, setIncidentData] = useState<Incident | null>(null)

    const defaultColDef: ColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 100,
        flex: 1
    }), []);

    function ActionsRendered(props: any) {
        const { data, onView } = props;
        return (
            <div className="d-flex justify-content-between align-items-center mt-1">
                <div onClick={() => onView(data?.id)} className="text-primary" style={{ cursor: "pointer" }}>View</div>
            </div>
        );
    }

    const colDefs: ColDef<Incident>[] = useMemo(() => [
        {
            headerName: "Status",
            field: "status",
        },
        {
            headerName: "Monitor",
            field: "monitor"
        },
        {
            headerName: "Root Cause",
            field: "root_cause"
        },
        {
            headerName: "Resolved",
            field: "resolved",
            valueGetter: (params: any) => {
                if (params.data.resolved) {
                    return formatDate(params.data.resolved);
                } else {
                    return "Not Resolved";
                }
            },
            cellStyle: (params: any) => {
                if (params.data.resolved) {
                    return { color: 'green' };
                } else {
                    return { color: 'red' };
                }
            }
        },
        {
            headerName: "Duration",
            field: "duration",
            flex:1.5
        },
        {
            headerName: 'Actions',
            cellRenderer: ActionsRendered,
            cellRendererParams: {
                onView: async (id: number) => {
                    setShowDrawer(true);
                    setDrawerLoading(true)
                    const res = await getIncidentData(id);
                    if (res?.success) {
                        setIncidentData(res?.data)
                        setDrawerLoading(false)
                    }
                }
            },
            width: 120, flex: 1
        }
    ], []);

    const fetchIncidents = async () => {
        setLoading(true);
        const res = await getAllIncidents();
        if (res?.success) {
            const parsedData = res.data
                ?.filter((m: any) => m.monitor !== null);
            setIncidents(parsedData || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchIncidents();
    }, []);


    // Grid options
    const gridOptions = useMemo(() => ({
        pagination: true,
        paginationPageSize: 20,
        rowHeight: 45,
        headerHeight: 55,
    }), []);

    return (
        <div className="p-3 container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-dark mb-0 d-flex">
                    <div>Incidents</div>
                    <strong className="text-primary">.</strong>
                </h3>
                <button
                    className="btn btn-primary"
                    onClick={fetchIncidents}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : <div className="d-flex gap-2 align-items-center justify-content-center"><LuRefreshCw/>Refresh</div>}
                </button>
            </div>


            {/* Loading indicator */}
            {loading ?
                <Loader /> :
                <div>
                    {/* Stats */}
                    <div className="mt-3 text-muted">
                        <small>
                            Total Incidents: <strong>{incidents.length}</strong>
                            {incidents.length > 0 && (
                                <span className="ms-3">
                                    Resolved: <strong className="text-success">
                                        {incidents.filter(i => i.resolved).length}
                                    </strong>
                                    {' | '}
                                    Pending: <strong className="text-danger">
                                        {incidents.filter(i => !i.resolved).length}
                                    </strong>
                                </span>
                            )}
                        </small>
                    </div>
                    {/* AG Grid */}
                    <div
                        className="ag-theme-material mt-4"
                        style={{
                            width: "100%",
                            height: "calc(90vh - 50px)", // Adjusted height
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px"
                        }}
                    >
                        <AgGridReact
                            columnDefs={colDefs}
                            rowData={incidents}
                            defaultColDef={defaultColDef}
                            {...gridOptions}
                        />
                    </div>
                </div>


            }
            <Offcanvas style={{ width: 500, fontSize: '14px', color: '#000000b7' }} show={showDrawer} placement="end" onHide={() => {
                setIncidentData(null)
                setShowDrawer(false)
            }}>

                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="">Incident Details</Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    {drawerLoading ? <Loader /> :
                        <div className="d-flex flex-column rounded-1">
                            <div className="d-flex  justify-content-between">
                                <div className="border py-4 w-100 p-2">
                                    <h6 className="log-subheading">Started</h6>
                                    {/*<div className="border  p-2 rounded-1" style={{ maxHeight: 300, minHeight: 300, overflowY: "scroll" }}>
                                    {logData?.activity_data}
                                </div>*/}
                                    <div>{formatDate(incidentData?.started)}</div>

                                </div>
                                <div className="border py-4 w-100 p-2">
                                    <h6 className="log-subheading">Root Cause</h6>
                                    <span>{incidentData?.root_cause}</span>
                                </div>
                            </div>
                            <div className="d-flex  justify-content-between">
                                <div className="border  py-4 w-100 p-2">
                                    <h6 className="log-subheading">Monitor URL</h6>
                                    <span>{incidentData?.monitor}</span>
                                </div>

                            </div>

                            <div className="d-flex  justify-content-between">
                                <div className="p-2 w-100 py-4 border ">
                                    <h6 className="log-subheading">Duration</h6>
                                    <div>{incidentData?.duration}</div>
                                </div>
                                <div className="border w-100  p-2 py-4">
                                    <h6 className="log-subheading">Resolved Status</h6>
                                    <span >{incidentData?.resolved || "Not Resolved"}</span>
                                </div>
                            </div>
                            <div className="d-flex  justify-content-between">
                                <div className="p-2 w-100 py-4 border ">
                                    <h6 className="log-subheading">Http Response</h6>
                                    <div>{incidentData?.http_response || "No response"}</div>
                                </div>
                            </div>
                        </div>}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default Incidents;