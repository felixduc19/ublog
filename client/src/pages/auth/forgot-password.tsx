import {
    Button,
    Flex,
    FormControl,
    Heading,
    Link,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";

import { useState } from "react";
import InputField from "../../components/InputField";
import { Loading } from "../../components/Loading";
import {
    ForgotPasswordInput,
    useForgotPasswordMutation,
} from "../../generated/graphql";
import { useCheckAuth } from "../../utils/useCheckAuth";

function ForgotPassword() {
    const [emailResetPassword, setEmailResetPassword] = useState("");

    const { data: meData, loading: meLoading } = useCheckAuth();

    const titleColor = useColorModeValue("teal.300", "teal.200");
    const textColor = useColorModeValue("gray.400", "white");

    const initialValues: ForgotPasswordInput = {
        email: "",
    };

    const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

    const onResetPasswordSubmit = async (values: ForgotPasswordInput) => {
        try {
            const response = await forgotPassword({
                variables: {
                    forgotPasswordInput: values,
                },
            });
            if (response?.data?.forgotPassword)
                setEmailResetPassword(values.email);
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
                    {!loading && data?.forgotPassword ? (
                        <Flex
                            direction="column"
                            w="100%"
                            background="transparent"
                            alignItems="center"
                            p="48px"
                            mt={{ md: "150px", lg: "80px" }}
                        >
                            <Text
                                color={textColor}
                                textAlign="center"
                                fontSize="16px"
                                mb="30px"
                            >
                                If an account exists for&nbsp;
                                {emailResetPassword}, you will get an email with
                                instructions on resetting your password. If it
                                doesn't arrive, be sure to check your spam
                                folder.
                            </Text>
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
                        </Flex>
                    ) : (
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
                                Enter your email to reset password
                            </Heading>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={onResetPasswordSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <FormControl>
                                            <InputField
                                                name="email"
                                                placeholder="Your email address"
                                                type="text"
                                                label="Email"
                                            />

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
                                            >
                                                RESET PASSWORD
                                            </Button>
                                        </FormControl>
                                    </Form>
                                )}
                            </Formik>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

export default ForgotPassword;
