import { useEffect } from "react"
import { useSelector } from "react-redux"
import { getMonitorDetails } from "../services/operations/monitor"
import { useParams } from "react-router"

function Monitor() {
  const { token } = useSelector((state: any) => state.auth)
  const {id} = useParams();
  useEffect(() => {
    (async ()=>{
      const res = await getMonitorDetails(Number(id),token);
      console.log(res)
    })()
  }, [])

  return (
    <div>Monitor</div>
  )
}

export default Monitor