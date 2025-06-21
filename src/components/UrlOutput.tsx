import { useState, useEffect, useCallback } from 'react';
import TypeWriter from './TypeWriter';
import image1 from '../assets/captureTheFlag.png';
import image2 from '../assets/zencorgi.webp';

// Node.js script to get the URL:
// const https = require('https');
// async function getUrlContent(url) {
//     return new Promise((resolve, reject) => {
//         try {
//             const req = https.get(url, (res) => {
//                 let data = '';
//                 res.on('data', (chunk) => {
//                     data += chunk;
//                 });
//
//                 res.on('end', () => {
//                     if (res.statusCode >= 200 && res.statusCode < 300) {
//                         resolve(data);
//                     } else {
//                         reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
//                     }
//                 });
//             });
//
//             req.on('error', (err) => {
//                 reject(err);
//             });
//
//             req.setTimeout(10000, () => {
//                 reject(new Error('Request timeout'));
//             });
//
//         } catch (error) {
//             reject(error);
//         }
//     });
// }
//
// async function findRefValues(url) {
//     try {
//         const content = await getUrlContent(url);
//         if (!content) {
//             return [];
//         }
//         const pattern = /<[^>]*class=["'][^"']*\bref\b[^"']*["'][^>]*\/?>/gi;
//         const values = [];
//         let match;
//         while ((match = pattern.exec(content)) !== null) {
//             const tag = match[0];
//             const valueMatch = tag.match(/value=["']([^"']*)["']/i);
//             if (valueMatch) {
//                 values.push(valueMatch[1]);
//             }
//         }
//
//         if (values.length === 0) {
//             console.log("No tags with class containing 'ref' and value attribute found.");
//         }
//
//         return values;
//     } catch (error) {
//         console.error(`Error fetching URL: ${error.message}`);
//         return [];
//     }
// }
// async function main() {
//     const args = process.argv.slice(2);
//
//     const url = args[0];
//     const values = await findRefValues(url);
//
//     if (values.length > 0) {
//         const concatenated = values.join('');
//         console.log(`URL: ${concatenated}`);
//     } else {
//         console.log("No values found to concatenate.");
//     }
// }
// main().catch(console.error);


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
                <div style={{ marginTop: '10px' }}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                color: 'red',
                backgroundColor: '#eee',
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
                    backgroundColor: '#66a',
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