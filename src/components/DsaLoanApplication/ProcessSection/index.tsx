import ProcessStep from './ProcessStep';
import styles from './styles.module.css';

const steps = [
  {
    title: 'Enter Your Basic Details',
    description: 'Fill a simple form with essential details'
  },
  {
    title: 'Get a Call from our Executive',
    description: 'Within 2 hours, our Customer Success executive will reach out to understand your requirements and guide you'
  },
  {
    title: 'Receive the Best Quote and Start Your Application',
    description: 'If and when you are ready, receive a tailored loan quote and start your application effortlessly'
  }
];

export default function ProcessSection() {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <ProcessStep
          key={index}
          number={index + 1}
          title={step.title}
          description={step.description}
        />
      ))}
    </div>
  );
}
