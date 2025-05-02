import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ value, onChange, height = 300 }) => {
  return (
    <Editor
      apiKey="" // Leave it empty for self-hosted
      value={value}
      init={{
        height: height,
        menubar: false,
        plugins: ['link', 'lists', 'code', 'table'],
        toolbar:
          'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | code',
        skin: 'oxide',
        content_css: 'default',
        language: 'en',
        // If using local files, you can specify the path to your local tinymce files (if needed)
        // Example:
        // content_css: '%PUBLIC_URL%/tinymce/skins/ui/oxide/content.min.css',
      }}
      onEditorChange={onChange}
    />
  );
};

export default RichTextEditor;
