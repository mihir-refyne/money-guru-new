import ReactInstaStory from "react-insta-stories";
import type { ReactInstaStoriesProps } from "react-insta-stories/dist/interfaces";

interface StoriesProps extends ReactInstaStoriesProps {}

export default function Stories(props: StoriesProps) {
  return <ReactInstaStory width="100%" height="100%" {...props} />;
}
