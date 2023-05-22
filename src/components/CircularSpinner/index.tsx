import styles from "./styles.module.css";

interface CircularSpinnerProps {
  size?: number;
}

export default function CircularSpinner({ size }: CircularSpinnerProps) {
  return (
    <div
      className={styles.CircularSpinner}
      style={{
        height: size,
        width: size,
      }}
    >
      Loading...
    </div>
  );
}
