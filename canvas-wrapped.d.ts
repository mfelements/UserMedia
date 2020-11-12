import { CanvasKit } from 'canvaskit-wasm'
import { Metadata } from './@types/shared'

export default async function canvasWrapped<T extends Metadata>(params: { metadata: T, stream: ReadableStream }): {
    metadata: T;
    canvas: ReturnType<CanvasKit['MakeCanvas']>;
    stopRender(): void;
}
