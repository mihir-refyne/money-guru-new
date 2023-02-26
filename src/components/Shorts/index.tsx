import React from "react";
import ShortItem, { ShortData } from "./ShortItem";
import ShortsContainer from "./ShortsContainer";

interface ShortsProps {
  items: ShortData[];
}

export default function Shorts({ items }: ShortsProps) {
  return (
    <ShortsContainer>
      {items.map((short, index) => (
        <ShortItem key={short.id} data={short} />
      ))}
    </ShortsContainer>
  );
}
