import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Button, Stack } from "@chakra-ui/react";
import NextLink from "next/link";

interface PostEditDeleteButtonProps {
    postId: string;
}

const PostEditDeleteButton = (props: PostEditDeleteButtonProps) => {
    const { postId } = props;
    return (
        <Stack direction="row" spacing={4} mt={8}>
            <Button colorScheme="red" variant="solid">
                <DeleteIcon />
            </Button>
            <NextLink href={`/post/edit/${postId}`}>
                <Button colorScheme="blue" variant="solid">
                    <EditIcon color="white" />
                </Button>
            </NextLink>
        </Stack>
    );
};

export default PostEditDeleteButton;
