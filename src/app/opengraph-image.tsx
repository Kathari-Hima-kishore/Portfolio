import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Kathari Hima Kishore — Full Stack Developer & Designer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {/* Accent line */}
                <div
                    style={{
                        width: '80px',
                        height: '4px',
                        background: 'linear-gradient(90deg, #d4a843, #f0c674)',
                        marginBottom: '32px',
                        borderRadius: '2px',
                    }}
                />

                {/* Name */}
                <div
                    style={{
                        fontSize: '64px',
                        fontWeight: 800,
                        color: '#ffffff',
                        lineHeight: 1.1,
                        marginBottom: '16px',
                        display: 'flex',
                    }}
                >
                    Kathari Hima Kishore
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: '28px',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '48px',
                        display: 'flex',
                    }}
                >
                    Full Stack Developer & Designer
                </div>

                {/* URL */}
                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 300,
                        color: 'rgba(255, 255, 255, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    🌐 kathari-hima-kishore.tech
                </div>
            </div>
        ),
        { ...size }
    )
}
