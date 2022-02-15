import { sanityClient, urlFor } from '../../sanity';
import Header from '../../components/Header';
import { Post } from '../../typings';
import { GetStaticProps } from 'next';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import React from 'react';
interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      // headers: {
      //   'Content-Type': 'application/json',
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />
      <img
        className=" h-56 w-full object-cover "
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-800">{post.author.name}</span> -
            Publised at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              normal: (props: any) => (
                <p className="font-400 my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              image: (image: any) => (
                <img
                  src={urlFor(image).url()!}
                  className="my-10 max-h-96  w-full rounded-3xl"
                />
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      {submitted ? (
        <div className="mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your commnet!
          </h3>
          <p>Once it has been approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h3 className="text-3xl font-bold">Leave a comment below!</h3>
          <hr className="mt-2 py-3" />

          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="mb-5 block">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', { required: true })}
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Appleseed"
              type="email"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="form-textarea mt-1 block w-full resize-none rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>

          {/* errors will return when field validation fails */}
          <div className="ost-5 flex flex-col">
            {errors.name && (
              <span className="text-red-500">The Name Field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">The Email Field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                The Comment Field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
          />
        </form>
      )}
      {/* Comments */}
      <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}:</span>{' '}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
export default Post;
export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
  _id,
  slug{current},
}`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
  *[_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author-> {
        name,
        image
    },
    'comments': *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true
    ],
        description,
        mainImage,
        slug,
        body
    }`;
  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds,  it'll update the old cached version
  };
};
