import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";

import InputField from "../../../components/InputField";
import { Loading } from "../../../components/Loading";
import Sidebar from "../../../components/Sidebar/Sidebar";
import {
    UpdatePostInput,
    useMeQuery,
    usePostQuery,
    useUpdatePostMutation,
} from "../../../generated/graphql";

const EditPost = () => {
    const router = useRouter();

    const postId = router.query.id as string;

    const toast = useToast();

    const { data: dataMe, error, loading: loadingMeData } = useMeQuery();

    const { data: dataPost, loading: loadingPostData } = usePostQuery({
        variables: { id: postId },
    });

    const [updatePost] = useUpdatePostMutation();

    const onUpdatePostSubmit = async (values: Omit<UpdatePostInput, "id">) => {
        try {
            const response = await updatePost({
                variables: {
                    updatePostInput: {
                        id: postId,
                        ...values,
                    },
                },
            });

            if (!response.data?.updatePost?.success) {
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
                return;
            }

            router.back();
            toast({
                title: `Updated Post Successfully`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
                containerStyle: {
                    marginTop: "100px",
                },
            });
        } catch (error) {}
    };

    if (loadingMeData || loadingPostData) {
        return (
            <Sidebar>
                <Loading />
            </Sidebar>
        );
    }

    if (!dataPost?.post) {
        return (
            <Sidebar>
                <Alert status="error" borderRadius={8}>
                    <AlertIcon />
                    <AlertTitle>{"Post Not Found"}</AlertTitle>
                </Alert>
            </Sidebar>
        );
    }

    if (dataMe?.me?.id !== dataPost?.post?.user?.id) {
        return (
            <Sidebar>
                <Alert status="error" borderRadius={8}>
                    <AlertIcon />
                    <AlertTitle>
                        {error ? error.message : "Unauthorized"}
                    </AlertTitle>
                </Alert>
            </Sidebar>
        );
    }

    const initialValues: Omit<UpdatePostInput, "id"> = {
        title: dataPost.post.title,
        text: dataPost.post.text,
    };

    return (
        <Sidebar>
            <Formik initialValues={initialValues} onSubmit={onUpdatePostSubmit}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="Title"
                            label="Title"
                            type="text"
                        />

                        <Box mt={4}>
                            <InputField
                                textarea
                                name="text"
                                placeholder="Text"
                                label="Text"
                                type="textarea"
                            />
                        </Box>

                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                            mt={4}
                        >
                            <Button
                                type="submit"
                                colorScheme="teal"
                                isLoading={isSubmitting}
                            >
                                Update Post
                            </Button>
                            <NextLink href="/">
                                <Button>Go back to Homepage</Button>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Sidebar>
    );
};

export default EditPost;
