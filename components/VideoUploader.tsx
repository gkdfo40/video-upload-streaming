import React, { useState } from "react"
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export default function VideoUploader() {
    const [file, setFile] = useState<File | undefined>();
    const [process, setProcess] = useState<Number>(0);
    const [error, setError] = useState<Error | null>(null);
    const [submitting, setSubmitting] = useState<Boolean>(false);

    // set on  Video_file to file status
    const setFileHandler: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files?.length) {
            setFile(files[0]);
        }
    }
    // post API: send Video File to api/videos page
    const submitHandler: React.MouseEventHandler<HTMLButtonElement> = async () => {
        const data = new FormData;

        if (!file) return;

        setSubmitting(true);
        data.append('file', file);

        // upload percentage
        // progressEvent info (https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)
        const config: AxiosRequestConfig = {
            onUploadProgress: function (progressEvent) {
                let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProcess(percentage);
            }
        };

        try {
            await axios.post('/api/videos', data, config);
            console.log(`video upload is Done.`);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSubmitting(false);
            setProcess(0);
        }
    }

    return (
        <div className="">
            <div>
                {submitting && <p>{process}</p>}
                {error && <p>{error}</p>}
            </div>
            <input type="file" name="file" accept="video/*" onChange={setFileHandler} />
            <button onClick={submitHandler}>upload video</button>
        </div>
    )
}