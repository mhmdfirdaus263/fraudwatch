import { Link } from "react-router-dom";

import fraudWatchLogo from "../../assets/fraudwatch-logo.png";

export function Brand() {
  return (
    <Link
      aria-label="FraudWatch home"
      className="fraudwatch-brand"
      to="/"
    >
      <img
        alt="FraudWatch"
        className="fraudwatch-brand__logo"
        src={fraudWatchLogo}
      />
    </Link>
  );
}