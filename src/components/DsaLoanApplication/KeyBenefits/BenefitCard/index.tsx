import Image from 'next/image';
import styles from './styles.module.css';

interface BenefitCardProps {
  icon: string;
  title: string;
}

export default function BenefitCard({ icon, title }: BenefitCardProps) {
  return (
    <div className={styles.card}>
      <Image
        src={icon}
        alt=""
        width={32}
        height={32}
        className={styles.icon}
      />
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
}
