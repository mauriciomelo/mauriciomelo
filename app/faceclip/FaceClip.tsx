/* eslint-disable @next/next/no-img-element */
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
import produce from "immer";

const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

const imageList = ["mona_lisa.jpg", "/woman.png", "/boy.png"];

type ImageWithFaces = { img: HTMLImageElement; faces: faceDetection.Face[] };
export function FaceClip() {
  const galleryRef = React.useRef();
  const detectorPromiseRef =
    React.useRef<Promise<faceDetection.FaceDetector>>();
  const imageContainerRef = React.useRef<(HTMLImageElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const [images, setImages] = React.useState<ImageWithFaces[]>([]);
  const faces = React.useMemo(
    () =>
      images
        .flatMap(({ img, faces }) => faces.map((face) => ({ img, face })))
        .reverse(),
    [images],
  );

  const createImages = React.useCallback(async (urlList: string[]) => {
    let resolvedImages: ImageWithFaces[] = [];

    detectorPromiseRef.current = detectorPromiseRef.current || createDetector();
    for (let url of urlList) {
      const [img, detector] = await Promise.all([
        createImageNodeFromURL(url),
        detectorPromiseRef.current,
      ]);
      const faces = await detector.estimateFaces(img, {
        flipHorizontal: false,
      });
      resolvedImages.push({ img, faces });
    }

    return resolvedImages;
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        setImages(await createImages(imageList));
      } catch (error) {
        console.error(error);
        setImages([]);
      }
    })();
  }, [setImages, createImages]);

  React.useEffect(() => {
    faces.forEach(({ face, img }, index) => {
      const svg = d3.select(`svg#faceSvg-${index}`);
      const image = svg.select("image");

      const scale = d3
        .scaleLinear()
        .range([0, 100])
        .domain([0, expandFaceBox(face.box).width]);

      svg.attr("width", 150);
      svg.attr("height", 150);

      const imageNaturalWidth = img.naturalWidth;

      image.attr("width", `${scale(imageNaturalWidth)}px`);
      image.attr("y", scale(-expandFaceBox(face.box).yMin) || 0);
      image.attr("x", scale(-expandFaceBox(face.box).xMin) || 0);
    });
  }, [faces]);

  const addFiles = React.useCallback(
    (files: File[]) => {
      if (files.length) {
        const urlList = files.map((file) => URL.createObjectURL(file));
        createImages(urlList).then((newImages) => {
          const updatedImages = images.concat(newImages);
          setImages(updatedImages);
        });
      }
    },
    [createImages, images],
  );

  const handleImageUpload = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const { files } = event.target;
      addFiles(Array.from(files || []));
    },
    [addFiles],
  );

  const slideToIndex = (index: number) => {
    // @ts-expect-error
    galleryRef.current?.slideToIndex(index);
  };

  React.useEffect(() => {
    slideToIndex(images.length - 1);
  }, [images]);

  const currentImage = images[currentIndex];
  const displayedImageNode = imageContainerRef.current[currentIndex];

  const dropHandler: React.DragEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      event.preventDefault();

      if (event.dataTransfer.items) {
        const files = Array.from(event.dataTransfer.items)
          .filter((item) => item.kind === "file")
          .map((item) => item.getAsFile()) as File[];
        addFiles(files);
      } else {
        addFiles(Array.from(event.dataTransfer.files));
      }
    },
    [addFiles],
  );

  const dragOverHandler: React.DragEventHandler<HTMLDivElement> =
    React.useCallback((event) => {
      event.preventDefault();
    }, []);

  return (
    <div onDrop={dropHandler} onDragOver={dragOverHandler}>
      {!!currentImage?.faces.length &&
        !!displayedImageNode &&
        currentImage.faces.map((face, faceIndex) => (
          <div
            key={faceIndex}
            className="pointer-events-none absolute z-10 rounded-full border-2 border-solid border-white opacity-60 transition-all duration-300"
            style={boundingBoxStyle({
              img: currentImage.img,
              face,
              imageNode: displayedImageNode,
            })}
          />
        ))}
      <div className="flex h-[100vh] flex-col justify-between">
        <h1>Face Clip</h1>

        <div className="mt-8 flex  flex-col flex-wrap overflow-x-auto p-3">
          {faces.map(({ img }, index) => (
            <svg
              key={index}
              width="100mm"
              height="100mm"
              viewBox="0 0 100 100"
              version="1.1"
              id={`faceSvg-${index}`}
              onClick={() => {
                slideToIndex(images.findIndex((image) => image.img === img));
              }}
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

              {img && (
                <image
                  width={`${img.getBoundingClientRect().width}px`}
                  clipPath="url(#clipPath)"
                  preserveAspectRatio="none"
                  xlinkHref={img.src}
                />
              )}
            </svg>
          ))}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex">
          <ImageGallery
            ref={galleryRef as any}
            items={images.map(({ img }, index) => ({
              original: img.src,
              thumbnail: img.src,
              index,
            }))}
            onSlide={(index) => setCurrentIndex(index)}
            showFullscreenButton={false}
            thumbnailPosition="top"
            showThumbnails={false}
            renderItem={(item) => {
              return (
                <div className=" relative flex h-[50vh] w-[100vw] items-center justify-center ">
                  <img
                    ref={(element) => {
                      // @ts-expect-error
                      const index = item.index;
                      imageContainerRef.current[index] = element;
                      return undefined;
                    }}
                    alt=""
                    className="max-h-full object-contain"
                    src={item.original}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

function createDetector(): Promise<faceDetection.FaceDetector> {
  return faceDetection.createDetector(model, {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
    modelType: "full",
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

function expandFaceBox(box: faceDetection.Face["box"]) {
  return produce(box, (draft) => {
    const width = draft.width * 2;
    const height = draft.height * 2;
    draft.width = width;
    draft.height = height;
    draft.xMin = draft.xMin - width / 4;
    draft.yMin = draft.yMin - height / 3;
  });
}

function boundingBoxStyle({
  img,
  face,
  imageNode,
}: {
  face: faceDetection.Face;
  img: ImageWithFaces["img"];
  imageNode: HTMLImageElement;
}) {
  const imageNodeClientRect = imageNode.getBoundingClientRect();
  const scale = d3
    .scaleLinear()
    .range([0, imageNodeClientRect.width])
    .domain([0, img.naturalWidth]);

  const expand = true;
  const expandedBox = expand ? expandFaceBox(face.box) : face.box;

  return {
    width: scale(expandedBox.width),
    height: scale(expandedBox.height),
    left: scale(expandedBox.xMin) || 0 + imageNodeClientRect.left,
    top: scale(expandedBox.yMin) || 0 + imageNodeClientRect.top,
  };
}
