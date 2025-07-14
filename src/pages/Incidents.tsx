import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { getAllIncidents } from "../services/operations/incidents";
import { formatDate, formatSecondsToHHMMSS } from "../utils/date";
import Loader from "../components/Loader/Loader";

// Type define karo for better TypeScript support
interface Incident {
    status: string;
    monitor: string;
    root_cause: string;
    resolved: string | null;
    duration: number;
}

const Incidents = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Common column config for every column
    const defaultColDef: ColDef = useMemo(() => ({
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 100,
        flex: 1
    }), []);

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
            valueGetter: (params: any) => formatSecondsToHHMMSS(params.data.duration)
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
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>


            {/* Loading indicator */}
            {loading ?
                <Loader /> :
                <div>
                    {/* AG Grid */}
                    <div
                        className="ag-theme-material mt-4"
                        style={{
                            width: "100%",
                            height: "calc(87vh - 50px)", // Adjusted height
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
                </div>
            }
        </div>
    );
};

export default Incidents;