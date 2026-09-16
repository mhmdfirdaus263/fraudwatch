import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import "./layout.css";

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="FraudWatch home">
      <span className="brand__icon" aria-hidden="true">
        <ShieldCheck size={28} strokeWidth={2.2} />
      </span>

      <span className="brand__text">
        <strong>FraudWatch</strong>
        <small>AI Fraud Detection</small>
      </span>
    </Link>
  );
}