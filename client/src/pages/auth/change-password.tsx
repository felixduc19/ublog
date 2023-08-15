import {
    Button,
    Flex,
    FormControl,
    Heading,
    Link,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import InputField from "../../components/InputField";
import { Loading } from "../../components/Loading";
import {
    ChangePasswordInput,
    MeDocument,
    MeQuery,
    useChangePasswordMutation,
} from "../../generated/graphql";
import { mapErrorValidationErrorResponse } from "../../helpers/mapErrorsResponse";
import { useCheckAuth } from "../../utils/useCheckAuth";

interface InitialChangePasswordInput extends ChangePasswordInput {
    retypePassword: string;
}

function ChangePassword() {
    const router = useRouter();

    const toast = useToast();

    const { data: meData, loading: meLoading } = useCheckAuth();

    const [tokenError, setTokenError] = useState("");

    const { token = "", userId = "" } = router.query as {
        token: string;
        userId: string;
    };

    const titleColor = useColorModeValue("teal.300", "teal.200");
    const errorTitleColor = useColorModeValue("red.300", "red.200");

    const initialValues: InitialChangePasswordInput = {
        password: "",
        retypePassword: "",
    };

    // useEffect(() => {
    //     if (router && (!userId || !token)) {
    //         router.replace("/auth/forgot-password");
    //     }
    // }, [router]);

    const [changePassword] = useChangePasswordMutation();

    const onChangePassword = async (
        values: InitialChangePasswordInput,
        { setErrors }: FormikHelpers<InitialChangePasswordInput>
    ) => {
        if (values.password !== values.retypePassword)
            return setErrors({
                retypePassword: "Password and Retype password does not match",
            });

        try {
            const response = await changePassword({
                variables: {
                    token,
                    userId,
                    changePasswordInput: {
                        password: values.password,
                    },
                },

                update(cache, { data }) {
                    if (data?.changePassword.success) {
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                me: data?.changePassword.user,
                            },
                        });
                    }
                },
            });

            if (response.data?.changePassword.errors) {
                const fieldErrors = mapErrorValidationErrorResponse(
                    response.data?.changePassword.errors
                );
                setErrors(fieldErrors);
                if ("token" in fieldErrors) {
                    setTokenError(fieldErrors.token);
                }

                return;
            }

            if (response.data?.changePassword.success) {
                router.push("/");
                toast({
                    title: `Welcome back ${response.data?.changePassword?.user?.username}`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                    containerStyle: {
                        marginTop: "100px",
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (meLoading || (!meLoading && meData?.me)) {
        return <Loading />;
    }

    return (
        <Flex position="relative" mb="40px">
            <Flex
                h={{ sm: "initial", md: "75vh", lg: "85vh" }}
                w="100%"
                mx="auto"
                justifyContent="center"
                mb="30px"
                pt={{ sm: "100px", md: "0px" }}
            >
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    style={{ userSelect: "none" }}
                    w={{ base: "100%", md: "50%", lg: "30%" }}
                >
                    <Flex
                        direction="column"
                        w="100%"
                        background="transparent"
                        p="48px"
                        mt={{ md: "150px", lg: "80px" }}
                    >
                        <Heading
                            color={titleColor}
                            textAlign="center"
                            fontSize="32px"
                            mb="30px"
                        >
                            Change your password
                        </Heading>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onChangePassword}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <FormControl>
                                        <InputField
                                            name="password"
                                            placeholder="Your password"
                                            type="password"
                                            label="Password"
                                        />
                                        <InputField
                                            name="retypePassword"
                                            placeholder="Your retype password"
                                            type="password"
                                            label="Retype Password"
                                        />

                                        <Text
                                            color={errorTitleColor}
                                            textAlign="center"
                                            fontSize="16px"
                                            mb="10px"
                                            fontWeight={500}
                                        >
                                            {tokenError}
                                        </Text>

                                        <Button
                                            fontSize="14px"
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
                                            isLoading={isSubmitting}
                                            isDisabled={!!tokenError.length}
                                        >
                                            CHANGE PASSWORD
                                        </Button>
                                    </FormControl>
                                </Form>
                            )}
                        </Formik>
                        <Flex justifyContent="center">
                            {!!tokenError.length && (
                                <NextLink href="/auth/login" passHref>
                                    <Link
                                        color={titleColor}
                                        ms="5px"
                                        fontWeight="bold"
                                        mb="10px"
                                    >
                                        Back to Log in
                                    </Link>
                                </NextLink>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default ChangePassword;
