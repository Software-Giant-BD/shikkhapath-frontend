"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={cn(
      "p-2 rounded-md transition-colors hover:bg-slate-100 text-slate-600",
      isActive && "bg-blue-50 text-blue-600 hover:bg-blue-100"
    )}
  >
    {children}
  </button>
);

const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
    };
  },
});

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write description here...",
  className,
}: RichTextEditorProps) {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "link" | "image";
    url: string;
    alt: string;
  }>({
    isOpen: false,
    type: "link",
    url: "",
    alt: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CustomLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 underline underline-offset-4 hover:text-indigo-700 transition-colors cursor-pointer",
        },
      }),
      Image.configure({
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none max-w-none min-h-[150px] p-4",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setModal({
      isOpen: true,
      type: "link",
      url: previousUrl,
      alt: editor.getAttributes("link").title || "",
    });
  };

  const openImageModal = () => {
    setModal({
      isOpen: true,
      type: "image",
      url: "",
      alt: "",
    });
  };

  const handleModalSubmit = () => {
    if (modal.type === "link") {
      let { url, alt } = modal;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        // Auto-add protocol if missing
        if (!/^https?:\/\//i.test(url) && !url.startsWith("/") && !url.startsWith("#") && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
          url = `https://${url}`;
        }

        // If selection is empty, insert the URL as text
        if (editor.state.selection.empty) {
          const linkText = alt || url;
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${url}" title="${alt}">${linkText}</a>`)
            .run();
        } else {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url, title: alt })
            .run();
        }
      }
    } else if (modal.type === "image") {
      if (modal.url) {
        editor
          .chain()
          .focus()
          .setImage({ src: modal.url, alt: modal.alt })
          .run();
      }
    }
    setModal({ ...modal, isOpen: false });
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 overflow-hidden transition-all focus-within:border-blue-500 focus-within:bg-white relative",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-1 p-2 border-b-2 border-slate-100 bg-slate-50/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        <ToolbarButton
          onClick={openLinkModal}
          isActive={editor.isActive("link")}
          title="Link"
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={openImageModal}
          title="Insert Image URL"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="flex-grow" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />

      {/* Modern Modal */}
      {modal.isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setModal({ ...modal, isOpen: false })}
        >
          <div 
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {modal.type === "link" ? <Link2 className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                </div>
                <h3 className="font-black text-slate-800 tracking-tight">
                  {modal.type === "link" ? "লিঙ্ক যুক্ত করুন" : "ছবি যুক্ত করুন"}
                </h3>
              </div>
              <button 
                onClick={() => setModal({ ...modal, isOpen: false })} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ইউআরএল (URL)</label>
                <Input
                  autoFocus
                  placeholder="https://example.com"
                  value={modal.url}
                  onChange={(e) => setModal({ ...modal, url: e.target.value })}
                  className="rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-indigo-500/10 transition-all h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  {modal.type === "link" ? "টাইটেল (Title)" : "অল্ট টেক্সট (Alt Text)"}
                </label>
                <Input
                  placeholder={modal.type === "link" ? "লিঙ্ক এর নাম" : "ছবির বর্ণনা"}
                  value={modal.alt}
                  onChange={(e) => setModal({ ...modal, alt: e.target.value })}
                  className="rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:ring-indigo-500/10 transition-all h-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleModalSubmit();
                  }}
                />
              </div>
              <div className="pt-2 flex gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="flex-1 rounded-2xl h-12 font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
                >
                  বাতিল
                </Button>
                <Button 
                  type="button"
                  onClick={handleModalSubmit}
                  className="flex-1 rounded-2xl h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  নিশ্চিত করুন
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

