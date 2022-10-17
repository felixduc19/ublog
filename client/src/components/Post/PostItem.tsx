import {
    Box,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { MeQuery } from "../../generated/graphql";
import { PostAuthor } from "./PostAuthor";
import PostEditDeleteButton from "./PostEditDeleteButton";
import { PostTags } from "./PostTag";

interface PostItemProps {
    id: string;
    title: string;
    text: string;
    createdAt: Date;
    user: {
        id: string;
        username: string;
    };
    dataMe: MeQuery | undefined;
}

const PostItem = (props: PostItemProps) => {
    const { id, title, text, createdAt, user, dataMe } = props;
    console.log(id);
    return (
        <NextLink href={`/post/${id}`}>
            <Stack marginBottom={{ base: "8", sm: "16" }}>
                <Box
                    marginTop={{ base: "1", sm: "5" }}
                    display="flex"
                    flexDirection={{ base: "column", sm: "row" }}
                    justifyContent="space-between"
                >
                    <Box
                        display="flex"
                        flex="1"
                        marginRight="3"
                        position="relative"
                        alignItems="center"
                    >
                        <Box
                            width={{ base: "100%", sm: "85%" }}
                            zIndex="2"
                            marginLeft={{ base: "0", sm: "5%" }}
                            marginTop="5%"
                        >
                            <Link
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                            >
                                <Image
                                    borderRadius="lg"
                                    src={
                                        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80"
                                    }
                                    alt="some good alt text"
                                    objectFit="contain"
                                />
                            </Link>
                        </Box>
                        <Box
                            zIndex="1"
                            width="100%"
                            position="absolute"
                            height="100%"
                        >
                            <Box
                                bgGradient={useColorModeValue(
                                    "radial(orange.600 1px, transparent 1px)",
                                    "radial(orange.300 1px, transparent 1px)"
                                )}
                                backgroundSize="20px 20px"
                                opacity="0.4"
                                height="100%"
                            />
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flex="1"
                        flexDirection="column"
                        justifyContent="center"
                        marginTop={{ base: "3", sm: "0" }}
                    >
                        <PostTags tags={["Engineering", "Product"]} />
                        <Heading marginTop="1">
                            <Link
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                            >
                                {title}
                            </Link>
                        </Heading>
                        <Text
                            as="p"
                            marginTop="2"
                            color={useColorModeValue("gray.700", "gray.200")}
                            fontSize="lg"
                            noOfLines={5}
                        >
                            {text}
                        </Text>
                        <PostAuthor
                            name={user?.username}
                            date={new Date(createdAt)}
                        />
                        {dataMe?.me && dataMe?.me?.id === user.id && (
                            <PostEditDeleteButton postId={id} />
                        )}
                    </Box>
                </Box>
            </Stack>
        </NextLink>
    );
};

export default PostItem;
