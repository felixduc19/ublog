import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Link,
    Switch,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";

import signInImage from "../../assets/img/signInImage.png";
import InputField from "../../components/InputField";
import { Loading } from "../../components/Loading";
import {
    LoginInput,
    MeDocument,
    MeQuery,
    useLoginMutation,
} from "../../generated/graphql";
import { mapErrorValidationErrorResponse } from "../../helpers/mapErrorsResponse";
import { useCheckAuth } from "../../utils/useCheckAuth";

function Login() {
    const route = useRouter();

    const { data: meData, loading: meLoading } = useCheckAuth();

    const toast = useToast();

    const titleColor = useColorModeValue("teal.300", "teal.200");
    const textColor = useColorModeValue("gray.400", "white");

    const initialValues: LoginInput = {
        usernameOrEmail: "",
        password: "",
    };

    const [loginUser, { loading: _loginUserLoading }] = useLoginMutation();

    const onLoginSubmit = async (
        values: LoginInput,
        { setErrors }: FormikHelpers<LoginInput>
    ) => {
        try {
            const response = await loginUser({
                variables: {
                    loginInput: values,
                },

                update(cache, { data }) {
                    if (data?.login.success) {
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                me: data?.login.user,
                            },
                        });
                    }
                },
            });
            if (response.data?.login.errors) {
                return setErrors(
                    mapErrorValidationErrorResponse(response.data?.login.errors)
                );
            }

            if (response.data?.login.success) {
                route.push("/");
                toast({
                    title: `Welcome ${response.data?.login?.user?.username}`,
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

    if (meLoading || (!meLoading && meData?.me)) {
        return <Loading />;
    }

    return (
        <Flex position="relative" mb="40px">
            <Flex
                h={{ sm: "initial", md: "75vh", lg: "85vh" }}
                w="100%"
                maxW="1044px"
                mx="auto"
                justifyContent="space-between"
                mb="30px"
                pt={{ sm: "100px", md: "0px" }}
            >
                <Flex
                    alignItems="center"
                    justifyContent="start"
                    style={{ userSelect: "none" }}
                    w={{ base: "100%", md: "50%", lg: "42%" }}
                >
                    <Flex
                        direction="column"
                        w="100%"
                        background="transparent"
                        p="48px"
                        mt={{ md: "150px", lg: "80px" }}
                    >
                        <Heading color={titleColor} fontSize="32px" mb="10px">
                            Welcome Back
                        </Heading>
                        <Text
                            mb="36px"
                            ms="4px"
                            color={textColor}
                            fontWeight="bold"
                            fontSize="14px"
                        >
                            Enter your email and password to sign in
                        </Text>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onLoginSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <FormControl>
                                        <InputField
                                            name="usernameOrEmail"
                                            placeholder="Your username or your email address"
                                            type="text"
                                            label="Username or Email"
                                        />
                                        <InputField
                                            name="password"
                                            placeholder="Your password"
                                            type="password"
                                            label="Password"
                                        />
                                        <FormControl
                                            display="flex"
                                            alignItems="center"
                                        >
                                            <Switch
                                                id="remember-login"
                                                colorScheme="teal"
                                                me="10px"
                                            />
                                            <FormLabel
                                                htmlFor="remember-login"
                                                mb="0"
                                                ms="1"
                                                fontWeight="normal"
                                            >
                                                Remember me
                                            </FormLabel>
                                        </FormControl>
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
                                            isLoading={isSubmitting}
                                        >
                                            SIGN IN
                                        </Button>
                                    </FormControl>
                                </Form>
                            )}
                        </Formik>

                        <Flex
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            maxW="100%"
                            mt="0px"
                        >
                            <NextLink href="/auth/forgot-password" passHref>
                                <Link
                                    color={titleColor}
                                    ms="5px"
                                    fontWeight="bold"
                                    mb="10px"
                                >
                                    Forgot password?
                                </Link>
                            </NextLink>
                            <Text color={textColor} fontWeight="medium">
                                Don't have an account?
                                <NextLink href="/auth/register" passHref>
                                    <Link
                                        color={titleColor}
                                        ms="5px"
                                        fontWeight="bold"
                                    >
                                        Sign up
                                    </Link>
                                </NextLink>
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Box
                    display={{ base: "none", md: "block" }}
                    overflowX="hidden"
                    h="100%"
                    w="40vw"
                    position="absolute"
                    right="0px"
                >
                    <Box
                        bgImage={signInImage.src}
                        w="100%"
                        h="100%"
                        bgSize="cover"
                        bgPosition="50%"
                        position="absolute"
                        borderBottomLeftRadius="20px"
                    />
                </Box>
            </Flex>
        </Flex>
    );
}

export default Login;
