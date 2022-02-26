import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import VideoUploader from '../components/VideoUploader'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <VideoUploader />
      </main>
      <nav>
        <ul>
          <Link href="/PostList" >
            <a><li>video List</li></a>
          </Link>
        </ul>
      </nav>
    </div>
  )
}

export default Home
