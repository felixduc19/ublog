import {
    Box,
    BoxProps,
    CloseButton,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
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
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Home", icon: FiHome },
    { name: "Trending", icon: FiTrendingUp },
    { name: "Explore", icon: FiCompass },
    { name: "Favourites", icon: FiStar },
    { name: "Settings", icon: FiSettings },
];

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
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
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};
