import TrackerTile, { TrackerTileProps } from "./TrackerTile";
import styles from "./TrackerTileWrapper.module.css";

interface TrackerProps extends TrackerTileProps {
  url: string;
}

interface TrackerTileWrapperProps {
  trackers: Array<TrackerProps>;
  onClick: (name: string, url: string) => void;
}

export default function TrackerTileWrapper({
  trackers,
  onClick,
}: TrackerTileWrapperProps) {
  const orientation = trackers.length <= 1 ? "horizontal" : "vertical";
  return (
    <div
      className={`${
        orientation === "horizontal" ? "mt-4" : styles.TrackerTileWrapper
      }`}
    >
      {trackers.map((trackerConfig) => {
        return (
          <TrackerTile
            key={trackerConfig.headingText}
            orientation={orientation}
            {...trackerConfig}
            onClick={() => onClick(trackerConfig.name, trackerConfig.url)}
          />
        );
      })}
    </div>
  );
}
