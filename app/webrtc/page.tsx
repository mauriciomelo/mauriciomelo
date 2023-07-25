"use client";
import { useEffect, useRef, useState } from "react";

export default function WebRTCPage() {
  const [connected, setConnected] = useState(false);
  const localConnection = useRef<RTCPeerConnection>();
  const dataChannel = useRef<RTCDataChannel>();

  function handleDataChannelStatusChange(event) {
    if (!dataChannel.current) {
      return;
    }

    const state = dataChannel.current.readyState;
    console.log("DataChannelStatus", state);

    if (state === "open") {
      setConnected(true);
    }
  }

  function handleIceConnectionStateChange() {
    const state = localConnection.current.iceConnectionState;
    console.log("IceConnectionState", state);
  }

  function handleIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      return;
    }

    console.log({
      iceCandidateEvent: event,
      localDescription: localConnection.current.localDescription,
    });
  }

  useEffect(() => {
    localConnection.current = new RTCPeerConnection();
    dataChannel.current =
      localConnection.current.createDataChannel("dataChannel");

    localConnection.current.oniceconnectionstatechange =
      handleIceConnectionStateChange;

    localConnection.current.onicecandidate = handleIceCandidate;

    localConnection.current.createOffer().then((offer) => {
      localConnection.current.setLocalDescription(offer);
    });
    dataChannel.current.onopen = handleDataChannelStatusChange;
    dataChannel.current.onclose = handleDataChannelStatusChange;

    return () => {
      console.log("Closing connection");
      dataChannel.current.close();
      localConnection.current.close();
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-black pt-[200px] text-center text-white ">
      <h1 className="mb-4 text-5xl font-bold md:text-8xl">WebRTC Demo</h1>

      {connected ? "Connected" : null}
    </div>
  );
}
