import React from "react";

export const SolidFooterActionButton = ({
  label,
  icon,
  isLoading,
  onClick,
}: {
  label: string;
  icon?: React.ReactElement;
  isLoading?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      disabled={isLoading}
      style={{
        padding: "12px 16px",
        borderRadius: "4px",
        width: "100%",
        backgroundColor: isLoading
          ? " var(--clr-grey-default)"
          : "var(--clr-brand-default)",
        border: "none",
      }}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <p
          style={{
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
            margin: 0,
            color: isLoading ? "var(--clr-text-secondary)" : "white",
          }}
        >
          {label}
        </p>
        {icon}
      </div>
    </button>
  );
};

export const SolidWhiteFooterActionButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      style={{
        padding: "12px 16px",
        borderRadius: "4px",
        width: "100%",
        backgroundColor: "white",
        border: "none",
        color: "var(--clr-brand-default)",
      }}
      onClick={onClick}
    >
      <p
        style={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          margin: 0,
        }}
      >
        {label}
      </p>
    </button>
  );
};

export const OutlineFooterActionButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      style={{
        border: "1px solid var(--clr-brand-default)",
        padding: "12px 16px",
        borderRadius: "4px",
        width: "100%",
        backgroundColor: "white",
        color: "var(--clr-brand-default)",
      }}
      onClick={onClick}
    >
      <p
        style={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          margin: 0,
        }}
      >
        {label}
      </p>
    </button>
  );
};
