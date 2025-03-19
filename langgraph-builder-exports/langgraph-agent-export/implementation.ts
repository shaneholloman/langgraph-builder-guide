/* This file was generated using `langgraph-gen` version 0.0.3.

This file provides a placeholder implementation for the corresponding stub.

Replace the placeholder implementation with your own logic.
*/
import { Annotation } from "@langchain/langgraph";

import { CustomAgent } from "stub"

const agent = CustomAgent(Annotation.Root({ foo: Annotation<string>() }), {
    model: (state) => {
        console.log("In node: model")
        return {} // Add your state update logic here
    },
    tools: (state) => {
        console.log("In node: tools")
        return {} // Add your state update logic here
    },
    route_after_model: (state) => {
        console.log("In condition: route_after_model");
        throw new Error("Implement me. Returns one of the paths.");
    },
});

const compiled_agent = agent.compile();
console.log(await compiled_agent.invoke({ foo: "bar" }));