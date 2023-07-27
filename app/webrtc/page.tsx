"use client";
import { Box, Button, ButtonGroup, Container } from "@mui/material";
import React from "react";

const FILE_EXTENSION = "myapp";

export default function WebRTCPage() {
  const [connected, setConnected] = React.useState(false);
  const [counter, setCounter] = React.useState<number>(0);
  const localConnection = React.useRef<RTCPeerConnection>();
  const dataChannel = React.useRef<RTCDataChannel>();
  const [localDescription, setLocalDescription] =
    React.useState<RTCSessionDescription>();

  const answerInviteRef = React.useRef<HTMLInputElement>();

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

    setLocalDescription(localConnection.current.localDescription);
  }

  function handleInviteToConnect() {
    createOffer();
  }

  React.useEffect(() => {
    if (localDescription) {
      const fileData = JSON.stringify(localDescription, null, 2);

      const blob = new Blob([fileData], {
        type: "application/${FILE_EXTENSION}",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName =
        localDescription.type === "offer" ? "invite to connect" : "answer";
      link.download = `${fileName}.${FILE_EXTENSION}`;

      link.click();
    }
  }, [localDescription]);

  const assignChannel = (channel: RTCDataChannel) => {
    channel.onopen = handleDataChannelStatusChange;
    channel.onmessage = handleMessage;
    channel.onclose = handleDataChannelStatusChange;
    dataChannel.current = channel;
  };

  const createOffer = () => {
    assignChannel(localConnection.current.createDataChannel("dataChannel"));

    localConnection.current.createOffer().then((description) => {
      localConnection.current.setLocalDescription(description);
    });
  };

  const createAnswer = () => {
    localConnection.current.ondatachannel = (event) => {
      assignChannel(event.channel);
    };

    localConnection.current.createAnswer().then((description) => {
      localConnection.current.setLocalDescription(description);
    });
  };

  const handleMessage = (event: MessageEvent) => {
    setCounter((count) => count + parseInt(event.data));
  };

  React.useEffect(() => {
    localConnection.current = new RTCPeerConnection();

    localConnection.current.oniceconnectionstatechange =
      handleIceConnectionStateChange;

    localConnection.current.onicecandidate = handleIceCandidate;

    return () => {
      console.log("Closing connection");
      if (dataChannel.current) {
        dataChannel.current.close();
      }
      localConnection.current.close();
    };
  }, []);

  const handleAnswerInvite = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files[0];

    const answer = new RTCSessionDescription(JSON.parse(await file.text()));

    localConnection.current.setRemoteDescription(answer);

    if (answer.type === "offer") {
      createAnswer();
    }

    console.log("uploaded", answer);
  };
  const handleChangeCounter = (number) => () => {
    dataChannel.current.send(number);
    setCounter((count) => count + number);
  };

  return (
    <Container>
      <div className="flex h-screen w-full flex-col bg-black pt-[200px] text-center text-white ">
        <h1 className="mb-4 text-5xl font-bold md:text-8xl">WebRTC Demo</h1>
        <Button
          variant="outlined"
          onClick={handleInviteToConnect}
          sx={{ mb: 4 }}
        >
          Invite to connect
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            answerInviteRef.current.click();
          }}
        >
          Answer Invite
        </Button>
        <Box sx={{ visibility: "hidden" }}>
          <input
            ref={answerInviteRef}
            type="file"
            accept={`.${FILE_EXTENSION}`}
            onChange={handleAnswerInvite}
          />
        </Box>
        {connected ? "Connected" : null}
        Counter: {counter}
        <Button onClick={handleChangeCounter(1)}>+1</Button>
        <Button onClick={handleChangeCounter(10)}>+10</Button>
      </div>
    </Container>
  );
}
