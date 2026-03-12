"use client";

const DOCS_URL = "https://docs.copilotkit.ai/agent-spec";
const BLOG_URL = "https://go.copilotkit.ai/oracle-a2ui-blog";

export function CTABanner() {
  return (
    <div className="cta-banner">
      <div className="cta-content">
        <div className="cta-text">
          <span className="cta-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </span>
          <p className="cta-headline">
            Build AI agents with a universal spec.{" "}
            <span className="cta-subtext">Open Agent Specification (Agent Spec) is a portable language for defining agentic systems.</span>
          </p>
        </div>
        <div className="cta-actions">
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--primary">
            Get Started
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--secondary">
            Read More
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
