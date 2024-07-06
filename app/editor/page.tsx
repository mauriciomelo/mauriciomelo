"use client";
import {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  CreateMLCEngine,
} from "@mlc-ai/web-llm";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CodeMirrorMerge from "react-codemirror-merge";
import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { Button } from "@/components/ui/button";
import "./codemirror.css";

const initProgressCallback = (initProgress: unknown) => {
  console.log(initProgress);
};

const selectedModel = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

const systemPrompt = `
You are a helpful Editor. Suggest grammar, syntax, structure, and spelling corrections for the following text. Suggest appropriate lexical chunks and collocations to make the text sound more authentically English (US). The revised text should be wrapped in <revised>text</revised>
`;

export default function EditorPage() {
  const [originalText, setOriginalText] = useState("hello world");

  const editorChunks = useCompletionChunks();

  const messages = useMemo(() => {
    return [
      { role: "system", content: systemPrompt },
      { role: "user", content: originalText },
    ] satisfies ChatCompletionMessageParam[];
  }, [originalText]);

  const engineQuery = useQuery({
    queryKey: ["engine"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: () =>
      CreateMLCEngine(selectedModel, {
        initProgressCallback: initProgressCallback,
      }),
  });

  const editQuery = useQuery({
    queryKey: ["edit"],
    enabled: false,
    queryFn: async () => {
      const chunks = await engineQuery.data?.chat.completions.create({
        messages,
        stream: true,
        stream_options: { include_usage: true },
      });

      return editorChunks.of(chunks);
    },
  });

  const editorText = editorChunks.isLoading
    ? editorChunks.reply
    : editQuery.data;

  const handleClick = async () => {
    await editQuery.refetch();
  };

  const getStatus = () => {
    if (engineQuery.isFetching) {
      return "Loading model...";
    }
    if (editQuery.isFetching) {
      return "Editing...";
    }

    return null;
  };
  return (
    <div className="p-5">
      <h1 className="text-2xl">Check your grammar. Offline. Private.</h1>
      <Button disabled={!!getStatus()} onClick={handleClick} className="my-5">
        {getStatus() || "Edit"}
      </Button>
      <CodeMirrorMerge theme="dark">
        <CodeMirrorMerge.Original
          value={originalText}
          onChange={(value) => setOriginalText(value)}
          extensions={[
            EditorView.editable.of(true),
            EditorView.lineWrapping,
            EditorState.readOnly.of(false),
          ]}
        />
        <CodeMirrorMerge.Modified
          value={editorChunks.revised}
          extensions={[
            EditorView.editable.of(true),
            EditorView.lineWrapping,
            EditorState.readOnly.of(false),
          ]}
        />
      </CodeMirrorMerge>

      {editorText && (
        <div>
          <h2 className="my-5 text-xl">Editor notes</h2>

          <pre className="whitespace-pre-wrap ">{editorText}</pre>
        </div>
      )}
    </div>
  );
}

function useCompletionChunks() {
  const [reply, setReply] = useState("");
  const [revised, setRevised] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function set(chunks?: AsyncIterable<ChatCompletionChunk>) {
    if (!chunks) {
      console.warn("no chunks defined");
      return;
    }
    setIsLoading(true);
    setReply("");
    setRevised("");

    let partial = "";
    let revised = "";

    const openTag = "<revised>";
    const closeTag = "</revised>";

    let openTagPos = 0;
    let closeTagPos = 0;

    let tagIsOpen = false;
    let tagIsClosed = false;

    for await (const chunk of chunks) {
      const content = chunk.choices[0]?.delta.content;

      if (!content) {
        continue;
      }

      for (const char of content) {
        if (!tagIsOpen && char === openTag.charAt(openTagPos)) {
          openTagPos += 1;
          tagIsOpen = openTag.length === openTagPos;
          continue;
        } else if (!tagIsOpen) {
          openTagPos = 0;
        }

        if (!tagIsClosed && char === closeTag.charAt(closeTagPos)) {
          closeTagPos += 1;
          tagIsClosed = closeTag.length === closeTagPos;
          continue;
        } else if (!tagIsClosed) {
          closeTagPos = 0;
        }

        if (tagIsOpen && !tagIsClosed) {
          revised = `${revised}${char || ""}`;
        }

        if (openTagPos < 1 || tagIsClosed) {
          partial = `${partial}${char || ""}`;
        }
      }

      setRevised(revised);
      setReply(partial);

      if (chunk.usage) {
        setIsLoading(false);
      }
    }

    return partial;
  }

  return { of: set, reply, revised, isLoading };
}
