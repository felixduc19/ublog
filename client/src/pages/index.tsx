import Sidebar from "../components/Sidebar/Sidebar";

import { NetworkStatus } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { Loading } from "../components/Loading";
import PostItem from "../components/Post/PostItem";
import { PostsDocument, useMeQuery, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

export default function Index() {
    const { data, loading, fetchMore, networkStatus } = usePostsQuery({
        variables: { limit: 3 },
        notifyOnNetworkStatusChange: true,
    });

    const { data: dataMe } = useMeQuery();

    console.log(dataMe);

    const loadingFetchMore = networkStatus === NetworkStatus.fetchMore;

    const fetchMorePosts = () => {
        fetchMore({
            variables: {
                cursor: data?.posts?.cursor,
            },
        });
    };

    if (loading && !loadingFetchMore) {
        return (
            <Sidebar>
                <Loading />
            </Sidebar>
        );
    }

    return (
        <Sidebar>
            {data?.posts?.paginatedPosts?.map(
                ({ id, title, text, createdAt, user }) => (
                    <PostItem
                        key={id}
                        id={id}
                        title={title}
                        text={text}
                        createdAt={createdAt}
                        user={user}
                        dataMe={dataMe}
                    />
                )
            )}
            {data?.posts?.hasMore && (
                <Button
                    fontSize="10px"
                    type="submit"
                    bg="teal.300"
                    w="100%"
                    h="45"
                    mb="20px"
                    color="white"
                    mt="20px"
                    _hover={{
                        bg: "teal.200",
                    }}
                    _active={{
                        bg: "teal.400",
                    }}
                    isLoading={loadingFetchMore}
                    onClick={fetchMorePosts}
                >
                    Load more
                </Button>
            )}
        </Sidebar>
    );
}

export const getStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query({
        query: PostsDocument,
        variables: {
            limit: 3,
        },
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};
