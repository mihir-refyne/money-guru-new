import Image from 'next/image';
import styles from './styles.module.css';
import { LoanType, loanContent } from '../types';

interface HeroSectionProps {
  loanType: LoanType;
}

export default function HeroSection({ loanType }: HeroSectionProps) {
  const content = loanContent[loanType];

  return (
    <section className={styles.heroSection}>
      <h1 className={styles.heading}>{content.title}</h1>
      <p className={styles.subheading}>{content.subtitle}</p>
      <div className={styles.imageContainer}>
        <Image
          src={content.imagePath}
          alt={`${loanType} loan illustration`}
          width={299}
          height={186}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
          style={{ width: '100%', height: '100%', objectFit: 'cover' } as const}
        />
      </div>
    </section>
  );
}
