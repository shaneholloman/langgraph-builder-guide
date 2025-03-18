/* This is an automatically generated file. Do not modify it.

This file was generated using `langgraph-gen` version 0.0.3.
To regenerate this file, run `langgraph-gen` with the source `YAML` file as an argument.

Usage:

1. Add the generated file to your project.
2. Create a new agent using the stub.

```typescript
import { CustomAgent } from "stub"


const StateAnnotation = Annotation.Root({
    // Define your state properties here
    foo: Annotation<string>(),
});

const agent = CustomAgentStub(Annotation.Root({ foo: Annotation<string>() }), {
    model: (state) => console.log("In node: model"),
    tools: (state) => console.log("In node: tools"),
    route_after_model: (state) => {
        console.log("In condition: route_after_model");
        throw new Error("Implement me. Returns one of the paths.");
    },
});

const compiled_agent = agent.compile();
console.log(await compiled_agent.invoke({ foo: "bar" }));
```

*/
import {
    StateGraph,
    START,
    END,
    type AnnotationRoot,
} from "@langchain/langgraph";

type AnyAnnotationRoot = AnnotationRoot<any>;

export function CustomAgent<TAnnotation extends AnyAnnotationRoot>(
  stateAnnotation: TAnnotation,
  impl: {
    model: (state: TAnnotation["State"]) => TAnnotation["Update"],
    tools: (state: TAnnotation["State"]) => TAnnotation["Update"],
    route_after_model: (state: TAnnotation["State"]) => string,
  }
) {
  return new StateGraph(stateAnnotation)
    .addNode("model", impl.model)
    .addNode("tools", impl.tools)
    .addEdge(START, "model")
    .addEdge("tools", "model")
    .addConditionalEdges(
        "model",
        impl.route_after_model,
        [
            "tools",
            END,
        ]
    )
}