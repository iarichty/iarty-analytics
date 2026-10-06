/**
 * Client-side result exporters: CSV, multi-file ZIP and a shareable summary
 * image. Everything runs in the browser; nothing is uploaded.
 */
import { toCsv } from '@/lib/analysis/parsers';
import type { AnalysisResult, ConnectionUser } from '@/lib/analysis/types';

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Give the browser a tick to start the download before revoking.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Export a single named list as a CSV file. */
export function exportCsv(users: ConnectionUser[], filename: string): void {
    const csv = '\uFEFF' + toCsv(users); // BOM keeps Excel happy with UTF-8.
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
}

/** The named lists we can bundle into a single ZIP download. */
const LIST_LABELS: Array<{ key: keyof AnalysisResult; file: string }> = [
    { key: 'followers', file: 'followers.csv' },
    { key: 'following', file: 'following.csv' },
    { key: 'nonFollowbacks', file: 'not-following-back.csv' },
    { key: 'notFollowingBack', file: 'you-dont-follow-back.csv' },
];

/** Export every result list as a ZIP of CSVs (async: loads JSZip on demand). */
export async function exportAllAsZip(
    result: AnalysisResult,
    platform: string,
): Promise<void> {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const { key, file } of LIST_LABELS) {
        const users = result[key];
        if (Array.isArray(users)) {
            zip.file(file, '\uFEFF' + toCsv(users as ConnectionUser[]));
        }
    }

    // A small readme so the bundle is self-explanatory.
    zip.file(
        'README.txt',
        `IARTY Tools export (${platform})\n` +
            `Generated: ${new Date().toISOString()}\n` +
            `All data was processed locally in the browser.\n`,
    );

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, `${platform}-iarty-export.zip`);
}

/**
 * Render an off-screen DOM node to a PNG and download it.
 *
 * We avoid an HTML-to-canvas dependency by drawing a self-contained summary
 * card directly onto a canvas — reliable and dependency-free.
 */
export function exportSummaryImage(
    platform: string,
    result: AnalysisResult,
): void {
    const width = 1000;
    const height = 560;
    const scale = 2; // Retina-sharp output.
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Background gradient.
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f0f13');
    grad.addColorStop(1, '#1a1a24');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Header.
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Inter, system-ui, sans-serif';
    ctx.fillText('IARTY Tools', 60, 90);

    ctx.fillStyle = '#a855f7';
    ctx.font = '600 22px Inter, system-ui, sans-serif';
    ctx.fillText(`${platform.toUpperCase()} · connection report`, 60, 128);

    const cards: Array<{ label: string; value: number; color: string }> = [
        { label: 'Followers', value: result.followers.length, color: '#60a5fa' },
        { label: 'Following', value: result.following.length, color: '#c084fc' },
        { label: 'Not Following Back', value: result.nonFollowbacks.length, color: '#f87171' },
        { label: "You Don't Follow Back", value: result.notFollowingBack.length, color: '#fb923c' },
    ];

    const cardW = 415;
    const cardH = 150;
    const gapX = 50;
    const gapY = 40;
    const startX = 60;
    const startY = 200;

    cards.forEach((card, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = startX + col * (cardW + gapX);
        const y = startY + row * (cardH + gapY);

        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        roundRect(ctx, x, y, cardW, cardH, 24);
        ctx.fill();

        ctx.fillStyle = card.color;
        ctx.font = '800 64px Inter, system-ui, sans-serif';
        ctx.fillText(card.value.toLocaleString('en-US'), x + 30, y + 90);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px Inter, system-ui, sans-serif';
        ctx.fillText(card.label, x + 30, y + 125);
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.fillText('Processed 100% locally in the browser · iarty.id', 60, height - 40);

    canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `${platform}-summary.png`);
    }, 'image/png');
}

/** Draw a rounded rectangle path on a 2D context. */
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
