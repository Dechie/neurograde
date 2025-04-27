import { SVGAttributes } from "react";

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="none">
            <g stroke="#5463FF" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M112 140 L72 200 L112 260" /> {/* Left angle bracket */}
                <path d="M288 140 L328 200 L288 260" /> {/* Right angle bracket */}
                <rect x="152" y="128" width="96" height="144" rx="20" fill="transparent" /> {/* Transparent document rectangle */}
                <path d="M172 180 h56" /> {/* First document line */}
                <path d="M172 220 h56" /> {/* Second document line */}
            </g>
        </svg>
    );
}


