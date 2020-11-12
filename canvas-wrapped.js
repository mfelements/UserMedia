import canvaskit from '@mfelements/canvaskit'

export default async function canvasWrapped({ metadata, stream }){
    const { width, height } = metadata || {};
    const canvas = canvaskit.MakeCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const streamReader = stream.getReader();
    let done = false;
    streamReader.read().then(function process({ value }){
        ctx.putImageData(value, 0, 0);
        if(!done) return streamReader.read().then(process);
        streamReader.cancel()
    });
    return {
        metadata,
        canvas,
        stopRender(){ done = true },
    }
}
