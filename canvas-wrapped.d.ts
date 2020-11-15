import { CanvasKit } from 'canvaskit-wasm'
import { Metadata } from './@types/shared'

export default function canvasWrapped<T extends Metadata>(params: { metadata: T, stream: ReadableStream }): Promise<{
    metadata: T;
    canvas: ReturnType<CanvasKit['MakeCanvas']>;
    stopRender(): void;
}>
