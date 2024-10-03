import { framer, Draggable } from "framer-plugin"
import { useState, useEffect, useCallback, useMemo } from "react"
import * as SimpleIcons from "simple-icons"
import type { SimpleIcon } from "simple-icons"
import "./App.css"

interface Icon {
    title: string;
    slug: string;
    svg: string;
}

export function App() {
    const [searchTerm, setSearchTerm] = useState("")
    const [icons, setIcons] = useState<Icon[]>([])
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const iconList = Object.values(SimpleIcons)
            .filter((icon): icon is SimpleIcon => typeof icon === 'object' && icon !== null && 'title' in icon)
            .map(icon => ({ title: icon.title, slug: icon.slug, svg: icon.svg }))
            .sort((a, b) => a.title.localeCompare(b.title));
        setIcons(iconList);

        const observer = new MutationObserver(() => {
            setTheme(document.body.dataset.framerTheme as "light" | "dark")
        })
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-framer-theme'] })
        return () => observer.disconnect()
    }, []);

    const filteredIcons = useMemo(() => 
        icons.filter(icon => 
            icon.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [icons, searchTerm]
    );

    const modifySvgColor = useCallback((svg: string, color: string) => {
        return svg.replace(/fill="[^"]*"/g, `fill="${color}"`).replace(/<svg/, `<svg fill="${color}"`);
    }, []);

    const handleIconClick = useCallback(async (icon: Icon) => {
        const color = theme === 'dark' ? '#ffffff' : '#000000';
        const svg = modifySvgColor(icon.svg, color);
        await framer.addSVG({
            svg,
            name: `${icon.slug}.svg`,
        });
    }, [theme, modifySvgColor]);

    const IconItem = useCallback(({ icon }: { icon: Icon }) => {
        const svgColor = theme === 'dark' ? '#ffffff' : '#000000';
        const modifiedSvg = modifySvgColor(icon.svg, svgColor);

        return (
            <Draggable
                data={() => ({
                    type: 'svg',
                    name: `${icon.slug}.svg`,
                    svg: modifySvgColor(icon.svg, theme === 'dark' ? '#ffffff' : '#000000')
                })}
            >
                <button className="logo" onClick={() => handleIconClick(icon)}>
                    <div dangerouslySetInnerHTML={{ __html: modifiedSvg }} />
                </button>
            </Draggable>
        );
    }, [theme, handleIconClick, modifySvgColor]);

    return (
        <main>
            <div className="search">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="currentColor" d="M7.5 2a5.5 5.5 0 0 1 4.383 8.823l1.885 1.884a.75.75 0 1 1-1.061 1.061l-1.884-1.885A5.5 5.5 0 1 1 7.5 2Zm-4 5.5a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path></svg>
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a logo..."
                    className="search-input"
                />
            </div>
            <div className="logos">
                {filteredIcons.map((icon) => (
                    <IconItem key={icon.slug} icon={icon} />
                ))}
            </div>
        </main>
    )
}