'use client';
import { useEffect, useState } from 'react';
import { RiArrowUpBoxLine } from 'react-icons/ri';

function ScrollBackToTopButton() {
    const [scrollBackToTopButton, setScrollBackToTopButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setScrollBackToTopButton(true);
            } else {
                setScrollBackToTopButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!scrollBackToTopButton) return null;

    return (
        <div className="fixed bottom-6 left-6 flex flex-col items-end gap-2 z-50">
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Back to top"
                className="p-4 rounded-full shadow-lg transition-colors bg-dbu-bg3 border border-dbu-text text-dbu-text hover:bg-dbu-header hover:text-dbu-bg cursor-pointer"
            >
                <RiArrowUpBoxLine size={20} />
            </button>
        </div>
    );
}

export default ScrollBackToTopButton;