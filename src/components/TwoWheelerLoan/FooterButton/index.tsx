import styles from "./styles.module.css";

interface FooterButtonProps {
  isButtonDisabled: boolean;
  label: string;
  onClick: () => void;
}

export const FooterButton = ({
  label,
  isButtonDisabled,
  onClick,
}: FooterButtonProps) => {
  return (
    <div className={styles.button_container}>
      <button
        disabled={isButtonDisabled}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={`btn-primary btn ${styles.button_primary} ${
          isButtonDisabled && styles.button_primary__disabled
        }`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};
