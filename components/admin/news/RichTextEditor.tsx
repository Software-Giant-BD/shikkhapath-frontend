"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading,
  ImagePlus,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  PlaySquare,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";

import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolbarButtonProps = {
  title: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
};

function ToolbarButton({ title, isActive = false, onClick, disabled = false, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-slate-600 transition",
        "hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40",
        isActive ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder = "Write your content..." }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      Image.configure({
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "news-editor__content",
      },
    },
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = value || "";
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, value]);

  const currentFormat = (() => {
    if (!editor) {
      return "paragraph";
    }

    if (editor.isActive("heading", { level: 2 })) {
      return "h2";
    }

    if (editor.isActive("heading", { level: 3 })) {
      return "h3";
    }

    if (editor.isActive("blockquote")) {
      return "blockquote";
    }

    return "paragraph";
  })();

  const applyFormat = (format: string) => {
    if (!editor) {
      return;
    }

    const chain = editor.chain().focus();
    if (format === "paragraph") {
      chain.setParagraph().run();
      return;
    }

    if (format === "h2") {
      chain.toggleHeading({ level: 2 }).run();
      return;
    }

    if (format === "h3") {
      chain.toggleHeading({ level: 3 }).run();
      return;
    }

    if (format === "blockquote") {
      chain.toggleBlockquote().run();
    }
  };

  const setLink = () => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl || "https://");

    if (url === null) {
      return;
    }

    const trimmed = url.trim();
    if (!trimmed) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: trimmed }).run();
  };

  const setImage = () => {
    if (!editor) {
      return;
    }

    const imageUrl = window.prompt("Image URL", "https://");
    if (!imageUrl) {
      return;
    }

    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
  };

  const setYoutubeVideo = () => {
    if (!editor) {
      return;
    }

    const videoUrl = window.prompt("YouTube URL", "https://www.youtube.com/watch?v=");
    if (!videoUrl) {
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: videoUrl.trim() }).run();
  };

  return (
    <div className="news-editor overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-2">
        <div className="min-w-35">
          <label className="sr-only" htmlFor="editor-format">Text format</label>
          <select
            id="editor-format"
            value={currentFormat}
            onChange={(event) => applyFormat(event.target.value)}
            className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="blockquote">Quote</option>
          </select>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <ToolbarButton
          title="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
          disabled={!editor?.can().chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
          disabled={!editor?.can().chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          isActive={editor?.isActive("underline")}
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <div className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-2">
          <label className="sr-only" htmlFor="editor-color">Text color</label>
          <input
            id="editor-color"
            type="color"
            title="Text color"
            className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()}
            value={(editor?.getAttributes("textStyle").color as string | undefined) || "#000000"}
          />
        </div>

        <ToolbarButton title="Clear formatting" onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser size={15} />
        </ToolbarButton>

        <div className="h-6 w-px bg-slate-200" />

        <ToolbarButton
          title="Align left"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          isActive={editor?.isActive({ textAlign: "left" })}
        >
          <AlignLeft size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Align center"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          isActive={editor?.isActive({ textAlign: "center" })}
        >
          <AlignCenter size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Align right"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          isActive={editor?.isActive({ textAlign: "right" })}
        >
          <AlignRight size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Justify"
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          isActive={editor?.isActive({ textAlign: "justify" })}
        >
          <AlignJustify size={15} />
        </ToolbarButton>

        <div className="h-6 w-px bg-slate-200" />

        <ToolbarButton
          title="Bullet list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
        >
          <List size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Number list"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Decrease indent"
          onClick={() => editor?.chain().focus().liftListItem("listItem").run()}
          disabled={!editor?.can().chain().focus().liftListItem("listItem").run()}
        >
          <IndentDecrease size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Increase indent"
          onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}
          disabled={!editor?.can().chain().focus().sinkListItem("listItem").run()}
        >
          <IndentIncrease size={15} />
        </ToolbarButton>

        <div className="h-6 w-px bg-slate-200" />

        <ToolbarButton
          title="Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive("blockquote")}
        >
          <Quote size={15} />
        </ToolbarButton>

        <ToolbarButton title="Set paragraph" onClick={() => editor?.chain().focus().setParagraph().run()}>
          <Pilcrow size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive("heading", { level: 2 })}
        >
          <Heading size={15} />
        </ToolbarButton>

        <div className="h-6 w-px bg-slate-200" />

        <ToolbarButton title="Insert link" onClick={setLink} isActive={editor?.isActive("link")}>
          <Link2 size={15} />
        </ToolbarButton>

        <ToolbarButton title="Insert image" onClick={setImage}>
          <ImagePlus size={15} />
        </ToolbarButton>

        <ToolbarButton title="Insert video" onClick={setYoutubeVideo}>
          <PlaySquare size={15} />
        </ToolbarButton>

        <div className="h-6 w-px bg-slate-200" />

        <ToolbarButton
          title="Undo"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().chain().focus().undo().run()}
        >
          <Undo2 size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().chain().focus().redo().run()}
        >
          <Redo2 size={15} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="news-editor__inner" />
    </div>
  );
}
