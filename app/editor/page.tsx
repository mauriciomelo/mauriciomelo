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

const initProgressCallback = (initProgress: unknown) => {
  console.log(initProgress);
};

const selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC";

const systemPrompt = `
You are a helpful Editor. Suggest grammar, syntax, structure, and spelling corrections for the following text. Suggest appropriate lexical chunks and collocations to make the text sound more authentically English (US). The revised text should be wrapped in <revised>text</revised>
`;

export default function EditorPage() {
  const [originalText, setOriginalText] = useState("");

  const editorChunks = useCompletionChunks();
  const changedChunks = useCompletionChunks();

  const extractRevisedTextPrompt = {
    role: "user",
    content: "Now extract only the revised text.",
  } satisfies ChatCompletionMessageParam;

  const messages = useMemo(() => {
    return [
      { role: "system", content: systemPrompt },
      { role: "user", content: originalText },
    ] satisfies ChatCompletionMessageParam[];
  }, [originalText]);

  const engineQuery = useQuery({
    queryKey: ["engine"],
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

  const messagesWithExtract = useMemo(() => {
    return [
      ...messages,
      { content: editQuery.data, role: "assistant" },
      extractRevisedTextPrompt,
    ] satisfies ChatCompletionMessageParam[];
  }, [editQuery.data, extractRevisedTextPrompt, messages]);

  const extractQuery = useQuery({
    queryKey: ["extract"],
    enabled: false,
    queryFn: async () => {
      const chunks = await engineQuery.data?.chat.completions.create({
        messages: messagesWithExtract,
        stream: true,
        stream_options: { include_usage: true },
      });

      return changedChunks.of(chunks);
    },
  });

  const editorText = editorChunks.isLoading
    ? editorChunks.reply
    : editQuery.data;

  const handleClick = async () => {
    await editQuery.refetch();
    await extractQuery.refetch();
  };

  const getStatus = () => {
    if (engineQuery.isLoading) {
      return "Loading model...";
    }
    if (editQuery.isLoading) {
      return "Editing...";
    }

    if (extractQuery.isLoading) {
      return "Extracting";
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
          value={
            changedChunks.isLoading
              ? changedChunks.reply
              : extractQuery.data || ""
          }
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
  const [isLoading, setIsLoading] = useState(false);

  async function set(chunks?: AsyncIterable<ChatCompletionChunk>) {
    if (!chunks) {
      console.warn("no chunks defined");
      return;
    }
    setIsLoading(true);
    setReply("");

    let partial = "";

    for await (const chunk of chunks) {
      partial = `${partial}${chunk.choices[0]?.delta.content || ""}`;
      setReply(partial);
      if (chunk.usage) {
        setIsLoading(false);
      }
    }

    return partial;
  }

  return { of: set, reply, isLoading };
}
