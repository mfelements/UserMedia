import { Metadata } from './@types/shared'

export function getCameraVideo<O extends { type: 'imageData' }>(options: O): Promise<{
    metadata: Metadata;
    stream: ReadableStream<ImageData>
}>

export function getCameraVideo(options: any): Promise<{
    metadata: Metadata;
    stream: ReadableStream<Blob>
}>
