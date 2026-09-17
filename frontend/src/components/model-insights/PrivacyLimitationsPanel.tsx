import {
  Database,
  LockKeyhole,
  TriangleAlert,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { privacyLimitations } from "../../data/modelInsights";

const limitationIcons: Record<
  (typeof privacyLimitations)[number]["icon"],
  LucideIcon
> = {
  lock: LockKeyhole,
  database: Database,
  user: UserCheck,
  warning: TriangleAlert,
};

export function PrivacyLimitationsPanel() {
  return (
    <article className="insight-panel privacy-panel">
      <header className="reference-panel-header">
        <div>
          <h2>Privacy &amp; Limitations</h2>
        </div>
      </header>

      <div className="privacy-panel__list">
        {privacyLimitations.map((item) => {
          const Icon = limitationIcons[item.icon];

          return (
            <div className="privacy-item" key={item.key}>
              <span className="privacy-item__icon">
                <Icon aria-hidden="true" size={16} />
              </span>

              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}