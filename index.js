import Stream from '@mfelements/stream'

export async function getCameraVideo(options){
    const streamId = await mainThreadAction('createStream');
    let stream = new Stream;
    streamStorage[streamId] = stream;
    await mainThreadAction('getCameraVideo', streamId, options);
    return new ReadableStream({
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
    })
}
