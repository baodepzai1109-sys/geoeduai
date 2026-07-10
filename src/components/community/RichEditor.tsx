"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Heading1,
} from "lucide-react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    darkMode: boolean;
};

export default function RichEditor({
    value,
    onChange,
    darkMode,
}: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: "Bạn đang nghĩ gì về Địa lí hôm nay?",
            }),
        ],

        content: value,

        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },

        editorProps: {
            attributes: {
                class:
                    "prose max-w-none min-h-[260px] outline-none px-6 py-5",
            },
        },
    });

    if (!editor) return null;

    const button = (
        active: boolean,
        onClick: () => void,
        icon: React.ReactNode
    ) => (
        <button
            type="button"
            onClick={onClick}
            className={`
h-10
w-10
rounded-xl
flex
items-center
justify-center
transition

${
    active
        ? "bg-blue-600 text-white"
        : darkMode
        ? "hover:bg-[#183C67] text-white"
        : "hover:bg-gray-100 text-gray-700"
}
`}
        >
            {icon}
        </button>
    );

    return (
        <div
            className={`
overflow-hidden
rounded-3xl
border

${
    darkMode
        ? "bg-[#102A52] border-[#234D82]"
        : "bg-gray-50 border-gray-200"
}
`}
        >
            {/* Toolbar */}

            <div
                className={`
flex
flex-wrap
gap-2
border-b
p-3

${
    darkMode
        ? "border-[#234D82]"
        : "border-gray-200"
}
`}
            >
                {button(
                    editor.isActive("bold"),
                    () => editor.chain().focus().toggleBold().run(),
                    <Bold size={18} />
                )}

                {button(
                    editor.isActive("italic"),
                    () => editor.chain().focus().toggleItalic().run(),
                    <Italic size={18} />
                )}

                {button(
                    editor.isActive("underline"),
                    () => editor.chain().focus().toggleUnderline().run(),
                    <UnderlineIcon size={18} />
                )}

                {button(
                    editor.isActive("strike"),
                    () => editor.chain().focus().toggleStrike().run(),
                    <Strikethrough size={18} />
                )}

                {button(
                    editor.isActive("heading", { level: 1 }),
                    () =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run(),
                    <Heading1 size={18} />
                )}

                {button(
                    editor.isActive("bulletList"),
                    () =>
                        editor
                            .chain()
                            .focus()
                            .toggleBulletList()
                            .run(),
                    <List size={18} />
                )}

                {button(
                    editor.isActive("orderedList"),
                    () =>
                        editor
                            .chain()
                            .focus()
                            .toggleOrderedList()
                            .run(),
                    <ListOrdered size={18} />
                )}

                {button(
                    editor.isActive("blockquote"),
                    () =>
                        editor
                            .chain()
                            .focus()
                            .toggleBlockquote()
                            .run(),
                    <Quote size={18} />
                )}
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}