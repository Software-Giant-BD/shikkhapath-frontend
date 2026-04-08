"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
        heading: {
          levels: [2, 3],
        },
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

  return (
    <div className="news-editor overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2">
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
          title="Heading"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor?.isActive("heading", { level: 2 })}
        >
          <Heading2 size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
        >
          <List size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered List"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <ToolbarButton
          title="Block Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive("blockquote")}
        >
          <Quote size={15} />
        </ToolbarButton>

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

      <div className="relative">
        {editor?.isEmpty ? (
          <span className="pointer-events-none absolute left-4 top-3 text-sm text-slate-400">{placeholder}</span>
        ) : null}
        <EditorContent editor={editor} className="news-editor__inner" />
      </div>
    </div>
  );
}
