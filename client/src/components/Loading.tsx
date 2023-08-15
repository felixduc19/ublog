import { Flex, Spinner } from "@chakra-ui/react";

export const Loading = () => (
    <Flex justifyContent="center" align="center" minH="100vh">
        <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="teal.100"
            color="teal.300"
            size="xl"
        />
    </Flex>
);
