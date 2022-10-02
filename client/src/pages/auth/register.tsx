import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Icon,
    Link,
    Switch,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
// Assets
import NextLink from "next/link";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

import { Form, Formik, FormikHelpers } from "formik";
import BgSignUp from "../../assets/img/BgSignUp.png";
import InputField from "../../components/InputField";
import { RegisterInput, useRegisterMutation } from "../../generated/graphql";
import { mapErrorValidationErrorResponse } from "../../helpers/mapErrorsResponse";
import { useRouter } from "next/router";

function Register() {
    const route = useRouter();

    const titleColor = useColorModeValue("teal.300", "teal.200");
    const textColor = useColorModeValue("gray.700", "white");
    const bgColor = useColorModeValue("white", "gray.700");
    const bgIcons = useColorModeValue("teal.200", "rgba(255, 255, 255, 0.5)");

    const initialValues: RegisterInput = {
        email: "",
        username: "",
        password: "",
    };

    const [registerUser] = useRegisterMutation();

    const onRegisterSubmit = async (
        values: RegisterInput,
        { setErrors }: FormikHelpers<RegisterInput>
    ) => {
        try {
            const response = await registerUser({
                variables: {
                    registerInput: values,
                },
            });

            if (response.data?.register.errors) {
                return setErrors(
                    mapErrorValidationErrorResponse(
                        response.data?.register.errors
                    )
                );
            }

            if (response.data?.register.success) {
                route.push("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Flex
            direction="column"
            alignSelf="center"
            justifySelf="center"
            overflow="hidden"
        >
            <Box
                position="absolute"
                minH={{ base: "70vh", md: "50vh" }}
                w={{ md: "calc(100vw - 50px)" }}
                borderRadius={{ md: "15px" }}
                left="0"
                right="0"
                bgRepeat="no-repeat"
                overflow="hidden"
                zIndex="-1"
                top="0"
                bgImage={BgSignUp.src}
                bgSize="cover"
                mx={{ md: "auto" }}
                mt={{ md: "14px" }}
            ></Box>
            <Flex
                direction="column"
                textAlign="center"
                justifyContent="center"
                align="center"
                mt="6.5rem"
                mb="30px"
            >
                <Text fontSize="4xl" color="white" fontWeight="bold">
                    Welcome!
                </Text>
                <Text
                    fontSize="md"
                    color="white"
                    fontWeight="normal"
                    mt="10px"
                    mb="26px"
                    w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
                >
                    Use these awesome forms to login or create new account in
                    your project for free.
                </Text>
            </Flex>
            <Flex
                alignItems="center"
                justifyContent="center"
                mb="60px"
                mt="20px"
            >
                <Flex
                    direction="column"
                    w="445px"
                    background="transparent"
                    borderRadius="15px"
                    p="40px"
                    mx={{ base: "100px" }}
                    bg={bgColor}
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Text
                        fontSize="xl"
                        color={textColor}
                        fontWeight="bold"
                        textAlign="center"
                        mb="22px"
                    >
                        Register With
                    </Text>
                    <HStack spacing="15px" justify="center" mb="22px">
                        <Flex
                            justify="center"
                            align="center"
                            w="75px"
                            h="75px"
                            borderRadius="15px"
                            border="1px solid lightgray"
                            cursor="pointer"
                            transition="all .25s ease"
                            _hover={{ filter: "brightness(120%)", bg: bgIcons }}
                        >
                            <Link href="#">
                                <Icon
                                    as={FaFacebook}
                                    w="30px"
                                    h="30px"
                                    _hover={{ filter: "brightness(120%)" }}
                                />
                            </Link>
                        </Flex>
                        <Flex
                            justify="center"
                            align="center"
                            w="75px"
                            h="75px"
                            borderRadius="15px"
                            border="1px solid lightgray"
                            cursor="pointer"
                            transition="all .25s ease"
                            _hover={{ filter: "brightness(120%)", bg: bgIcons }}
                        >
                            <Link href="#">
                                <Icon
                                    as={FaApple}
                                    w="30px"
                                    h="30px"
                                    _hover={{ filter: "brightness(120%)" }}
                                />
                            </Link>
                        </Flex>
                        <Flex
                            justify="center"
                            align="center"
                            w="75px"
                            h="75px"
                            borderRadius="15px"
                            border="1px solid lightgray"
                            cursor="pointer"
                            transition="all .25s ease"
                            _hover={{ filter: "brightness(120%)", bg: bgIcons }}
                        >
                            <Link href="#">
                                <Icon
                                    as={FaGoogle}
                                    w="30px"
                                    h="30px"
                                    _hover={{ filter: "brightness(120%)" }}
                                />
                            </Link>
                        </Flex>
                    </HStack>
                    <Text
                        fontSize="lg"
                        color="gray.400"
                        fontWeight="bold"
                        textAlign="center"
                        mb="22px"
                    >
                        or
                    </Text>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onRegisterSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <FormControl>
                                    <InputField
                                        name="username"
                                        placeholder="Your username"
                                        type="text"
                                        label="Username"
                                    />
                                    <InputField
                                        name="email"
                                        placeholder="Your email address"
                                        type="text"
                                        label="Email"
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
                                        mb="24px"
                                    >
                                        <Switch
                                            id="remember-login"
                                            colorScheme="teal"
                                            me="10px"
                                        />
                                        <FormLabel
                                            htmlFor="remember-login"
                                            mb="0"
                                            fontWeight="normal"
                                        >
                                            Remember me
                                        </FormLabel>
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        bg="teal.300"
                                        fontSize="10px"
                                        color="white"
                                        fontWeight="bold"
                                        w="100%"
                                        h="45"
                                        mb="24px"
                                        _hover={{
                                            bg: "teal.200",
                                        }}
                                        _active={{
                                            bg: "teal.400",
                                        }}
                                        isLoading={isSubmitting}
                                    >
                                        SIGN UP
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
                        <Text color={textColor} fontWeight="medium">
                            Already have an account?
                            <NextLink href="/auth/login">
                                <Link
                                    color={titleColor}
                                    as="span"
                                    ms="5px"
                                    href="#"
                                    fontWeight="bold"
                                >
                                    Sign In
                                </Link>
                            </NextLink>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Register;
