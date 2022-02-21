import type { NextApiRequest, NextApiResponse } from 'next'
import busboy from 'busboy'

import { Db, GridFSBucket, MongoClient } from 'mongodb'
const dbUri: string = "mongodb://localhost:27017";
//const client: MongoClient = new MongoClient(dbUri);

export const config = {
    api: {
        bodyParser: false,
    }
}

async function uploadVideoStream(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const bb = busboy({ headers: req.headers });
    const client: MongoClient = new MongoClient(dbUri);
    await client.connect();
    const db: Db = client.db('videos');
    const bucket = new GridFSBucket(db);
    bb.on('file', (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        console.log(`File[${name}]: filename: ${filename}, encoding: ${encoding}, mimeType: ${mimeType}`);

        const videoUploadStream = bucket.openUploadStream(filename, {
            chunkSizeBytes: 3145728,
            metadata: { field: "free", value: "vlog" }
        });
        file.pipe(videoUploadStream);
    });
    bb.on('close', () => {
        console.log('Done parsing video!');
        res.writeHead(200, { 'Connection': 'close' });
        res.end(`That's all folks`);
    });
    req.pipe(bb);
    return;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const method = req.method;

    if (method === 'POST') {
        return uploadVideoStream(req, res);
    }
    if (method === "GET") {
        return;
    }
}