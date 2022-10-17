import {
    Box,
    BoxProps,
    Button,
    CloseButton,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconType } from "react-icons";
import {
    FiCompass,
    FiHome,
    FiSettings,
    FiStar,
    FiTrendingUp,
} from "react-icons/fi";
import { NavItem } from "./NavItem";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome, href: "/" },
    { name: "Trending", icon: FiTrendingUp, href: "/" },
    { name: "Explore", icon: FiCompass, href: "/" },
    { name: "Favourites", icon: FiStar, href: "/" },
    { name: "Settings", icon: FiSettings, href: "/" },
];

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const router = useRouter();
    return (
        <Box
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Text
                    bgGradient="linear(to-l, #7928CA, #FF0080)"
                    bgClip="text"
                    fontSize="5xl"
                    fontFamily="monospace"
                    fontWeight="bold"
                >
                    UBLOG
                </Text>
                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            {router.pathname !== "/create-post" && (
                <Flex
                    h="20"
                    alignItems="center"
                    mx="8"
                    justifyContent="space-between"
                >
                    <Link href={"/create-post"} passHref>
                        <Button
                            as={"a"}
                            display={{ base: "inline-flex" }}
                            fontSize={"md"}
                            fontWeight={600}
                            color={"white"}
                            bg={"teal.400"}
                            _hover={{
                                bg: "teal.300",
                            }}
                        >
                            Create Post
                        </Button>
                    </Link>
                </Flex>
            )}

            {LinkItems.map((link) => (
                <Link href={link.href} passHref>
                    <NavItem key={link.name} icon={link.icon}>
                        {link.name}
                    </NavItem>
                </Link>
            ))}
        </Box>
    );
};
