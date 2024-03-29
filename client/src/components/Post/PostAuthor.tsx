import { HStack, Image, Text } from "@chakra-ui/react";
import React from "react";

interface BlogAuthorProps {
    date: Date;
    name: string;
}

export const PostAuthor: React.FC<BlogAuthorProps> = (props) => {
    return (
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
            <Image
                borderRadius="full"
                boxSize="40px"
                src="https://100k-faces.glitch.me/random-image"
                alt={`Avatar of ${props.name}`}
            />
            <Text fontWeight="medium">{props.name}</Text>
            <Text>—</Text>
            <Text>{props.date.toDateString()}</Text>
        </HStack>
    );
};
