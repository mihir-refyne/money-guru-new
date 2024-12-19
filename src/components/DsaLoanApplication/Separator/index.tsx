import { ReactNode } from 'react';
import styles from './styles.module.css';

interface SeparatorProps {
  text: string;
  className?: string;
}

export default function Separator({ text, className = '' }: SeparatorProps) {
  const containerClass = className ? `${styles.container} ${className}` : styles.container;
  
  return (
    <div className={containerClass}>
      <div className={styles.line} />
      <span className={styles.text}>{text}</span>
      <div className={styles.line} />
    </div>
  );
}
