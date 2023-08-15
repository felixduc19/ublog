import { Reference } from "@apollo/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Button, Stack, useToast } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
    PaginatedPosts,
    useDeletePostMutation,
    useMeQuery,
} from "../../generated/graphql";

interface PostEditDeleteButtonProps {
    postId: string;
    postUserId: string;
}

const PostEditDeleteButton = (props: PostEditDeleteButtonProps) => {
    const { postId, postUserId } = props;

    const router = useRouter();

    const toast = useToast();

    const { data: dataMe } = useMeQuery();

    const [deletePost, { loading }] = useDeletePostMutation();

    const onDeletePost = async () => {
        try {
            const response = await deletePost({
                variables: {
                    id: postId,
                },

                update(cache, { data }) {
                    console.log(cache, data);
                    if (data?.deletePost?.success) {
                        cache.modify({
                            fields: {
                                posts(
                                    existing: Pick<
                                        PaginatedPosts,
                                        | "__typename"
                                        | "cursor"
                                        | "hasMore"
                                        | "totalCount"
                                    > & { paginatedPosts: Reference[] }
                                ) {
                                    const newPostsAfterDeletion = {
                                        ...existing,
                                        totalCount: existing.totalCount - 1,
                                        paginatedPosts:
                                            existing.paginatedPosts.filter(
                                                (postRefObject) =>
                                                    postRefObject.__ref !==
                                                    `Post:${postId}`
                                            ),
                                    };

                                    return newPostsAfterDeletion;
                                },
                            },
                        });
                    }
                },
            });

            if (router.route !== "/") {
                router.push("/");
            }

            toast({
                title: response.data?.deletePost?.message,
                status: response.data?.deletePost.success ? "success" : "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                containerStyle: {
                    marginTop: "100px",
                },
            });
        } catch (error) {
            toast({
                title: `Something Went Wrong`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                containerStyle: {
                    marginTop: "100px",
                },
            });
        }
    };

    if (dataMe?.me?.id !== postUserId) {
        return null;
    }

    return (
        <Stack direction="row" spacing={4} mt={8}>
            <Button
                colorScheme="red"
                variant="solid"
                onClick={onDeletePost}
                isLoading={loading}
            >
                <DeleteIcon />
            </Button>
            <NextLink href={`/post/edit/${postId}`}>
                <Button colorScheme="blue" variant="solid">
                    <EditIcon color="white" />
                </Button>
            </NextLink>
        </Stack>
    );
};

export default PostEditDeleteButton;
