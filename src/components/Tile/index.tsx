import styles from "./styles.module.css";

interface TileProps {
  title: string;
  iconUrl: string;
  backgroundColor: string;
}

export default function Tile({ title, iconUrl, backgroundColor }: TileProps) {
  return (
    <div
      className={styles.Tile}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <figure>
        <img src={iconUrl} alt={title} />
      </figure>
      <p
        className="text-caption mt-4"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
}
