"use client"
import * as React from 'react';
import { Input } from "@/components/ui/input";

type Props = {
    keyword: string;
    setKeyword: (value: string) => void;
};

export default function _FormKeyword(props: Props) {
    const { keyword, setKeyword } = props;

    const [debouncedKeyword, setDebouncedKeyword] = React.useState(keyword);
    const [typingTimeout, setTypingTimeout] = React.useState<NodeJS.Timeout | null>(null);

    // Debounce the keyword input
    React.useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timeout = setTimeout(() => {
            setKeyword(debouncedKeyword);
        }, 3000);

        setTypingTimeout(timeout);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [debouncedKeyword, setKeyword]);

    // Handle input changes and Enter key press
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setDebouncedKeyword(value);

        // Check if Enter key was pressed
        if (event.key === 'Enter') {
            // Clear the debounce timeout and immediately set the keyword
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            setKeyword(value);
        }
    };

    return (
        <>
            <Input
                placeholder="Filter by keyword..."
                value={debouncedKeyword}
                onChange={(event) => setDebouncedKeyword(event.target.value)} // Update debounced keyword on every keyup
                onKeyDown={handleInputChange} // Add keydown event listener to capture the Enter key
                className="max-w-sm"
            />
        </>
    );
}
