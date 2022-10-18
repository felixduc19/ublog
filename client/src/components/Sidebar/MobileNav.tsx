import {
    Avatar,
    Box,
    Button,
    Flex,
    FlexProps,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";

import {
    MeDocument,
    MeQuery,
    useLogoutMutation,
    useMeQuery,
} from "../../generated/graphql";

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { data, loading, error } = useMeQuery();

    const router = useRouter();

    const [logoutUser, _] = useLogoutMutation();
    const onLogout = async () => {
        try {
            await logoutUser({
                update(cache, { data }) {
                    if (data?.logout) {
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                me: null,
                            },
                        });
                    }
                },
            });
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) return null;

    const renderUserLoggedIn = () => {
        if (!data?.me)
            return (
                <Stack justify={"flex-end"} direction={"row"} spacing={6}>
                    <Link href={"/auth/login"} passHref>
                        <Button
                            as={"a"}
                            fontSize={"sm"}
                            fontWeight={400}
                            variant={"link"}
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Link href={"/auth/register"} passHref>
                        <Button
                            as={"a"}
                            display={{ base: "none", md: "inline-flex" }}
                            fontSize={"sm"}
                            fontWeight={600}
                            color={"white"}
                            bg={"teal.400"}
                            _hover={{
                                bg: "teal.300",
                            }}
                        >
                            Sign Up
                        </Button>
                    </Link>
                </Stack>
            );
        return (
            <HStack spacing={{ base: "0", md: "6" }}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />

                <Flex alignItems={"center"}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: "none" }}
                        >
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    src={
                                        "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                                    }
                                />
                                <VStack
                                    display={{ base: "none", md: "flex" }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2"
                                >
                                    <Text fontSize="sm">
                                        {data.me.username}
                                    </Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Admin
                                    </Text>
                                </VStack>
                                <Box display={{ base: "none", md: "flex" }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue("white", "gray.900")}
                            borderColor={useColorModeValue(
                                "gray.200",
                                "gray.700"
                            )}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={onLogout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        );
    };

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("white", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
                display={{ base: "flex", md: "none" }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold"
            >
                UBLOG
            </Text>
            {renderUserLoggedIn()}
            {/* {data?.me ? (
                <HStack spacing={{ base: "0", md: "6" }}>
                    <IconButton
                        size="lg"
                        variant="ghost"
                        aria-label="open menu"
                        icon={<FiBell />}
                    />
                    <Flex alignItems={"center"}>
                        <Menu>
                            <MenuButton
                                py={2}
                                transition="all 0.3s"
                                _focus={{ boxShadow: "none" }}
                            >
                                <HStack>
                                    <Avatar
                                        size={"sm"}
                                        src={
                                            "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                                        }
                                    />
                                    <VStack
                                        display={{ base: "none", md: "flex" }}
                                        alignItems="flex-start"
                                        spacing="1px"
                                        ml="2"
                                    >
                                        <Text fontSize="sm">Justina Clark</Text>
                                        <Text fontSize="xs" color="gray.600">
                                            Admin
                                        </Text>
                                    </VStack>
                                    <Box display={{ base: "none", md: "flex" }}>
                                        <FiChevronDown />
                                    </Box>
                                </HStack>
                            </MenuButton>
                            <MenuList
                                bg={useColorModeValue("white", "gray.900")}
                                borderColor={useColorModeValue(
                                    "gray.200",
                                    "gray.700"
                                )}
                            >
                                <MenuItem>Profile</MenuItem>
                                <MenuItem>Settings</MenuItem>
                                <MenuItem>Billing</MenuItem>
                                <MenuDivider />
                                <MenuItem>Sign out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </HStack>
            ) : (
                <Stack justify={"flex-end"} direction={"row"} spacing={6}>
                    <Link href={"/auth/login"} passHref>
                        <Button
                            as={"a"}
                            fontSize={"sm"}
                            fontWeight={400}
                            variant={"link"}
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Link href={"/auth/register"} passHref>
                        <Button
                            as={"a"}
                            display={{ base: "none", md: "inline-flex" }}
                            fontSize={"sm"}
                            fontWeight={600}
                            color={"white"}
                            bg={"teal.400"}
                            _hover={{
                                bg: "teal.300",
                            }}
                        >
                            Sign Up
                        </Button>
                    </Link>
                </Stack>
            )} */}
        </Flex>
    );
};
