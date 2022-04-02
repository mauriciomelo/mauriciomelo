import {
  OrbitControls as DreiOrbitControls,
  OrbitControlsProps,
} from "@react-three/drei";
import React from "react";
export const OrbitControls = (props: OrbitControlsProps) => (
  // @ts-ignore
  <DreiOrbitControls {...props} />
);
