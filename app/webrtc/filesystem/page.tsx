"use client";
import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import React from "react";
import { get, set } from "idb-keyval";
import { useInterval } from "usehooks-ts";

const offerFileName = "offer.json" as const;
const answerFileName = "answer.json" as const;
const appDirOptions = { mode: "readwrite" } as const;

export default function WebRTCPage() {
  const [counter, setCounter] = React.useState<number>(0);

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

  const [appDirHandle, setAppDirHandle] =
    React.useState<FileSystemDirectoryHandle>();
  const [loadingAppDir, setLoadingAppDir] = React.useState(true);
  const [permissionGranted, setPermissionGranted] = React.useState(false);

  function handleInviteToConnect() {
    createOffer();
  }

  React.useEffect(() => {
    if (!localDescription || !appDirHandle || !permissionGranted) return;

    const suffix =
      localDescription.type === "offer" ? offerFileName : answerFileName;

    const createFile = async () => {
      const fileName = `${await getOrCreateDeviceId()}.${suffix}`;
      const offerHandle = await appDirHandle.getFileHandle(fileName, {
        create: true,
      });
      const writable = await offerHandle.createWritable();

      const text = JSON.stringify(localDescription);
      await writable.write(text);
      await writable.close();
    };

    createFile();
  }, [localDescription, appDirHandle, permissionGranted]);

  const handleAnswerInvite = async (
    event: React.ChangeEvent<HTMLInputElement>,
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
  const handleChangeCounter = (number: number) => {
    dataChannel?.send(number.toString());
    setCounter((count) => count + number);
  };

  React.useEffect(() => {
    (async () => {
      console.log(`deviceId: ${await getOrCreateDeviceId()}`);
      let dirHandle = await get<FileSystemDirectoryHandle>("directory");

      if (dirHandle) {
        console.log("Previous directory loaded");
        setAppDirHandle(dirHandle);
        if (await verifyPermission(dirHandle)) {
          console.log("permission granted");
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
        }
      }

      setLoadingAppDir(false);
    })();
  }, []);

  const parseDescriptionFileHandle = async (entry: FileSystemFileHandle) =>
    await entry
      .getFile()
      .then((file) => file.text())
      .then((text) => new RTCSessionDescription(JSON.parse(text)));

  useInterval(async () => {
    if (!appDirHandle || !permissionGranted || !localConnection || connected)
      return;

    console.log("attempt connection");

    let offerEntry: FileSystemFileHandle | undefined;
    let answerEntry: FileSystemFileHandle | undefined;

    for await (const entry of appDirHandle.values()) {
      if (entry.name.includes(offerFileName) && entry.kind === "file") {
        offerEntry = entry;
      }
      if (entry.name.includes(answerFileName) && entry.kind === "file") {
        answerEntry = entry;
      }
    }

    const isOldAnswer = answerEntry && !localDescription;

    const sameOffer =
      offerEntry &&
      JSON.stringify(localDescription) ===
        JSON.stringify(await parseDescriptionFileHandle(offerEntry));

    const isOldOffer =
      offerEntry &&
      localDescription &&
      offerEntry.name.includes(await getOrCreateDeviceId()) &&
      !sameOffer;

    if (isOldAnswer || isOldOffer) {
      console.log("Deleting old answer");
      answerEntry && (await appDirHandle.removeEntry(answerEntry.name));
      offerEntry && (await appDirHandle.removeEntry(offerEntry.name));

      createOffer();
      return;
    }

    if (!answerEntry && !offerEntry) {
      createOffer();
      return;
    }

    if (offerEntry && !sameOffer) {
      localConnection?.setRemoteDescription(
        await parseDescriptionFileHandle(offerEntry),
      );

      createAnswer();
      return;
    }

    if (answerEntry) {
      localConnection?.setRemoteDescription(
        await parseDescriptionFileHandle(answerEntry),
      );
      return;
    }
  }, 1000);

  const handleOpenDirectory = async () => {
    const dirHandle = await window.showDirectoryPicker(appDirOptions);
    await set("directory", dirHandle);
    setAppDirHandle(dirHandle);
  };
  const handleRequestPermission = async () => {
    if (!appDirHandle) return;

    if (await requestPermission(appDirHandle)) {
      setPermissionGranted(true);
    } else {
      setAppDirHandle(undefined);
    }
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
      <Button
        variant="outlined"
        onClick={handleOpenDirectory}
        sx={{
          mb: 4,
          visibility: !loadingAppDir && !appDirHandle ? "visible" : "hidden",
        }}
      >
        Open Directory
      </Button>
      <Button
        variant="outlined"
        onClick={handleRequestPermission}
        sx={{
          mb: 4,
          visibility:
            !permissionGranted && !loadingAppDir && appDirHandle
              ? "visible"
              : "hidden",
        }}
      >
        Grant Permission
      </Button>

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
  onChange: (number: number) => void;
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
    null,
  );

  const [localDescription, setLocalDescription] =
    React.useState<RTCSessionDescription | null>();

  const handleDataChannelStatusChange = React.useCallback(
    function () {
      // @ts-expect-error
      const dataChannel = this as RTCDataChannel;

      const state = dataChannel.readyState;
      console.log("DataChannelStatus", state);

      if (state === "open") {
        setConnected(true);
      }

      if (state === "closed") {
        setConnected(false);
        setLocalDescription(null);
        localConnection?.restartIce();
      }
    },
    [localConnection],
  );

  const assignDataChannelCallbacks = React.useCallback(
    (channel: RTCDataChannel) => {
      channel.onopen = handleDataChannelStatusChange;
      channel.onclose = handleDataChannelStatusChange;
      channel.onmessage = onMessage;
    },
    [handleDataChannelStatusChange, onMessage],
  );

  const createOffer = React.useCallback(() => {
    if (!localConnection) {
      console.error("no local connection");
      return;
    }

    console.log("create offer");

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

    console.log("create answer");

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

async function verifyPermission(dirHandle: FileSystemDirectoryHandle) {
  return (await dirHandle.queryPermission(appDirOptions)) === "granted";
}

async function requestPermission(dirHandle: FileSystemDirectoryHandle) {
  return (await dirHandle.requestPermission(appDirOptions)) === "granted";
}
async function getOrCreateDeviceId() {
  let id = await get("deviceId");

  if (!id) {
    id = crypto.randomUUID();
    await set("deviceId", id);
  }
  return id;
}
