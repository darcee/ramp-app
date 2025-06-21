import { useState, useEffect } from 'react';

interface TypeWriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, speed = 500, onComplete }) => {
    const [displayedText, setDisplayedText] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            setIsTyping(false);
            return;
        }
        const letters = text.split('');
        setIsTyping(true);
        setDisplayedText('');
        let index = 0;

        const timer = setInterval(() => {
            if (index < letters.length) {
                const currentLetter = letters[index];
                setDisplayedText(prev => prev + currentLetter);
                index++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
                if (onComplete) {
                    onComplete();
                }
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <div>
            {isTyping && (
                <div style={{ marginBottom: '10px', fontSize: '14px', color: '#007bff' }}>
                    Typing...
                </div>
            )}

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '500px',
                overflow: 'auto'
            }}>
                {displayedText}
                {isTyping && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
            </div>

            <style>
                {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
            </style>
        </div>
    );
};

export default TypeWriter;