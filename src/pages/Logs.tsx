import { useEffect, useMemo, useState } from "react"
import { getLogData, getLogs } from "../services/operations/logs";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { formatDate } from "../utils/date";
import Loader from "../components/Loader/Loader";
import Offcanvas from 'react-bootstrap/Offcanvas';

interface Logs {
  created_at: string
  description: string
  id: number
  module: string
  user_email: string
  user_id: number
  user_name: string
}
interface Log extends Logs {
  activity_data: string
}

function ActionsRendered(props: any) {
  const { data, onView } = props;
  return (
    <div className="d-flex justify-content-between align-items-center mt-1">
      <div onClick={() => onView(data.id)} className="text-primary" style={{ cursor: "pointer" }}>View</div>
    </div>
  );
}
function Logs() {
  const [loading, setLoading] = useState(false)
  const [logData, setLogData] = useState<Log | null>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const colDefs: ColDef<Logs>[] = useMemo(() => [
    {
      headerName: "S No",
      valueGetter: (p: any) => p.node.rowIndex + 1,
      flex: 1
    },
    {
      field: 'module',
      headerName: "Logs Name",
      valueGetter: (p: any) => p.data.module.toLocaleUpperCase(),
      flex: 2
    }, {
      field: 'description',
      flex: 2,
    },
    {
      field: 'created_at',
      headerName: "Created At",
      valueGetter: (p: any) => formatDate(p.data.created_at),
      flex: 2
    },
    {
      field: 'user_name',
      headerName: "User Name",
      flex: 2
    },
    {
      headerName: "Actions",
      cellRenderer: ActionsRendered,
      cellRendererParams: {
        onView: async (id: number) => {
          setShowDrawer(true);
          setDrawerLoading(true)
          const res = await getLogData(id);
          if (res?.success) {
            setLogData(res?.data)
            setDrawerLoading(false)
          }
        }
      }
    }
  ], []);
  const [logs, setLogs] = useState<Log[] | null>(null)
  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await getLogs();
      if (res?.success) {
        setLogs(res?.data)
      }
      setLoading(false)
    })()
  }, [])
  return (
    <div className="container p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark mb-0 d-flex">
          <div>Activity Logs</div>
          <strong className="text-primary">.</strong>
        </h3>
      </div>

      {loading ? <Loader /> : <div className="ag-theme-material mt-4"
        style={{
          width: "100%",
          height: "calc(94vh - 50px)",
          border: "1px solid #e0e0e0",
          borderRadius: "8px"
        }} >
        <AgGridReact rowData={logs} columnDefs={colDefs} />
      </div>}

      <Offcanvas style={{ width: 500,fontSize:'14px',color:'#000000b7' }} show={showDrawer} placement="end" onHide={() => {
        setLogData(null)
        setShowDrawer(false)
      }}>

        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="">Log Details</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          {drawerLoading ? <Loader /> :
            <div className="d-flex flex-column rounded-1">
              <div className="d-flex  justify-content-between">
                <div className="border py-4 w-100 p-2">
                  <h6 className="log-subheading">Logs Name</h6>
                  <span >{logData?.module.toUpperCase()}</span>
                </div>
                <div className="border py-4 w-100 p-2">
                  <h6 className="log-subheading">User</h6>
                  <span>{logData?.user_name}</span>
                </div>
              </div>
              <div className="d-flex  justify-content-between">
                <div className="border  py-4 w-100 p-2">
                  <h6 className="log-subheading">Created At</h6>
                  <span>{formatDate(logData?.created_at!)}</span>
                </div>

              </div>
              <div className="p-2 py-4 border ">
                <h6 className="log-subheading">Description</h6>
                <div>{logData?.description}</div>
              </div>
              <div className="border  p-2">
                <h6 className="log-subheading">Details</h6>
                <div className="border  p-2 rounded-1" style={{ maxHeight: 300, minHeight: 300, overflowY: "scroll" }}>
                  {logData?.activity_data}
                </div>
              </div>
            </div>}
        </Offcanvas.Body>
      </Offcanvas>


    </div>
  )
}

export default Logs
