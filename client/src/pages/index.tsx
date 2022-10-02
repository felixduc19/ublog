import Sidebar from "../components/Sidebar/Sidebar";

import { Loading } from "../components/Loading";
import { PostsDocument, usePostsQuery } from "../generated/graphql";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

export default function Index() {
    const { data, loading } = usePostsQuery();
    if (loading) {
        return (
            <Sidebar>
                <Loading />
            </Sidebar>
        );
    }
    return (
        <Sidebar>
            {data?.posts.map((post) => (
                <li>{post.title}</li>
            ))}
        </Sidebar>
    );
}

export const getStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query({
        query: PostsDocument,
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};
