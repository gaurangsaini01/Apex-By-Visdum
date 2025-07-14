import { useEffect, useMemo, useState } from "react"
import { getLogs } from "../services/operations/logs";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";

interface Log {
  activity_data: string
  created_at: string
  description: string
  id: number
  module: string
  user_email: string
  user_id: number
  user_name: string
}
function Logs() {
  const colDefs: ColDef<Log>[] = useMemo(() => [
    {
      headerName:"S No",
      
    },
    {
      field: 'module',
      headerName: "Logs Name"
    }, {

    }
  ], []);
  const [logs, setLogs] = useState<Log[] | null>(null)
  useEffect(() => {
    (async () => {
      const res = await getLogs();
      if (res?.success) {
        setLogs(res?.data)
        console.log(res?.data)
      }
    })()
  }, [])
  return (
    <AgGridReact rowNumbers={true} rowData={logs} columnDefs={colDefs} />
  )
}

export default Logs
