import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Palette,
    Highlighter,
    Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const COLORS = [
    "#000000", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#FFFFFF",
    "#EF4444", "#F97316", "#F59E0B", "#EAB308", "#84CC16", "#22C55E",
    "#10B981", "#14B8A6", "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
    "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E",
];

const HIGHLIGHT_COLORS = [
    "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B",
    "#FEE2E2", "#FECACA", "#FCA5A5", "#F87171", "#EF4444",
    "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6",
    "#D1FAE5", "#A7F3D0", "#6EE7B7", "#34D399", "#10B981",
];

export function RichTextEditor({ content, onChange, placeholder = "Metninizi buraya yazın..." }: RichTextEditorProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color,
            TextStyle,
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none h-full w-full px-4 py-3 prose prose-sm sm:prose-base max-w-none",
                "data-placeholder": placeholder,
            },
        },
    });

    if (!editor) {
        return null;
    }

    const setColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
        setShowColorPicker(false);
    };

    const setHighlight = (color: string) => {
        editor.chain().focus().toggleHighlight({ color }).run();
        setShowHighlightPicker(false);
    };

    const setLink = () => {
        const url = window.prompt('Link URL\'si girin:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden w-full h-full flex flex-col">
            {/* Toolbar */}
            <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1 shrink-0">
                {/* Text Formatting */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-muted" : ""}
                    title="Kalın"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-muted" : ""}
                    title="İtalik"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "bg-muted" : ""}
                    title="Üstü Çizili"
                >
                    <Underline className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Headings */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
                    title="Başlık 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
                    title="Başlık 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
                    title="Başlık 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-muted" : ""}
                    title="Madde İşareti"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-muted" : ""}
                    title="Numaralı Liste"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Text Align */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={editor.isActive({ textAlign: 'left' }) ? "bg-muted" : ""}
                    title="Sola Hizala"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={editor.isActive({ textAlign: 'center' }) ? "bg-muted" : ""}
                    title="Ortala"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={editor.isActive({ textAlign: 'right' }) ? "bg-muted" : ""}
                    title="Sağa Hizala"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={editor.isActive({ textAlign: 'justify' }) ? "bg-muted" : ""}
                    title="İki Yana Yasla"
                >
                    <AlignJustify className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Color Picker */}
                <div className="relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setShowColorPicker(!showColorPicker);
                            setShowHighlightPicker(false);
                        }}
                        title="Metin Rengi"
                    >
                        <Palette className="h-4 w-4" />
                    </Button>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-background border rounded-lg shadow-lg p-2 z-50 w-48">
                            <div className="grid grid-cols-6 gap-1">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => setColor(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Highlight Picker */}
                <div className="relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setShowHighlightPicker(!showHighlightPicker);
                            setShowColorPicker(false);
                        }}
                        className={editor.isActive("highlight") ? "bg-muted" : ""}
                        title="Vurgulama Rengi"
                    >
                        <Highlighter className="h-4 w-4" />
                    </Button>
                    {showHighlightPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-background border rounded-lg shadow-lg p-2 z-50 w-48">
                            <div className="grid grid-cols-5 gap-1">
                                {HIGHLIGHT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => setHighlight(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Link */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={editor.isActive("link") ? "bg-muted" : ""}
                    title="Link Ekle"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-border mx-1" />
                
                {/* Undo/Redo */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Geri Al"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Yinele"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            {/* Editor */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <EditorContent 
                    editor={editor} 
                    className="flex-1 overflow-y-auto w-full h-full"
                />
            </div>
        </div>
    );
}
