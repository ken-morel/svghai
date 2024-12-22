import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { createSseStream } from "@azure/core-sse";


const TOKEN = process.env["GITHUB_TOKEN"];
const ENDPOINT = "https://models.inference.ai.azure.com";

class Model {
  static getAll() {
    return ["Phi-3-mini-4k-instruct"].map(m => new Model(m));
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
CHATMESSAGEROLES = ["user", "system", "assistant"];


class Chat {
  constructor(model, messages=[]) {
    this.messages = new Array(messages);
    this.model = model;
  }
  async streamComplete* () {
    const sseStream = await this.model.stream_query(this);
    const message = new ChatMessage("assistant", "");
    this.messages.append(message);
    for await (const event of sseStream) {
      if (event.data === "[DONE]") {
        break;
      }
      for (const choice of (JSON.parse(event.data)).choices) {
        const text = choice.delta?.content ?? ``;
        message.content += text;
        yield text;
      }
    }
  }
  toPlain() {
    return self.messages.map(m => {'role': m.role, 'content': m.content})
  }
}
