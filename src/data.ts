import { RiComputerLine } from "react-icons/ri"
import { GoShield } from "react-icons/go";
import { CiClock2 } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";

export const sideBarOptions = [
  { name: "monitors", value: "Monitoring", icon: RiComputerLine },
  { name: "incidents", value: "Incidents", icon: GoShield },
  { name: "groups", value: "Groups", icon: FaUsers },
  { name: "logs", value: "Logs", icon: CiClock2 },
];

//Value is in minutes
export const intervalOptions = [
  { label: "1m", value: 1 },
  { label: "2m", value: 2 },
  { label: "5m", value: 5 },
  { label: "10m", value: 10 },
  { label: "20m", value: 20 },
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "4h", value: 240 },
  { label: "12h", value: 720 },
  { label: "24h", value: 1440 },
];

export const timeoutOptions = [
  { label: "15s", value: 15 },
  { label: "20s", value: 20 },
  { label: "25s", value: 25 },
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "1min", value: 60 },
];

export const authOptions = ["None", "Bearer", "Digest"];

export const methods = ["HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"];