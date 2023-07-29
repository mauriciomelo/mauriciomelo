/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { FaceClip } from "./FaceClip";

export default {
  title: "ComputerVision/FaceClip",
  component: FaceClip,
};

export function FaceDetector() {
  return <FaceClip />;
}
