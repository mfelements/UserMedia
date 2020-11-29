import { ReadableStream } from '@mfelements/stream-definitions'

const start = Symbol();

class ReadableMediaStream extends ReadableStream{
    /** @type {Promise<string>} */
    #streamId;
    /** @type {Promise<void>} */
    #started;
    /** @type {boolean} */
    #stopped;
    /** @arg {Promise<string>} streamId */
    constructor(streamId){
        super();
        this.#streamId = streamId;
        this.#started = new Promise(r => this[start] = r)
    }
    async *[Symbol.asyncIterator](){
        /** @type {{ done: boolean, value: any }} */
        let currentValue;
        await this.#started;
        while(currentValue = await mainThreadAction('getStreamChunk', await this.#streamId), !currentValue.done && !this.#stopped)
            // hello Python :)
            yield currentValue.value
    }
    async stop(){
        this.#stopped = true;
        await mainThreadAction('stopStream', await this.#streamId)
    }
}

export function getCameraVideo(options){
    const streamId = mainThreadAction('createDirtyStream');
    const stream = new ReadableMediaStream(streamId);
    streamId
        .then(streamId => mainThreadAction('getCameraVideo', streamId, options))
        .then(stream[start]);
    return stream
}
