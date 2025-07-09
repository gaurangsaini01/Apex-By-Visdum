import { AgGridReact } from "ag-grid-react"
import { useEffect, useMemo, useState } from "react"
import { getAllIncidents } from "../services/operations/incidents";
import { formatDate, formatSecondsToHHMMSS } from "../utils/date";
import { themeMaterial } from 'ag-grid-community';
const Incidents = () => {
    const [incidents, setIncidents] = useState([])
    const colDefs = useMemo(() => {
        return [
            { field: "status", flex: 1 },
            { field: "monitor", flex: 1 },
            { field: "root_cause", flex: 1 },
            {
                field: "resolved", flex: 1, valueGetter: (p: any) => {
                    if (p.data.resolved) {
                        return formatDate(p.data.resolved)
                    } else {
                        return "Not Resolved"
                    }
                }
            },
            { field: "duration", flex: 1, valueGetter: (p: any) => formatSecondsToHHMMSS(p.data.duration) }
        ];
    }, [incidents]);

    useEffect(() => {
        (async () => {
            const res = await getAllIncidents()
            if (res?.success) {
                const parsedData = res?.data
                    ?.map((m: any) => (m.monitor !== null ? m : null))
                    ?.filter((item: any) => item !== null)



                setIncidents(parsedData);
            }
        })()
    }, [])
    return (
        <div className="p-3 container">
            <h3 className="text-dark mb-0 d-flex">
                <div>Incidents</div>
                <strong className="text-primary">.</strong>
            </h3>
            <div style={{ width: "100%", height: "87vh", overflowY: "scroll" }} className=" mt-4">
                <AgGridReact theme={themeMaterial} columnDefs={colDefs} rowData={incidents} />
            </div>
        </div>
    )
}

export default Incidents