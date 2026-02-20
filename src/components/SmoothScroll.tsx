"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";

interface LenisProps {
    children: React.ReactNode;
    isInsideModal?: boolean;
}

function SmoothScroll({ children, isInsideModal = false }: LenisProps) {
    const lenis = useLenis();

    useEffect(() => {
        document.addEventListener("DOMContentLoaded", () => {
            lenis?.stop();
            lenis?.start();
        });
    }, [lenis]);

    return (
        <ReactLenis
            root
            options={{
                duration: 2,
                prevent: (node) => {
                    if (isInsideModal) return true;
                    const modalOpen = node.classList.contains("modall");
                    return modalOpen;
                },
            }}
        >
            {children}
        </ReactLenis>
    );
}

export default SmoothScroll;
