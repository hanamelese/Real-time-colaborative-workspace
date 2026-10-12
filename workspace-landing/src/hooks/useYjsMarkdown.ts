'use client';

import { useEffect, useState } from 'react';
import * as Y from 'yjs';

interface UseYjsMarkdownOptions {
    roomId: string;
    onSendBinary: (update: Uint8Array) => void;
}

export function useYjsMarkdown({ roomId, onSendBinary }: UseYjsMarkdownOptions) {
    const [ydoc] = useState(() => new Y.Doc());
    const [yText] = useState(() => ydoc.getText('markdown-content'));
    const [text, setText] = useState<string>('');

    useEffect(() => {
        // Handle local changes -> broadcast to others
        const observer = (event: Y.YTextEvent, transaction: Y.Transaction) => {
            if (transaction.origin !== 'remote') {
                const update = Y.encodeStateAsUpdate(ydoc);
                onSendBinary(update);
            }
            setText(yText.toString());
        };

        yText.observe(observer);
        return () => {
            yText.unobserve(observer);
        };
    }, [ydoc, yText, onSendBinary]);

    // Function to apply incoming remote Yjs updates
    const applyRemoteUpdate = (updateBytes: Uint8Array) => {
        Y.applyUpdate(ydoc, updateBytes, 'remote');
        setText(yText.toString());
    };

    // Function to update text locally from editor input
    const updateLocalText = (newText: string) => {
        if (newText !== yText.toString()) {
            ydoc.transact(() => {
                yText.delete(0, yText.length);
                yText.insert(0, newText);
            }, 'local');
        }
    };

    return { text, updateLocalText, applyRemoteUpdate };
}