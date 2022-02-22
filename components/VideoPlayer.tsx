export default function VideoPlayer({ id }: { id: string }) {

    return (
        <div>
            <video src={`http://localhost:5000/api/videos/file?videoId=${id}`}
                controls
                preload="metadata"
                width="480px"
                id="video-player"
            />
        </div>
    )
}