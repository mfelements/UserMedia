import Stream from '@mfelements/stream'

// this will start load canvaskit module IMMIDIATELY, parallel with other modules, but without locking script execution
import _canvaskit from 'data:application/javascript,export%20default%20import("@mfelements/canvaskit")'

function getCanvaskit(){
    return _canvaskit.then(({ default: v }) => v)
}

async function canvasWrapped({ metadata, stream }){
    const { width, height } = metadata || {};
    const { MakeCanvas } = await getCanvaskit();
    const canvas = MakeCanvas(width, height);
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

export async function getCameraVideo(options){
    options = Object.assign({}, options || {});
    if(options.type === 'canvas'){
        options.type = 'imageData';
        return canvasWrapped(await getCameraVideo(options))
    }
    const streamId = await mainThreadAction('createStream');
    let stream = new Stream;
    streamStorage[streamId] = stream;
    const metadata = await mainThreadAction('getCameraVideo', streamId, options);
    return {
        metadata,
        stream: new ReadableStream({
            start(controller){
                stream.on('data', chunk => controller.enqueue(chunk));
                stream.on('error', e => controller.error(e));
                stream.on('end', () => controller.close())
            },
            async cancel(){
                await endStream(streamId);
                delete streamStorage[streamId];
                stream = null
            },
        }),
    }
}
