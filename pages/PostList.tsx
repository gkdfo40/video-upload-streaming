import { ObjectId } from "mongodb";
import { GetStaticProps } from "next";
import Link from "next/link";

type Post = {
    _id: ObjectId,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: string,
    metadata: {
        field: string,
        value: string,
    }
}

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

export default PostList;