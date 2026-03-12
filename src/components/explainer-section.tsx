export function ExplainerTitle() {
  return (
    <div className="explainer-title-block">
      <div className="branded-header-title">Portable Agents with Generative UI</div>
      <div className="branded-header-subtitle">
        Bring your Agent Spec Agent Configurations to interactive, renderable
        UIs, powered by A2UI components over the AGUI Protocol
      </div>
    </div>
  );
}

export function ExplainerCards() {
  return (
    <div className="explainer-section">
      <p className="explainer-headline">
        Built with Agent Spec, CopilotKit AG-UI, and A2UI
      </p>

      <div className="explainer-cards">
        <div className="explainer-card">
          <div className="explainer-card-icon explainer-card-icon--lilac">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="explainer-card-title">Open Agent Specification (Agent Spec)</div>
          <p className="explainer-card-desc">
            Define agent behavior and workflows once, run them across compatible runtimes.
          </p>
        </div>

        <div className="explainer-card">
          <div className="explainer-card-icon explainer-card-icon--mixed">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="14" y1="4" x2="10" y2="20" />
            </svg>
          </div>
          <div className="explainer-card-title">AG-UI (CopilotKit)</div>
          <p className="explainer-card-desc">
            Standardize the live, tool-aware interaction stream between an agent run and an application.
          </p>
        </div>

        <div className="explainer-card">
          <div className="explainer-card-icon explainer-card-icon--mint">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="explainer-card-title">A2UI (Google)</div>
          <p className="explainer-card-desc">
            Let agents propose safe, declarative UI surfaces that applications can render natively.
          </p>
        </div>
      </div>
    </div>
  );
}
