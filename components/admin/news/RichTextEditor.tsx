"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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
  Upload,
  X,
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
import { mergeAttributes, Node } from "@tiptap/core";

import { getMediaItems, saveMediaItems } from "@/lib/admin/media-library";
import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { uploadImageAction } from "@/lib/api/image-actions";
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

type MediaDialogType = "image" | "video" | "link";

const DEFAULT_IMAGE_WIDTH = "1200";
const DEFAULT_IMAGE_HEIGHT = "675";

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
});

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

const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      controls: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes({ controls: "controls" }, HTMLAttributes)];
  },
});

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

function getDefaultAltText(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read selected file"));
    reader.readAsDataURL(file);
  });
}

export function RichTextEditor({ value, onChange, placeholder = "Write your content..." }: RichTextEditorProps) {
  const [dialogType, setDialogType] = useState<MediaDialogType | null>(null);
  const [source, setSource] = useState("");
  const [altText, setAltText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isSavingMedia, setIsSavingMedia] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      ResizableImage.configure({
        allowBase64: true,
      }),
      VideoNode,
      CustomLink.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-indigo-600 underline underline-offset-4 hover:text-indigo-700 transition-colors cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
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

  function closeMediaDialog() {
    setDialogType(null);
    setSource("");
    setAltText("");
    setWidth("");
    setHeight("");
    setSelectedFile(null);
    setUploadError("");
    setIsSavingMedia(false);
    setIsMediaPickerOpen(false);
  }

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = value || "";
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!dialogType) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMediaDialog();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialogType]);

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

  const openMediaDialog = (type: MediaDialogType) => {
    setDialogType(type);
    setUploadError("");
  };

  const onPickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError("");

    if (file && !source) {
      setSource(file.name);
    }

    if (file && dialogType === "image") {
      setWidth(DEFAULT_IMAGE_WIDTH);
      setHeight(DEFAULT_IMAGE_HEIGHT);
      setAltText(getDefaultAltText(file.name));
    }
  };

  const uploadSelectedImage = async (file: File) => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder_id", "");

    const result = await uploadImageAction(payload);
    if (!result.ok || !result.item?.url) {
      throw new Error(result.message || "Failed to upload image.");
    }

    const nextItem = {
      ...result.item,
      type: "image" as const,
    };
    const existingItems = getMediaItems();
    const nextItems = [
      nextItem,
      ...existingItems.filter((item) => item.id !== nextItem.id),
    ];

    saveMediaItems(nextItems);

    return result.item.url;
  };

  const getMediaSrc = async () => {
    const inputSource = source.trim();
    if (selectedFile) {
      if (dialogType === "image") {
        return await uploadSelectedImage(selectedFile);
      }

      return await fileToDataUrl(selectedFile);
    }

    return inputSource;
  };

  const saveMedia = async () => {
    if (!editor || !dialogType) {
      return;
    }

    setIsSavingMedia(true);
    setUploadError("");

    try {
      const src = await getMediaSrc();
      if (!src) {
        setUploadError("Source or file is required.");
        setIsSavingMedia(false);
        return;
      }

      const mediaWidth = width.trim() ? Number(width.trim()) : undefined;
      const mediaHeight = height.trim() ? Number(height.trim()) : undefined;

      if (dialogType === "image") {
        editor
          .chain()
          .focus()
          .setImage({
            src,
            alt: altText.trim() || null,
            width: mediaWidth,
            height: mediaHeight,
          })
          .run();
      } else if (dialogType === "video") {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "video",
            attrs: {
              src,
              width: mediaWidth,
              height: mediaHeight,
              controls: true,
            },
          })
          .run();
      } else if (dialogType === "link") {
        if (src === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
          let url = src;
          // Auto-add protocol if missing
          if (!/^https?:\/\//i.test(url) && !url.startsWith("/") && !url.startsWith("#") && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
            url = `https://${url}`;
          }

          if (editor.state.selection.empty) {
            const linkText = altText.trim() || url;
            editor
              .chain()
              .focus()
              .insertContent(`<a href="${url}" title="${altText.trim()}">${linkText}</a>`)
              .run();
          } else {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url, title: altText.trim() })
              .run();
          }
        }
      }

      closeMediaDialog();
    } catch {
      setUploadError("Failed to process selected file. Try another file.");
      setIsSavingMedia(false);
    }
  };

  const setLink = () => {
    if (!editor) {
      return;
    }

    const previousUrl = (editor.getAttributes("link").href as string) || "";
    const previousTitle = (editor.getAttributes("link").title as string) || "";

    setSource(previousUrl);
    setAltText(previousTitle);
    setDialogType("link");
    setUploadError("");
  };

  return (
    <>
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

          <ToolbarButton title="Insert image" onClick={() => openMediaDialog("image")}>
            <ImagePlus size={15} />
          </ToolbarButton>

          <ToolbarButton title="Insert video" onClick={() => openMediaDialog("video")}>
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

      {dialogType ? (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            onClick={closeMediaDialog}
            aria-label="Close media dialog"
          />

          <div className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-slate-800">
                {dialogType === "image" ? "Select Image" : dialogType === "video" ? "Select Video" : "Add Link"}
              </h3>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={closeMediaDialog}
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="media-source">{dialogType === "link" ? "URL" : "Source"}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="media-source"
                    value={source}
                    placeholder={
                      dialogType === "link"
                        ? "https://example.com"
                        : dialogType === "image"
                          ? "https://example.com/photo.jpg"
                          : "https://example.com/video.mp4"
                    }
                    onChange={(event) => setSource(event.target.value)}
                  />
                  {dialogType !== "link" && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={dialogType === "image" ? "image/*" : "video/*"}
                        className="hidden"
                        onChange={onPickFile}
                      />
                      <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={14} />
                        Upload
                      </Button>
                      <Button type="button" variant="secondary" onClick={() => setIsMediaPickerOpen(true)}>
                        Media Center
                      </Button>
                    </>
                  )}
                </div>
                {selectedFile && dialogType !== "link" ? (
                  <p className="text-xs text-emerald-700">Selected: {selectedFile.name}</p>
                ) : null}
              </div>

              {dialogType === "image" || dialogType === "link" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="media-alt">
                    {dialogType === "link" ? "Title / Display Text" : "Alternative description"}
                  </Label>
                  <Input
                    id="media-alt"
                    value={altText}
                    onChange={(event) => setAltText(event.target.value)}
                    placeholder={dialogType === "link" ? "Enter link text or title" : "Describe the image"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void saveMedia();
                    }}
                  />
                </div>
              ) : null}

              {dialogType !== "link" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="media-width">Width</Label>
                    <Input
                      id="media-width"
                      value={width}
                      onChange={(event) => setWidth(event.target.value)}
                      placeholder="e.g. 720"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="media-height">Height</Label>
                    <Input
                      id="media-height"
                      value={height}
                      onChange={(event) => setHeight(event.target.value)}
                      placeholder="e.g. 420"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              ) : null}

              {uploadError ? (
                <p className="text-sm font-medium text-rose-600">{uploadError}</p>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={closeMediaDialog} disabled={isSavingMedia}>
                Cancel
              </Button>
              <Button type="button" onClick={() => void saveMedia()} disabled={isSavingMedia}>
                {isSavingMedia ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {dialogType ? (
        <MediaPickerDialog
          isOpen={isMediaPickerOpen}
          mediaType={dialogType}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(item) => {
            setSource(item.url);
            if (dialogType === "image") {
              setWidth(DEFAULT_IMAGE_WIDTH);
              setHeight(DEFAULT_IMAGE_HEIGHT);
              setAltText(getDefaultAltText(item.name));
            }
            setSelectedFile(null);
            setIsMediaPickerOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
