"use client";
import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import React from "react";

const FILE_EXTENSION = "myapp";

export default function WebRTCPage() {
  const [counter, setCounter] = React.useState<number>(0);

  const answerInviteRef = React.useRef<HTMLInputElement>();

  const {
    localConnection,
    dataChannel,
    localDescription,
    createOffer,
    createAnswer,
    connected,
  } = useWebRTC({
    onMessage(event) {
      setCounter((count) => count + parseInt(event.data));
    },
  });

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

  const handleAnswerInvite = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target?.files?.[0];

    if (!file) {
      console.error("No invite file found");
      return;
    }
    const answer = new RTCSessionDescription(JSON.parse(await file.text()));

    localConnection?.setRemoteDescription(answer);

    if (answer.type === "offer") {
      createAnswer();
    }

    console.log("uploaded", answer);
  };
  const handleChangeCounter = (number) => {
    dataChannel?.send(number);
    setCounter((count) => count + number);
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" component="h1" sx={{ my: 8 }}>
        WebRTC Demo
      </Typography>
      <Button variant="outlined" onClick={handleInviteToConnect} sx={{ mb: 4 }}>
        Invite to connect
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          answerInviteRef.current?.click();
        }}
      >
        Answer Invite
      </Button>
      <Box
        component="input"
        sx={{ visibility: "hidden" }}
        ref={answerInviteRef}
        type="file"
        accept={`.${FILE_EXTENSION}`}
        onChange={handleAnswerInvite}
      />
      {connected ? (
        <>
          <Typography sx={{ color: "success.main" }}>Connected</Typography>

          <Counter value={counter} onChange={handleChangeCounter} />
        </>
      ) : null}
    </Container>
  );
}

function Counter({
  onChange,
  value,
}: {
  value: number;
  onChange: (number) => void;
}) {
  return (
    <>
      <Typography sx={{ my: 4 }}>Counter: {value}</Typography>
      <ButtonGroup>
        <Button onClick={() => onChange(1)}>+1</Button>
        <Button onClick={() => onChange(10)}>+10</Button>
      </ButtonGroup>
    </>
  );
}

function useWebRTC({
  onMessage,
}: {
  onMessage: (event: MessageEvent) => void;
}) {
  const [connected, setConnected] = React.useState(false);

  const [localConnection, setLocalConnection] =
    React.useState<RTCPeerConnection>();
  const [dataChannel, setDataChannel] = React.useState<RTCDataChannel | null>(
    null
  );

  const [localDescription, setLocalDescription] =
    React.useState<RTCSessionDescription | null>();

  const handleDataChannelStatusChange = React.useCallback(function (event) {
    const dataChannel = this;

    const state = dataChannel.readyState;
    console.log("DataChannelStatus", state);

    if (state === "open") {
      setConnected(true);
    }
  }, []);

  const assignDataChannelCallbacks = React.useCallback(
    (channel: RTCDataChannel) => {
      channel.onopen = handleDataChannelStatusChange;
      channel.onclose = handleDataChannelStatusChange;
      channel.onmessage = onMessage;
    },
    [handleDataChannelStatusChange, onMessage]
  );

  const createOffer = React.useCallback(() => {
    if (!localConnection) {
      return;
    }

    const channel = localConnection.createDataChannel("dataChannel");
    assignDataChannelCallbacks(channel);
    setDataChannel(channel);

    localConnection.createOffer().then((description) => {
      localConnection.setLocalDescription(description);
    });
  }, [assignDataChannelCallbacks, localConnection]);

  const createAnswer = React.useCallback(() => {
    if (!localConnection) {
      console.error("no local connection");
      return;
    }

    localConnection.createAnswer().then((description) => {
      localConnection.setLocalDescription(description);
    });
  }, [localConnection]);

  React.useEffect(() => {
    const connection = new RTCPeerConnection();
    connection.signalingState;
    connection.oniceconnectionstatechange = () => {
      const state = connection.iceConnectionState;
      console.log("IceConnectionState", state);
    };

    connection.ondatachannel = (event) => {
      assignDataChannelCallbacks(event.channel);
      setDataChannel(event.channel);
    };

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        return;
      }
      setLocalDescription(connection?.localDescription);
    };
    setLocalConnection(connection);

    return () => {
      console.log("Closing connection");
      connection.close();
    };
  }, []);

  return {
    localConnection,
    dataChannel,
    createOffer,
    createAnswer,
    localDescription,
    connected,
  };
}
