import { HStack, SpaceProps, Tag } from "@chakra-ui/react";
import React from "react";

interface IBlogTags {
    tags: Array<string>;
    marginTop?: SpaceProps["marginTop"];
}

export const PostTags: React.FC<IBlogTags> = (props) => {
    return (
        <HStack spacing={2} marginTop={props.marginTop}>
            {props.tags.map((tag) => {
                return (
                    <Tag
                        size={"md"}
                        variant="solid"
                        colorScheme="orange"
                        key={tag}
                    >
                        {tag}
                    </Tag>
                );
            })}
        </HStack>
    );
};
