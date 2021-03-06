# πΌUpload Video _with Next.js_

 + [Project](#project)
 + [Dependency](#dependency)
 + [Upload Video](#upload-video)
   + [Component Handler](#component-handler)
   + [API](#api)
 + [PostList](#postlist)
   + [Static Generate](#static-generate)
 + [Dynamic Routes](#dynamic-routes)
   + [[id] page](#page)
   + [getServerSideProps](#getserversideprops)
 + [Server](#server)

<br/>

## Project

μ΄λ² νλ‘μ νΈμμλ video streaming μ¬μ΄νΈ κ°λ°μ νκΈ°λ‘ ν΄λ³Έλ€.
λ¨μνκ² videoλ₯Ό μλ‘λνκ³  μλ²μμ μ€νΈλ¦¬λ° νλ κΈ°λ₯μ κ΅¬νν¨μΌλ‘ video νλ«νΌμ μλ¦¬λ₯Ό μ΄ν΄νλ κ²μ λͺ©νλ‘ νμλ€. 
ν΄λΌμ΄μΈνΈλ React νλ μμν¬μΈ [Next.js](https://nextjs.org/)λ₯Ό μ¬μ©νμλ€.

μ²μμλ μ¬μ©μκ° μ μ‘ν video νμΌμ μλ²μμ Bufferλ‘ λ°μ DBλ‘ μ μ₯νλ €κ³  νμλ€.
νμ§λ§ λ€μμ μ¬μ©μκ° μμμ λμμ μ¬λ €λ € νλ€λ©΄ μ€νΈλ¦¬λ°λ ν΄μΌνλ μλ²μ λΆλ΄μ΄ λ  μλ μλ€. λλ¬Έμ μλ²λ μ€νΈλ¦¬λ°νλ μ­ν λ§ λ΄λΉνκ³  μλ‘λλ ν΄λΌμ΄μΈνΈμμ λ΄λΉνκ² νμ¬ μ­ν μ λΆλ¦¬νμλ€.

<br/>

- Upload flow

<img src="https://miro.medium.com/max/1400/1*DppKKMCdxCf4eueofUN6eQ.png" width="45%" height="45%">

<br/>

## Dependency

[mongodb](https://www.npmjs.com/package/mongodb)

[axios](https://axios-http.com/)

[busboy](https://www.npmjs.com/package/busboy)

`yarn create next-app --typescript`

`yarn add mongodb axios busboy @types/busboy -D`

<br/>

## Upload Video

### Component Handler

+ setFile to useState

```typescript
const setFileHandler: React.ChangeEventHandler<HTMLInputElement> = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files?.length) {
        setFile(files[0]);
    }
}
```
<br/>

+ submit to `/api/videos` page

```Typescript
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
```

<br/>

<img src="./public/post1.PNG">

<br/>

### API

+ upload Video to DB
> what is **[GridFS](https://github.com/gkdfo40/TIL/blob/main/GridFS.md)** ??

```typescript
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
```

<br/>

## PostList

> DBμ μ μ₯λ λΉλμ€ λͺ©λ‘μ κ°μ Έμ νλ©΄μ νμ

### Static Generate

Next.jsλ₯Ό μ¬μ©νλ©΄ λμΌν νμΌμμ getStaticPropsλΌλ λΉλκΈ° ν¨μλ₯Ό λ΄λ³΄λΌ μ μλ€. μ΄ ν¨μλ λΉλ μ νΈμΆλλ©°, κ°μ Έμ¨ λ°μ΄ν°λ₯Ό μ¬μ  λ λλ§ μ νμ΄μ§μ μμ±μΌλ‘ μ λ¬ν  μ μλ€.

λΉλμ€ λͺ©λ‘μ κ²½μ° λ°λ‘λ°λ‘ κ°±μ λμ΄μΌ νλ©° μ΄λ₯Ό CDNμμ DOMμ κ΄λ¦¬νκ² λλ€.
Static Generationμ pageμμ μ¬μ©νλ©΄ λΉλ νμμ HTMLμ΄ μμ±λλ€. 
μ΄κΈ° HTML μμ± ν κ° μμ²­μ΄ μ¬λ λ§λ€ HTMLμ΄ μ¬μ¬μ© λλ€. 

λμ  κ²½λ‘μ λν ν΄λΌμ΄μΈνΈ μΈ‘ νμμ `next/link`λ‘ μ²λ¦¬λλ€. μλμ  `PostLIst`μμ  `GetStaticProps`μ κ²°κ³Όλ‘ μμ±λ postsμ filenameμ κ²°κ³Όλ₯Ό linkλ‘ νμνκ² λλ€.

 + PostList page 
```typescript 
const PostList = ({ posts }: { posts: Post[] }) => {
    return (
        <div>
            {posts.map((post, index) => (
                <Link key={index} href="/videos/[id]" as={`/videos/${post.filename}`}>
                    <a><p>watch {post.filename}</p></a>
                </Link>
            ))}
        </div>
    )
}
```

<br/>

```typescript
export const getStaticProps: GetStaticProps = async () => {
    // Call an external API endpoint to get posts
    const res = await fetch('http://localhost:5000/api/videos/posts')
    const posts = await res.json()

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            posts,
        },
    }
}
```

<br/>

## Dynamic Routes

### page

>λμ  κ²½λ‘μ κ²°κ³Όλ‘ λ³΄μ¬μ§λ VideoPlayer page

```typescript
import VideoPlayer from "../../components/VideoPlayer";
import { GetServerSideProps } from 'next'
import { useRouter } from "next/router";
export default function VideoPage() {
    const router = useRouter();
    const { id } = router.query as { id: string };
    return (
        <div>
            <VideoPlayer id={id} />
        </div>
    )
}
```

<br/>

### getServerSideProps

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            query: context.query
        },
    }
}
```

<br/>

### Component

```typescript
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
```

<br/>

## Server
server code νμ΄μ§=>>
π¦π¦ **[Streaming Server](https://github.com/gkdfo40/video-upload-streaming-Server)**