"use client";
import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-webgpu";
import * as faceDetection from "@tensorflow-models/face-detection";

import * as d3 from "d3";
import React from "react";

const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

const estimationConfig = { flipHorizontal: false } as const;

const detectorPromise = faceDetection.createDetector(model, {
  runtime: "mediapipe",
  solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
  maxFaces: 20,
  modelType: "full",
});

const photoList = ["/confidence.png", "/mona_lisa.jpg"];
export function FaceClip() {
  const imageRef = React.useRef<HTMLImageElement>();
  const [imagePath, setImagePath] = React.useState(photoList[0]);

  const [faces, setFaces] = React.useState<faceDetection.Face[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const img = await createImageNodeFromURL(imagePath);
        const detector = await detectorPromise;
        const faces = await detector.estimateFaces(img, estimationConfig);
        setFaces(faces);
        console.log({ faces, imageRef });
      } catch (error) {
        setFaces([]);
        console.log(error);
      }
    })();
  }, [imagePath]);

  const hasFaces = Boolean(faces.length);

  const boundingBoxStyle = React.useCallback(
    (face: faceDetection.Face) => {
      if (!hasFaces) {
        return {};
      }

      const scaleFace = true;

      const faceWidth = face.box.width * (scaleFace ? 2 : 1);
      const faceHeight = face.box.height * (scaleFace ? 2 : 1);

      return {
        width: faceWidth,
        height: faceHeight,
        left: face.box.xMin - (scaleFace ? faceWidth / 4 : 0),
        top: face.box.yMin - (scaleFace ? faceHeight / 3 : 0),
      };
    },
    [hasFaces]
  );

  React.useEffect(() => {
    faces.forEach((face, index) => {
      const svg = d3.select(`svg#faceSvg-${index}`);
      const image = svg.select("image");

      const scale = d3
        .scaleLinear()
        .range([0, 100])
        .domain([0, boundingBoxStyle(face).width]);

      svg.attr("width", 150);
      svg.attr("height", 150);

      image.attr(
        "width",
        `${scale(imageRef.current.getBoundingClientRect().width)}px`
      );
      image.attr("y", scale(-boundingBoxStyle(face).top));
      image.attr("x", scale(-boundingBoxStyle(face).left));
    });
  }, [faces, boundingBoxStyle]);

  return (
    <div>
      <h1>Face Clip</h1>

      <select
        className="text-black"
        onChange={(e) => setImagePath(e.target.value)}
        value={imagePath}
      >
        {photoList.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="flex">
        {faces.map((face, index) => (
          <svg
            key={index}
            width="100mm"
            height="100mm"
            viewBox="0 0 100 100"
            version="1.1"
            id={`faceSvg-${index}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="clipPath">
                <path
                  style={{ fill: "#fff", strokeWidth: 0.411003 }}
                  id="path408"
                  d="m 61.134979,73.5244 c 0.479655,-0.276929 -48.765837,-0.276931 -48.286182,-2e-6 0.479655,0.276929 -24.143089,-42.37092 -24.143089,-41.817062 0,0.553858 24.622748,-42.093988 24.143093,-41.817059 -0.479655,0.2769284 48.765837,0.2769308 48.286182,2e-6 -0.479655,-0.276929 24.143089,42.370919 24.143089,41.817062 0,-0.553858 -24.622748,42.093988 -24.143093,41.817059 z"
                  transform="matrix(1.0354929,0,0,1.0354929,11.695161,17.16728) "
                />
              </clipPath>
            </defs>

            {hasFaces && imageRef.current && (
              <image
                width={`${imageRef.current.getBoundingClientRect().width}px`}
                clipPath="url(#clipPath)"
                preserveAspectRatio="none"
                xlinkHref={imagePath}
              />
            )}
          </svg>
        ))}
      </div>

      <div className="relative">
        {hasFaces &&
          faces.map((face, i) => (
            <div
              key={i}
              className="absolute border-2 border-solid border-white"
              style={boundingBoxStyle(face)}
            />
          ))}

        <img ref={imageRef} src={imagePath} />
      </div>
    </div>
  );
}

function createImageNodeFromURL(url: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = document.createElement("img");
    img.src = url;
    img.onload = () => resolve(img);
  });
}
