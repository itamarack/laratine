'use client';

import { Link, RichTextEditor, RichTextEditorProps } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Stack, StackProps, Text } from '@mantine/core';
import { CSSProperties } from 'react';
import '@mantine/tiptap/styles.css';

type TextEditorProps = {
  label: string;
  content: string;
  editable?: boolean;
  width?: CSSProperties['width'];
  onChange?: (content: string) => void;
  onFocus?: (content: string) => void;
  onBlur?: (content: string) => void;
} & Omit<RichTextEditorProps, 'children' | 'editor'> &
  StackProps;

const TextEditor = ({
  content,
  label,
  editable,
  onChange,
  onFocus,
  onBlur,
  width,
  ...others
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
      if (onFocus) onFocus(editor.getHTML());
      if (onBlur) onBlur(editor.getHTML());
    },
  });

  return (
    <Stack h={'100%'}>
      <Text>{label}</Text>
      <RichTextEditor editor={editor} style={{ width }} {...others}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Stack>
  );
};

export default TextEditor;
