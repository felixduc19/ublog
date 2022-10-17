import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import NextLink from "next/link";

import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Sidebar from "../components/Sidebar/Sidebar";
import { CreatePostInput, useCreatePostMutation } from "../generated/graphql";
import { mapErrorValidationErrorResponse } from "../helpers/mapErrorsResponse";
import { useCheckAuth } from "../utils/useCheckAuth";

const CreatePost = () => {
    const { data: _meData, loading: _meLoading } = useCheckAuth();

    const router = useRouter();

    const initialValues = { title: "", text: "" };

    const toast = useToast();

    const [createPost] = useCreatePostMutation();

    const onCreatePostSubmit = async (
        values: CreatePostInput,
        { setErrors }: FormikHelpers<CreatePostInput>
    ) => {
        try {
            const response = await createPost({
                variables: {
                    createPostInput: values,
                },
            });

            if (response.data?.createPost?.errors) {
                return setErrors(
                    mapErrorValidationErrorResponse(
                        response.data?.createPost.errors
                    )
                );
            }

            if (response.data?.createPost.success) {
                router.push("/");
                toast({
                    title: `Create Post Successfully`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                    containerStyle: {
                        marginTop: "100px",
                    },
                });
            }
        } catch (error) {}
    };

    return (
        <Sidebar>
            <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
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
                                Create Post
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

export default CreatePost;
