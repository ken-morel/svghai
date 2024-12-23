import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { createSseStream } from "@azure/core-sse";


const ENDPOINT = "https://models.inference.ai.azure.com";

const MODELS = [
  {
    img:  "/models-icons/meta.svg",
    name: "Meta-Llama-3.1-405B-Instruct"
  },
  {
    img: "/models-icons/openai.svg",
    name: "ChatGPT 4o",
  },
  {
    img: "/models-icons/phi.svg",
    name: "phi-3.5-mini instruct (128k)",
  }
];

class Model {
  static all() {
    return MODELS.map(({name}) => new Model(name));
  }
  static getClient() {
    if(!Model.client) {
      try {
        Model.client = new ModelClient(ENDPOINT, new AzureKeyCredential(TOKEN));
      }catch(e) {
        throw new Error("Error while creating client: " + e.toString());
      }
    }
    return Model.client;
  }
  constructor(name) {
    this.name = name;
  }
  image_path() {
    for(let img of MODELS) if(img.name == this.name) return img.img;
    return null;
  }
  async stream_query(chat) {
    const response = await Model.getClient().path("/chat/completions").post({
      body: {
        messages: chat.toPlain(),
        model: this.name,
        stream: true
      }
    }).asNodeStream();
    const stream = response.body;
    if (!stream) {
      throw new Error("The response stream is undefined");
    }

    if (response.status !== "200") {
      stream.destroy();
      throw new Error(`Failed to get chat completions, http operation failed with ${response.status} code`);
    }

    return createSseStream(stream);
  }
}
Model.client = null;

class ChatMessage {
  constructor(role, content) {
    this.role = role;
    this.content = content;
    if(!(role in CHATMESSAGEROLES)) {
      throw new Error(`Wrong role ${role} should be one of ${CHATMESSAGEROLES}`);
    }
  }
}

const CHATMESSAGEROLES = ["user", "system", "assistant"];

class Chat {
  constructor(model, messages) {
    this.messages = new Array(messages);
    this.model = model;
  }
  streamComplete() {
    return new Promise(function(res, rej) {
      this.model.stream_query(this)
        .then(function(sseStream) {
          const message = new ChatMessage("assistant", "");
          this.messages.append(message);
          res(function*() {
            for(const event of sseStream) {
              if (event.data === "[DONE]") {
                break;
              }
              for (const choice of JSON.parse(event.data).choices) {
                const text = choice.delta?.content ?? ``;
                message.content += text;
                yield text;
              }
            }
          });
        })
        .catch(rej);
    })
  }
}



export {Model, ChatMessage};