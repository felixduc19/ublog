import { Alert, AlertIcon, AlertTitle, Box, Heading } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Loading } from "../../components/Loading";
import PostEditDeleteButton from "../../components/Post/PostEditDeleteButton";

import Sidebar from "../../components/Sidebar/Sidebar";
import {
    PostDocument,
    PostIdsDocument,
    PostIdsQuery,
    PostQuery,
    usePostQuery,
} from "../../generated/graphql";
import { addApolloState, initializeApollo } from "../../lib/apolloClient";

const Post = () => {
    const router = useRouter();
    const { data, loading, error } = usePostQuery({
        variables: {
            id: router.query.id as string,
        },
    });

    console.log(error);

    if (loading)
        return (
            <Sidebar>
                <Loading />
            </Sidebar>
        );
    if (error || !data?.post) {
        return (
            <Sidebar>
                <Alert status="error" borderRadius={8}>
                    <AlertIcon />
                    <AlertTitle>
                        {error ? error.message : "Post not found"}
                    </AlertTitle>
                </Alert>
            </Sidebar>
        );
    }
    return (
        <Sidebar>
            <Heading mb={4}>{data?.post.title}</Heading>
            <Box mb={4}>{data?.post.text}</Box>

            <PostEditDeleteButton postId={data?.post?.id} />
        </Sidebar>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const apolloClient = initializeApollo();

    const { data } = await apolloClient.query<PostIdsQuery>({
        query: PostIdsDocument,
        variables: { limit: 3 },
    });

    return {
        paths: data.posts!.paginatedPosts.map((post) => ({
            params: { id: `${post.id}` },
        })),
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps<
    { [key: string]: any },
    { id: string }
> = async (context) => {
    const { params } = context;
    // if (!params?.id) return { notFound: true };

    const apolloClient = initializeApollo();

    await apolloClient.query<PostQuery>({
        query: PostDocument,
        variables: {
            id: params?.id,
        },
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};

export default Post;
