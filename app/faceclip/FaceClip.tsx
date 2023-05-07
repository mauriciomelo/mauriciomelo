"use client";
import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-webgpu";
import * as faceDetection from "@tensorflow-models/face-detection";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import * as d3 from "d3";
import React from "react";

const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

const estimationConfig = { flipHorizontal: false } as const;

const photoList = ["/woman.png", "/boy.png"];
export function FaceClip() {
  const imageRef = React.useRef<HTMLImageElement>();
  const detectorPromiseRef =
    React.useRef<Promise<faceDetection.FaceDetector>>();
  const imageContainerRef = React.useRef<HTMLImageElement>();
  const [imagePath, setImagePath] = React.useState(photoList[0]);

  const [faces, setFaces] = React.useState<faceDetection.Face[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        detectorPromiseRef.current =
          detectorPromiseRef.current || createDetector();

        const [img, detector] = await Promise.all([
          createImageNodeFromURL(imagePath),
          detectorPromiseRef.current,
        ]);

        imageRef.current = img;
        const faces = await detector.estimateFaces(img, estimationConfig);
        setFaces(faces);
      } catch (error) {
        setFaces([]);
      }
    })();
  }, [imagePath]);

  const hasFaces = Boolean(faces.length);

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

      const imageNaturalWidth = imageRef.current.naturalWidth;

      image.attr("width", `${scale(imageNaturalWidth)}px`);
      image.attr("y", scale(-boundingBoxStyle(face).top));
      image.attr("x", scale(-boundingBoxStyle(face).left));
    });
  }, [faces]);

  return (
    <div>
      <h1>Face Clip</h1>

      <div className="mt-8 flex flex-wrap p-3">
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

      <ImageGallery
        items={photoList.map((src) => ({
          original: src,
          thumbnail: src,
        }))}
        onSlide={(index) => setImagePath(photoList[index])}
        showFullscreenButton={false}
        thumbnailPosition="top"
        renderItem={(item) => {
          return (
            <div className="relative">
              {hasFaces &&
                faces.map((face, i) => (
                  <div
                    key={i}
                    className="absolute border-2 border-solid border-white"
                    style={boundingBoxStyle(
                      face,
                      d3
                        .scaleLinear()
                        .range([
                          0,
                          imageContainerRef.current.getBoundingClientRect()
                            .width,
                        ])
                        .domain([0, imageRef.current.naturalWidth])
                    )}
                  />
                ))}

              <img ref={imageContainerRef} src={item.original} />
            </div>
          );
        }}
      />
    </div>
  );
}

function createDetector(): Promise<faceDetection.FaceDetector> {
  return faceDetection.createDetector(model, {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
    maxFaces: 20,
  });
}

function createImageNodeFromURL(url: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = document.createElement("img");
    img.src = url;
    img.onload = () => resolve(img);
  });
}

function boundingBoxStyle(face: faceDetection.Face, scale = (x: number) => x) {
  const scaleFace = true;

  const faceWidth = face.box.width * (scaleFace ? 2 : 1);
  const faceHeight = face.box.height * (scaleFace ? 2 : 1);

  return {
    width: scale(faceWidth),
    height: scale(faceHeight),
    left: scale(face.box.xMin - (scaleFace ? faceWidth / 4 : 0)),
    top: scale(face.box.yMin - (scaleFace ? faceHeight / 3 : 0)),
  };
}
