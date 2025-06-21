import { useState, useEffect, useCallback } from 'react';
import TypeWriter from './TypeWriter';
import image1 from '../assets/captureTheFlag.png';
import image2 from '../assets/zencorgi.webp';

interface UrlOutputProps {
    url: string;
}

const UrlOutput: React.FC<UrlOutputProps> = ({ url }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentImage, setCurrentImage] = useState<string>(image1);
    const handleTypingComplete = useCallback(() => {
        setCurrentImage(image2);
    }, []);
    const fetchContent = async (withDelay = false) => {
        setLoading(true);
        setError('');
        setContent('');
        setCurrentImage(image1);
        try {
            if (withDelay) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            const response = await fetch(url);
            if (!response.ok) {
                setError(`HTTP error! status: ${response.status}`);
                return;
            }
            const text = await response.text();
            setContent(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [url]);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>Loading content from: {url}</div>
                <div style={{ marginTop: '10px' }}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                color: 'red',
                backgroundColor: '#ffebee',
                borderRadius: '4px',
                margin: '20px'
            }}>
                <div><strong>Error fetching:</strong> {url}</div>
                <div>{error}</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Image that changes when typing completes */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                    src={currentImage}
                    alt="Display image"
                    style={{
                        maxWidth: '250px',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                />
            </div>
            <TypeWriter text={content} onComplete={handleTypingComplete} />
            <button
                onClick={() => fetchContent(true)}
                style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                I didn't see it say "loading"
            </button>
        </div>
    );
};

export default UrlOutput;